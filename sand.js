let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let width = canvas.width
let height = canvas.height
let desert = []
for (let y = 0; y < height; y++) {
	desert.push([])
	for (let x = 0; x < width; x++) {
		desert[y].push(5)
	}
}


let avalanche = function(top_x,top_y,bot_x,bot_y) {
	top_x = top_x % width
	if (top_x < 0) {
		top_x += width
	}
	bot_x = bot_x % width
	if (bot_x < 0) {
		bot_x += width
	}
	top_y = top_y % height
	if (top_y < 0) {
		top_y += height
	}
	bot_y = bot_y % height
	if (bot_y < 0) {
		bot_y += height
	}

	if (desert[top_y][top_x] - desert[bot_y][bot_x] >= 3) {
		remove_grain(top_x,top_y)
		add_grain(bot_x,bot_y)
	}
}

let add_grain = function(x,y) {
	desert[y][x] += 1

	avalanche(x,y,x+1,y)
	avalanche(x,y,x-1,y)
	avalanche(x,y,x,y-1)
	avalanche(x,y,x,y+1)
}

let remove_grain = function(x,y) {
	desert[y][x] -= 1

	avalanche(x-1,y,x,y)
	avalanche(x+1,y,x,y)
	avalanche(x,y-1,x,y)
	avalanche(x,y+1,x,y)
}


let is_sheltered = function(x,y) {
	let steps = 1
	while (steps < width) {
		let new_x = (x - steps) % width
		if (new_x < 0) {
			new_x += width
		}
		let height = desert[y][new_x] - desert[y][x]
		if (height >= steps) {
			return true
		}
		steps += 1
	}
	return false
}


let blow_grain = function() {
	let x = Math.floor(Math.random()*width)
	let y = Math.floor(Math.random()*height)
	while (desert[y][x] === 0 || is_sheltered(x,y)) {
		x = Math.floor(Math.random()*width)
		y = Math.floor(Math.random()*height)
	}

	remove_grain(x,y)
	let new_x = (x + 2) % width
	add_grain(new_x,y)
}


let draw = function() {
	for (let i = 0; i < 1000; i++) {
		blow_grain()
	}

	let img = ctx.createImageData(width,height)
	
	let i = 0
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let brightness = desert[y][x] / 10
			if (brightness > 1) {
				brightness = 1
			}

			img.data[i] = 255 * brightness //red
			img.data[i+1] = 230 * brightness //green
			img.data[i+2] = 160 * brightness //blue
			img.data[i+3] = 255 //alpha

			i += 4
		}
	}

	ctx.putImageData(img,0,0)

	requestAnimationFrame(draw)
}

draw()