var GLOBALS = {
	__get: function(key)
	{
		if (this[key] === undefined)
		{
			this[key] = {
					__get: arguments.callee,
				};
		}
		return this[key];
	}
};

GLOBALS['time'] = Date.now();
GLOBALS.__get('core')['scripts'] = ['main.js'];
GLOBALS['keys_pressed'] = [];

document.addEventListener('keydown', (e) => {
	GLOBALS.__get('keys_pressed')[e.key]=true;
	if (GLOBALS['game'] !== undefined)
	{
		if (!GLOBALS['game'].is_ended && e.key === CONFIG['game']['shortcut']['unpause'] && !GLOBALS['game'].is_running)
		{
			GLOBALS['game'].run();
		}
	}
});
document.addEventListener('keyup', (e) => {
	delete GLOBALS.__get('keys_pressed')[e.key];
});

async function get_json (path, callback)
{
	return callback(await fetch(path).then(response => response.json()));
}

function check_type(value, type = 'boolean', structure = [], notNan = false)
{
	/* Check type of args */
	if (!Object.prototype.toString.call(type) === '[object String]')
	{
		throw LANG['error']['check_type']['type_type'];
	}
	if (!Object.prototype.toString.call(structure) === '[object Array]')
	{
		throw LANG['error']['check_type']['structure_type'];
	}
	if (!Object.prototype.toString.call(notNan) === '[object Boolean]')
	{
		throw LANG['error']['check_type']['notNan_type'];
	}


	type = type.toLowerCase(); // force lowercase for better unicity
	var list_type = ['string', 'number', 'bigint', 'symbol', 'boolean', 'undefined', 'function', 'null', 'object']; // typeof possibilities
	if (list_type.indexOf(type) !== -1) // can be spotted with typeof
	{
		if (typeof(value) === type) // good type
		{
			if (type === 'string') // we can check the length
			{
				if (structure[0] !== '.')
				{
					return value.length === structure[0];
				}
			}
			if (type === 'number') // we can check if it's NaN if needed
			{
				if (notNan) // we want to check
				{
					return notNan === !Number.isNaN(value);
				}
				return true;
			}
			return true;
		}
		return false; // bad type
	}

	let actual_type = Object.prototype.toString.call(value); // cannot be checked with typeof, check other possibilities
	if (!actual_type.substring(actual_type.indexOf(' '), actual_type.indexOf(']')).toLowerCase() === type) // bad type
	{
		return false
	}

	if (type !== 'array') // cannot check structure and not a number (NaN check), so it's good
	{
		return true;
	}

	/* Value is an array */
	if (structure.length < 1) // check if the structure is empty, which does not make sense
	{
		return false;
	}
	if (value.length !== structure[0] && structure[0] !== '.') // check if there is the same number of elements than we want, '.' si a joker, which mean we don't need to check the size
	{
		return false;
	}
	for (let i = 0; i < value.length; i++) // we check each element
	{
		if (Array.isArray(value[i])) // the element is a list
		{
			if (!Array.isArray(structure[1])) // the structure corresponding to it's level is not a list
			{
				if (!check_type(structure[1], 'number', [], true)) // a single number mean each list element of the value has the same length
				{
					return false;
				}
				if (!check_type(value[i], type='array', [structure[1]], notNan))
				{
					return false;
				}
			}
			else if (!check_type(value[i], type='array', structure[1][i], notNan))
			{
				return false;
			}
		}
		else // the element is another object
		{
			if (notNan) // we want to checks what this element is
			{
				if (notNan === Number.isNaN(value[i]))
				{
					return false;
				}
			}
		}
	}
	return true; // all the array is checked
}

async function include(src, strict=true)
{
	if (GLOBALS['core']['scripts'].indexOf(src)===-1) // The file is not already loaded
	{
		if (typeof(src) !== 'string')
		{
			throw src+LANG['error']['include']['type'];
		}
		// Construction of the script element
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', src);

		GLOBALS['core']['scripts'].push(src); // The script is now considered as loaded

		document.getElementsByTagName('head')[0].appendChild(script); // The script is now added to the HTML

		let script_loaded = new Promise(function(resolve, reject)
			{
				if (script !== undefined) // no issue
				{
					script.addEventListener('load', () => { // Wait the file is loaded
						resolve(0);
					});
				}
				else // error
				{
					reject(LANG['error']['include']['load']+src);
				}
			});
		return script_loaded.then(function(value)
			{
				return value;
			}, function(error)
			{
				throw error;
			});
	}
	else
	{
		if (strict)
		{
			throw src+LANG['error']['include']['strict'];
		}
	}
}

var LANG = {};
async function init()
{
	try
	{
		await include('./resources/config.js');
		await include('./resources/lang.js');
		LANG = await load_lang();
		GLOBALS['canvas'] = document.getElementById('game');
		await include('./resources/screen.js');
		await include('./resources/style.js');
		await include('./game/main.js');
		await load();
		GLOBALS['game'] = new Game();
		GLOBALS['game'].run();
	}
	catch (error)
	{
		console.log(error+' in :\n'+error.stack);
	}
};

init();
