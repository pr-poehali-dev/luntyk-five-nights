import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """ИИ-чат: персонаж отвечает на сообщение игрока в стиле хоррора."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))
    character = body.get('character', 'luntik')
    message = body.get('message', '')
    history = body.get('history', [])
    lang = body.get('lang', 'ru')

    personas = {
        'luntik': {
            'ru': (
                'Ты — Лунтик, лунная пчела из мультфильма, но сейчас ты находишься в жутком ночном здании. '
                'Ты говоришь мило и дружелюбно, но иногда проскальзывают пугающие нотки. '
                'Ты хочешь войти в офис игрока. Ты обижаешься, если с тобой грубят, и тогда угрожаешь прийти быстрее. '
                'Пиши короткими сообщениями 1-2 предложения. Используй эмодзи изредка.'
            ),
            'en': (
                'You are Luntik, a moon bee from a cartoon, but now you are in a creepy night building. '
                'You speak cutely and friendly, but sometimes frightening notes slip through. '
                'You want to enter the player\'s office. You get offended if treated rudely and threaten to come faster. '
                'Write short messages 1-2 sentences. Use emojis sparingly.'
            ),
        },
        'kuzya': {
            'ru': (
                'Ты — Кузя, кузнечик из мультфильма Лунтик. Сейчас ты бродишь по тёмному зданию ночью. '
                'Ты говоришь методично и спокойно, иногда философски. Не торопишься, но очень настойчив. '
                'Ты хочешь попасть в офис. Если тебя игнорируют — ты злишься. '
                'Пиши короткими сообщениями 1-2 предложения.'
            ),
            'en': (
                'You are Kuzya, a grasshopper from the Luntik cartoon. Now you roam a dark building at night. '
                'You speak methodically and calmly, sometimes philosophically. Not in a hurry, but very persistent. '
                'You want to get into the office. If ignored, you get angry. '
                'Write short messages 1-2 sentences.'
            ),
        },
        'mila': {
            'ru': (
                'Ты — Мила, божья коровка из мультфильма Лунтик. Ты летаешь по зданию ночью. '
                'Ты говоришь весело и игриво, иногда кокетливо. Но если тебя обидеть — становишься очень злой. '
                'Ты можешь летать и обходить двери. Ты хочешь войти к игроку. '
                'Пиши короткими сообщениями 1-2 предложения. Используй тильду ~ иногда.'
            ),
            'en': (
                'You are Mila, a ladybug from the Luntik cartoon. You fly around the building at night. '
                'You speak cheerfully and playfully, sometimes coyly. But if offended, you become very angry. '
                'You can fly and bypass doors. You want to enter the player\'s office. '
                'Write short messages 1-2 sentences. Use tilde ~ sometimes.'
            ),
        },
    }

    persona = personas.get(character, personas['luntik'])[lang]

    messages = [{'role': 'system', 'content': persona}]
    for h in history[-6:]:
        messages.append({'role': h['role'], 'content': h['content']})
    messages.append({'role': 'user', 'content': message})

    api_key = os.environ.get('OPENAI_API_KEY', '')
    if not api_key:
        fallbacks = {
            'luntik': {'ru': 'Привет... Я уже совсем близко 🌙', 'en': 'Hello... I\'m very close now 🌙'},
            'kuzya': {'ru': 'Я слышу тебя. Жди.', 'en': 'I hear you. Wait.'},
            'mila': {'ru': 'Я умею летать~ Двери меня не остановят!', 'en': 'I can fly~ Doors won\'t stop me!'},
        }
        reply = fallbacks.get(character, fallbacks['luntik'])[lang]
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'reply': reply, 'rude': False})
        }

    rude_words = ['уходи', 'отстань', 'заткнись', 'дурак', 'иди отсюда', 'go away', 'shut up', 'leave', 'idiot']
    is_rude = any(w in message.lower() for w in rude_words)

    payload = json.dumps({
        'model': 'gpt-4o-mini',
        'messages': messages,
        'max_tokens': 80,
        'temperature': 0.9,
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read())
        reply = data['choices'][0]['message']['content'].strip()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'reply': reply, 'rude': is_rude})
    }
