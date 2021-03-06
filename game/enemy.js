class Enemy
{
	constructor (game, position, speed, hp, pattern, poly, color = GLOBALS['color']['enemy']['main'])
	{
		if (!check_type(game, 'object'))
		{
			throw LANG['error']['game']['enemy']['game_type'];
		}
		if (!check_type(position, 'array', [2], true))
		{
			throw LANG['error']['game']['enemy']['position_type'];
		}
		if (!check_type(speed, 'array', [2], true))
		{
			throw LANG['error']['game']['enemy']['speed_type'];
		}
		if (!check_type(hp, 'number', [], true))
		{
			throw LANG['error']['game']['enemy']['hp_type'];
		}
		if (!check_type(pattern, 'array', ['.', 2], true))
		{
			throw LANG['error']['game']['enemy']['pattern_type'];
		}
		if (!check_type(poly, 'array', ['.', 2], true))
		{
			throw LANG['error']['game']['enemy']['poly_type'];
		}
		if (!check_type(color[CONFIG['game']['color-scheme']], 'array', [3], true))
		{
			throw 'color has an unexpected type or value';
		}
		this.step = 0;
		this.game = game;
		this.position = position;
		this.speed = speed;
		this.hp = hp;
		this.pattern = pattern;
		this.poly = GLOBALS['screen'].to_poly(this.position, GLOBALS['screen'].to_vectors(poly));
		this.color = color[CONFIG['game']['color-scheme']];
		this.draw();
	}

	draw ()
	/* Draw the enemy in the present position */
	{
		GLOBALS['screen'].draw_poly(this.poly, this.color);
	}

	check_coordinate (coordinate)
	/* Checks if the enemy is drawable, destroy it if not*/
	{
		if (!check_type(coordinate, 'array', [2], true))
		{
			throw LANG['error']['game']['enemy']['check_coordinate']['coordinate_type'];
		}
		let directions = [0, 1];
		for (let direction of directions)
		{
			if (coordinate[direction] < CONFIG['game']['border'][direction]['min'])
			{
				return false;
			}
			else if (coordinate[direction] > CONFIG['game']['border'][direction]['max'])
			{
				return false;
			}
		}
		return true;
	}

	move ()
	/* Moves the enemy */
	{
		if (this.step > this.pattern.length - 1)
		{
			this.step = 0;
		}
		let coordinate = [this.speed[0]*this.pattern[this.step][0]+this.position[0], this.speed[1]*this.pattern[this.step][1]+this.position[1]]
		if (this.check_coordinate(coordinate))
		{
			this.position = coordinate;
			this.poly = GLOBALS['screen'].to_poly(this.position, GLOBALS['screen'].to_vectors(this.poly));
			this.step++;
		}
		else
		{
			this.destroy();
		}
	}

	take_damage (damage)
	{
		if (!check_type(damage, 'number', [], true))
		{
			throw LANG['error']['game']['enemy']['take_damage']['damage_type'];
		}
		this.hp -= damage;
		if (this.hp < 1)
		{
			this.destroy();
		}
	}

	destroy ()
	/* Destroy the enemy */
	{
		this.game.enemies.splice(this.game.enemies.indexOf(this), 1);
	}

	check_collision ()
	/* Checks if this enemy collide with a shoot or the ship */
	{
		for (let shoot of this.game.shoots)
		{
			if (GLOBALS['screen'].check_collision(shoot.poly, this.poly))
			{
				shoot.is_destroyed = true;
				this.take_damage(CONFIG['game']['shoot']['damage']);
				return true;
			}
		}
		if (GLOBALS['screen'].check_collision(this.game.ship.poly, this.poly))
		{
			this.take_damage(CONFIG['game']['collision_damage']);
			this.game.ship.take_damage(CONFIG['game']['collision_damage']);
			return true;
		}
		return false;
	}

	shoot ()
	/* Makes the enemy shoot */
	{
		this.game.create_shoot(this.position, [0, CONFIG['game']['shoot']['speed'][0]], CONFIG['game']['shoot']['poly']);
	}
}
