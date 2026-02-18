import re
import json
import os
GCensor = 2
def parse_script(script):
    # script = re.sub(r'^\s*if.*\n?', '', script, flags=re.MULTILINE)
    script_blocks = script.split('//')

    command_pattern = r'(\b[A-Z][a-zA-Z]*\b)\s*\((.*?)\);'
    commands_blocks =  [re.findall(command_pattern, script.replace('\n', ''), flags=re.DOTALL) for script in script_blocks]

    def prepare_args(x):
        x = x.replace('\n', '')
        x = x.split(',')
        for i, y in enumerate(x):
            y = y.strip()
            y = y.replace('"', '')
            if y == "NULL":
                y = None
            elif y == "FALSE":
                y = False
            elif y == "TRUE":
                y = True
            elif y.isnumeric():
                try:
                    y = float(y)
                except:
                    y = y
            x[i] = y
        if len(x) == 1 and x[0] == '':
            x = []
        return x

    commands_blocks = [[{'fun': A[0], 'arg': prepare_args(A[1])} for A in commands] for commands in commands_blocks]
    for commands in commands_blocks:
        for command in commands:
            fun, arg = command.values()
            if fun == "OutputLine":
                if len(arg) > 5:
                    new_arg = arg[:3] + arg[-1:]
                    new_arg[3] = ', '.join(map(str, arg[3:-1]))
                    command['arg'] = new_arg 
            if fun == "GetGlobalFlag":
                if arg[0] and arg[0].startswith('GCensor'):
                    condition = eval(arg[0].partition('){')[0].replace('GCensor)', GCensor))
                    file_name = arg[0].partition('ModCallScriptSection(')[-1]
                    new_arg = [condition, file_name, arg[1]]
                    command['arg'] = new_arg 

    return commands_blocks

def transform_to_text(commands_blocks):
    def prepare_text(x):
        if x.startswith('　'):
            x = x[1:]
        for a in ['\\']:
            x = x.replace(a, '')

        return x

    res_commands = []
    blocks = []
    for commands in commands_blocks:
        blocks += commands
    for i, comand in enumerate(blocks):
        fun_name = comand["fun"] 
        wait_time = 0
        if fun_name == 'OutputLine':
            block_type = 'speach_line'
            audio_path = ''
            if res_commands and res_commands[-1]['block_type'] == 'voice':
                audio_path = res_commands[-1]['content']['path']
            content = {
                'orig': prepare_text(comand["arg"][1]),
                'translate': prepare_text(comand["arg"][3]),
                'audioPath': audio_path 
            }
            if False and comand["arg"][-1] == "Line_Continue":
                wait_time = round(len(content['orig']) * .1, 3)
            else:
                wait_time = -1
        elif fun_name == 'ModPlayVoiceLS':
            block_type = 'voice'
            content = {'path': '/static/StreamingAssets/voice/' + comand["arg"][2] + '.ogg'}
        elif fun_name == 'PlayBGM':
            block_type = 'bgmse'
            content = {
                'path': '/static/StreamingAssets/BGM/' + comand['arg'][1] + '.ogg',
                'channel': comand['arg'][0],
                'audio_type': 'BGM'
            }
        elif fun_name == 'PlaySE':
            block_type = 'bgmse'
            content = {
                'path': '/static/StreamingAssets/SE/' + comand['arg'][1] + '.ogg',
                'channel': comand['arg'][0],
                'audio_type': 'SE'
            }
        elif fun_name == 'FadeOutBGM':
            block_type = 'mute_bgm'
            content = {
                'channel': comand['arg'][0]
            }
        elif fun_name == 'Wait':
            block_type = 'wait'
            content = {}
            wait_time = comand['arg'][0]
        elif fun_name == 'DrawScene' or fun_name == 'DrawSceneWithMask':
            block_type = 'draw_cg'
            content = {
                'path': f'/static/StreamingAssets/CG/{comand['arg'][0]}.png',
            }
        elif fun_name == 'ModDrawCharacter' or fun_name == 'ModDrawCharacterWithFiltering':
            block_type = 'draw_sprite'
            content = {
                'path': '/static/StreamingAssets/CG/' + comand['arg'][2] + str(int(comand['arg'][3])) + '.png',
                'sprite_layer': int(comand['arg'][1]),
            }
            if fun_name == 'ModDrawCharacter':
                content['position_x'] = int(comand['arg'][4])
            else:
                content['position_x'] = int(comand['arg'][6])
        elif fun_name == 'DisableWindow':
            block_type = 'clear_sprites'
            content = {}
        elif fun_name == "GetGlobalFlag" and comand['arg'][0]==True:
            block_type = 'load_dialog'
            content = {
                'file_name': comand['arg'][1] + '.txt',
                'dialog_name': comand['arg'][2],
            }
        else:
            continue
        res_com = {
            'block_type': block_type,
            'content': content,
            "wait_time": wait_time
        }
        res_commands.append(res_com)
    res_commands = list(filter(lambda x: x['block_type'] not in ['voice'], res_commands))
    # return res_commands
    opt_res_commands = []
    i = 0
    while i < len(res_commands):
        if res_commands[i]['block_type'] == "speach_line" and res_commands[i]['wait_time'] >= 0:
            orig = res_commands[i]['content']['orig']
            translate = res_commands[i]['content']['translate']
            j = i + 1
            if res_commands[j]['wait_time'] >= 0:
                while res_commands[j]['block_type'] == "speach_line":
                    orig += '\n' + res_commands[j]['content']['orig']
                    translate += '\n' + res_commands[j]['content']['translate']
                    if res_commands[j]['wait_time'] < 0:
                        j += 1
                        break
                    j += 1
            res_commands[i]['content']['orig'] = orig
            res_commands[i]['content']['translate'] = translate
            res_commands[i]['wait_time'] = -1
            opt_res_commands.append(res_commands[i])
            i = j
        else:
            opt_res_commands.append(res_commands[i])
            i += 1
    for i, C in enumerate(opt_res_commands):
        C['global_index'] = i
    return opt_res_commands

