function checkArray ( arr, obj ) {

    for ( var i = 0; i < arr.length; i++ ) {

        if (arr[i] == obj)return true;

    }
}

function findRandom ( atleast , max ){

	var random = 0,
		max = max - atleast;

	random = Math.floor(Math.random() * (max) + atleast);

	return random;
}

exports.checkArray = checkArray;
exports.findRandom =findRandom;

