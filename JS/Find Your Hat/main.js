const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this._field = field;
    }

    print() {
        for(let i = 0; i < this._field.length; i++) {
            console.log(this._field[i].join(''));
        }
    }

    static generateField(width, height, holesPerc) {
        const fieldArea = width * height;
        let holesNum = holesPerc / 100 * fieldArea;
        const field = [];

        for(let i = 0; i < height; i++) {
            field[i] = [];
            for(let j = 0; j < width; j++) {
                if(i === 0 && j === 0) {
                    field[i][j] = pathCharacter;
                } else {
                    field[i][j] = fieldCharacter;
                }
            }
        }

        while(holesNum > 0) {
            let randY = Math.floor(Math.random() * height);
            let randX = Math.floor(Math.random() * width);

            holesNum--;
            
            if(field[randY][randX] !== hole && field[randY][randX] !== pathCharacter) {
                field[randY][randX] = hole;
            } else {
                holesNum++;
            }

        }

        let hatCount = 1;
        while(hatCount > 0) {
            let randY = Math.floor(Math.random() * height);
            let randX = Math.floor(Math.random() * width);

            hatCount--;

            if(field[randY][randX] !== hole && field[randY][randX] !== pathCharacter) {
                field[randY][randX] = hat;
            } else {
                hatCount++;
            }
            
        }

        return field;
        
    }
}

const myField = new Field(Field.generateField(10,8,30));
myField.print();

let gameOver = false;

const maxY = myField._field.length;
const maxX = myField._field[0].length;
const minY = 0;
const minX = 0;

let currentY = 0;
let currentX = 0;

while(!gameOver) {
    const userInput = prompt('Which way? [d (down) - u (up) - r (right) - l (left)]: ');
    const validInputs = ['d', 'u', 'r', 'l'];

    if (!validInputs.includes(userInput)) {
        console.log('Invalid input');
    } else {
        console.log(userInput);
        switch(userInput) {
            case 'd':
                if(myField._field[currentY+1][currentX] === fieldCharacter || myField._field[currentY+1][currentX] === pathCharacter) {
                    myField._field[currentY+1][currentX] = pathCharacter;
                    myField.print();
                    currentY++;
                }
                break;
            case 'u':
                if(myField._field[currentY-1][currentX] === fieldCharacter || myField._field[currentY-1][currentX] === pathCharacter) {
                    myField._field[currentY-1][currentX] = pathCharacter;
                    myField.print();
                    currentY--;
                }
                break;
            case 'r':
                if(myField._field[currentY][currentX+1] === fieldCharacter || myField._field[currentY][currentX+1] === pathCharacter) {
                    myField._field[currentY][currentX+1] = pathCharacter;
                    myField.print();
                    currentX++;
                }
                break;
            case 'l':
                if(myField._field[currentY][currentX-1] === fieldCharacter || myField._field[currentY][currentX-1] === pathCharacter) {
                    myField._field[currentY][currentX-1] = pathCharacter;
                    myField.print();
                    currentX--;
                }
                break;
        }
    }  
}