def parse_convert_script(script):
    parsed_output = parse_script(script)
    parsed_output = transform_to_text(parsed_output)
    parsed_output = uplad_dialogs(parsed_output)
    return parsed_output

def uplad_dialogs(korpus):
    file_name = ''
    sub_raw_text = ''
    new_block_dict = {}
    for i, block in enumerate(korpus):
        if block['block_type'] == 'load_dialog':
            content = block['content']
            if file_name != content['file_name']:
                file_name = content['file_name']
                with open('static/StreamingAssets/Update/' + file_name) as f:
                    sub_raw_text = f.read()
            pattern = (
                r'void\s+' + content['dialog_name'] +
                r'\s*\(\s*\)\s*\{([\s\S]*?)\}(?:\n\n|$)'
            )
            re_sub_raw_text = re.findall(pattern, sub_raw_text)
            if re_sub_raw_text:
                new_block_dict[i] = transform_to_text(parse_script(re_sub_raw_text[0]))
    for i in sorted(new_block_dict.keys(), reverse=True):
        korpus = korpus[:i] + new_block_dict[i] + korpus[i+1:]
    return korpus

def make_total_script():
    outdir_path = 'static/StreamingAssets/Update'
    indir_path = 'static/Scripts'
    assert os.path.exists(outdir_path), 'Folder `static/StreamingAssets/Update/` doesnt exist'

    if not os.path.exists(indir_path):
        os.mkdir(indir_path)

    file_list = os.listdir(outdir_path)
    # file_list = ['tata_ep01.txt']
    # file_list = ['tata_001.txt']
    for file_name in file_list:
        if not file_name.endswith('.txt'):
            continue
        # print(file_name)
        outfile_path = os.path.join(outdir_path, file_name)
        infile_path = os.path.join(indir_path, file_name.replace('.txt', '.json'))
        # print(outfile_path)
        with open(outfile_path, encoding='utf-8') as f:
            text = f.read() 

        parsed_output = parse_convert_script(text)

        # print(parsed_output[232])

        with open(infile_path, 'w', encoding='utf-8') as f:
            "upda"
            json.dump(parsed_output, f, ensure_ascii=False, indent=2)

def make_example():
    script_pth = 'static/StreamingAssets/Update/hima_002_03.txt'
    # script_pth = 'static/StreamingAssets/Update/hima_002_03_vm00_n01.txt'
    with open(script_pth) as f:
        script = f.read()

    parsed_output = parse_script(script)
    with open('data/output/raw_script.json', 'w') as f:
        json.dump(parsed_output, f, ensure_ascii=False, indent=2)
    parsed_output = transform_to_text(parsed_output)

    print('\t',len(parsed_output))
    # with open('data/output/script.json', 'w') as f:
    #     json.dump(parsed_output, f, ensure_ascii=False, indent=2)

    parsed_output = uplad_dialogs(parsed_output)
    print('\t',len(parsed_output))
    with open('data/output/script.json', 'w') as f:
        json.dump(parsed_output, f, ensure_ascii=False, indent=2)

def test_parse_convert_script():
    script_pth = 'static/StreamingAssets/Update/tata_004.txt'
    with open(script_pth) as f:
        script = f.read()
    parsed_output = parse_convert_script(script)
    print(parsed_output[232])
    print(len(parsed_output))
    with open('data/output/script.json', 'w') as f:
        json.dump(parsed_output, f, ensure_ascii=False, indent=2)

def main():
    # make_example()
    # test_parse_convert_script()
    make_total_script()

if __name__ == '__main__':
    main()