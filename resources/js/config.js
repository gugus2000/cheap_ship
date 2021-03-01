var CONFIG={
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

CONFIG['lang_available']=['en'];
/* [USER] */
/* User langage */
CONFIG.__get('user')['lang']='en';
/* [/USER] */
/* [GAME] */
/* Damage done when collision occurs */
CONFIG.__get('game')['collision_damage']=2;
/* [LEVEL] */
/* level 1 */
CONFIG.__get('game').__get('level')[0]='./level/1.json';
/* [SHORTCUT] */
/* Pause the game */
CONFIG.__get('game').__get('shortcut')['pause']='p';
/* Go to left */
CONFIG.__get('game').__get('shortcut')['left']='ArrowLeft';
/* Go to right */
CONFIG.__get('game').__get('shortcut')['right']='ArrowRight';
/* Go down */
CONFIG.__get('game').__get('shortcut')['down']='ArrowDown';
/* Go up */
CONFIG.__get('game').__get('shortcut')['up']='ArrowUp';
/* Shoot a missile */
CONFIG.__get('game').__get('shortcut')['shoot']=' ';
/* [/SHORTCUT] */
/* [BORDER] */
/* [0] */
/* Minimum x possible */
CONFIG.__get('game').__get('border').__get(0)['min']=0;
/* Maximum x possible */
CONFIG.__get('game').__get('border').__get(0)['max']=300;
/* [/0] */
/* [1] */
/* Minimum y possible */
CONFIG.__get('game').__get('border').__get(1)['min']=0;
/* Maximum y possible */
CONFIG.__get('game').__get('border').__get(1)['max']=500;
/* [/1] */
/* [/BORDER] */
/* [SHIP] */
/* Base HP of the ship */
CONFIG.__get('game').__get('ship')['hp']=3;
/* Base speed of the ship */
CONFIG.__get('game').__get('ship')['speed']=5;
/* Poly of the ship */
CONFIG.__get('game').__get('ship')['poly']=[[25, 25], [50, 0], [25, 50], [0, 0]];
/* [COOLDOWN] */
/* Number of frame during ship invincibility */
CONFIG.__get('game').__get('ship').__get('cooldown')['invincible_time']=30;
/* Number of frame between each shoot */
CONFIG.__get('game').__get('ship').__get('cooldown')['shoot_time']=30;
/* [/COOLDOWN] */
/* [/SHIP] */
/* [SHOOT] */
/* Base speed of missile */
CONFIG.__get('game').__get('shoot')['speed']=5;
/* Base poly of missile */
CONFIG.__get('game').__get('shoot')['poly']=[[0, 0], [50, 0], [15, 50], [15, 0]];
/* Base damage done by missile */
CONFIG.__get('game').__get('shoot')['damage']=1;
/* [/SHOOT] */
/* [/GAME] */
