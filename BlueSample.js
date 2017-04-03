function blueFilter(lightNumber, startCycle, maxTemp, minTemp, minDim, maxDim, numCycles, timeInc) {
    pause = 0;
    /*
	console.log("Light number:", lightNumber)
	console.log(startCycle)
    console.log(maxTemp)
    console.log(minTemp)
    console.log(numCycles)
    console.log(timeInc)
	*/
    if (config.system.mode.blueFilter.active == 1) {
        var updates;
        var daytime = 0;
		var briInt = ((maxDim - minDim) / (numCycles)) * 2
		console.log(briInt);
		console.log(numCycles)
        for (var x = 0; x <= numCycles; x++) {
            (function(x) {
				var CT = 0
				var bri = 0
                var timeNow = new Date().setFullYear(1970, 0, 1) / 1000
                var interval = (startCycle + (x * timeInc))
                var timeDiff = interval - timeNow
                if (timeDiff > 0 && timeDiff < timeInc) { //(interval >= timeNow) && (timeNow < nextInterval)) {

                    var thirds = numCycles / 3
                    if (x <= thirds) {
                        console.log("morning")
                        CT = minTemp + (x * 100)
						bri = parseInt(minDim) + (x * briInt)
						if(bri > 255){
							bri = 255
						}
                        console.log(CT)
                        console.log("BRI: ", bri)
                        console.log(x)
                    } else if (x > thirds && x < (2 * thirds)) {
                        console.log("Midday")
                        CT = maxTemp
						bri = maxDim
                        console.log(bri)
                        console.log(x)
                    } else if (x >= (2 * thirds)) {
                        console.log("evening")
                        CT = maxTemp - ((x - (numCycles / 2)) * 100)
						console.log("thing: ", (x- (numCycles / 2)));
						bri = parseInt(maxDim) - ((x - (numCycles / 2)) * briInt)
						if(bri < 0){
							bri = 1
						}
						console.log(bri)
                        console.log(CT)
                        console.log(x)
                    }
					
					bri = Math.round(255 * (bri/100));
					
                    if (CT >= 2000) {
                        var mireds = Math.round(1000000 / CT)
                        updates = {
                            "bri": bri,
                            "ct": mireds,
                            "transitiontime": parseInt(config.system.mode.adaptive.transition)
                        }
                    } else {
                        CT = CT - 1000
                        if (CT <= 0) {
                            updates = {
                                "bri": bri,
                                "xy": [tempXY[0].x, tempXY[0].y],
                                "transitiontime": parseInt(config.system.mode.adaptive.transition)
                            }
                        } else {
                            CT = CT / 100
                            updates = {
                                "bri": bri,
                                "xy": [tempXY[CT].x, tempXY[CT].y],
                                "transitiontime": parseInt(config.system.mode.adaptive.transition)
                            }
                        }
                    }
                    console.log("color temp: ", CT)
                    console.log("Brightness: ", bri)
                    console.log("Brightness Int: ", briInt)
                    daytime = 1;
                    config.system.mode.blueFilter.curCycle = updates
                }
                if (x == numCycles && daytime === 0) {
					bri = config.system.mode.blueFilter.minBright
					bri = Math.round(255 * (bri/100));
                    CT = config.system.mode.blueFilter.minTemp
                    if (CT >= 2000) {
                        var mireds = Math.round(1000000 / CT)
                        updates = {
                            "bri": bri,
                            "ct": mireds,
                            "transitiontime": parseInt(config.system.mode.adaptive.transition)
                        }
                    } else {
                        CT = CT - 1000
                        if (CT <= 0) {
                            updates = {
                                "bri": bri,
                                "xy": [tempXY[0].x, tempXY[0].y],
                                "transitiontime": parseInt(config.system.mode.adaptive.transition)
                            }
                            console.log("nighttime")
                            console.log(JSON.stringify(updates))
                            config.system.mode.blueFilter.curCycle = updates
                            return updates
                        } else {
                            console.log("nighttime")
                            CT = CT / 100
                            updates = {
                                "bri": bri,
                                "xy": [tempXY[CT].x, tempXY[CT].y],
                                "transitiontime": parseInt(config.system.mode.adaptive.transition)
                            }
                        }
                    }
                }
            })(x)
        }
        console.log("UPDATES:", updates)
        putRequest(lightNumber, updates)
		return updates
    }
}
