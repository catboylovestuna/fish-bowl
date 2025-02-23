const fishElements = document.querySelectorAll('.fish');
const bowl = document.getElementById('bowl');

const fishData = Array.from(fishElements).map(fish => ({
    element: fish,
    direction: 'right',
    transitioning: false,
    verticalDirection: Math.random() < 0.5 ? 'up' : 'down',
    speed: Math.random() * 2 + 1.5,
    attracted: false
}));

function moveFish(fish) {
    const bowlWidth = bowl.clientWidth;
    const bowlHeight = bowl.clientHeight;
    const fishWidth = fish.element.clientWidth;
    const fishHeight = fish.element.clientHeight;

    if (fish.attracted) {
        const food = document.querySelector('.food');
        if (food) {
            const foodRect = food.getBoundingClientRect();
            const fishRect = fish.element.getBoundingClientRect();
            const foodCenterX = foodRect.left + (foodRect.width / 2);
            const fishCenterX = fishRect.left + (fishRect.width / 2);

            if (fishCenterX < foodCenterX) {
                fish.direction = 'right';
            } else {
                fish.direction = 'left';
            }
        }
    } else {
        let newX = parseFloat(fish.element.style.left) + (fish.direction === 'right' ? fish.speed : -fish.speed);
        if (newX + fishWidth > bowlWidth) {
            newX = bowlWidth - fishWidth;
            fish.direction = 'left';
        } else if (newX < 0) {
            newX = 0;
            fish.direction = 'right';
        }
        let newY = parseFloat(fish.element.style.top);
        newY += fish.verticalDirection === 'up' ? -1 : 1;
        if (newY + fishHeight > bowlHeight) {
            newY = bowlHeight - fishHeight;
            fish.verticalDirection = 'up';
        } else if (newY < 0) {
            newY = 0;
            fish.verticalDirection = 'down';
        }
        fish.element.style.left = `${newX}px`;
        fish.element.style.top = `${newY}px`;
    }

    fish.element.textContent = fish.direction === 'right' ? "><(((('>" : "<'))))><"; 
}

function generateBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = 'o';
    bubble.style.left = `${Math.random() * 100}%`;
    document.getElementById('bubbles').appendChild(bubble);
    setTimeout(() => {
        bubble.remove();
    }, 5000);
}

bowl.addEventListener('click', (event) => {
    const food = document.createElement('div');
    food.classList.add('food');
    food.textContent = '*'; 
    food.style.left = `${event.clientX - bowl.offsetLeft - 7}px`; 
    food.style.top = '0px'; 
    document.getElementById('fish-food').appendChild(food);
    
    food.style.animation = 'food-fall 3s linear forwards';

    const checkFishCollision = setInterval(() => {
        fishData.forEach(fish => {
            const fishRect = fish.element.getBoundingClientRect();
            const foodRect = food.getBoundingClientRect();

            if (foodRect.bottom >= fishRect.top && foodRect.left < fishRect.right && foodRect.right > fishRect.left) {
                fish.attracted = true; 
                food.remove();
                clearInterval(checkFishCollision);
                setTimeout(() => {
                    fish.attracted = false;
                }, 2000); 
            }
        });
    }, 100);
});

setInterval(() => {
    fishData.forEach(moveFish);
}, 100);
setInterval(generateBubble, 1000);

fishData.forEach((fish, index) => {
    fish.element.style.left = `${index * 120}px`;
    fish.element.style.top = `${Math.random() * (bowl.clientHeight - fish.element.clientHeight)}px`;
});
