document.getElementById('game').height=(CONFIG['game']['border'][1]['max']-CONFIG['game']['border'][1]['min']);
document.getElementById('game').width=(CONFIG['game']['border'][0]['max']-CONFIG['game']['border'][0]['min']);
document.getElementsByTagName('title')[0].removeChild(document.getElementsByTagName('title')[0].childNodes[0]);
document.getElementsByTagName('title')[0].appendChild(document.createTextNode(LANG['page']['title']));
