let cats = [];
let liked = [];
let currentIndex = 0;

async function init() {
	cats = await getCats(10);
	renderCard();
}

function renderCard() {
	const stack = document.getElementById('card-stack');
	stack.innerHTML = '';

	if (currentIndex >= cats.length) {
		showSummary();
		return;
	}

	const card = document.createElement('div');
	card.className = 'card';
	card.style.backgroundImage = `url(${cats[currentIndex]})`;

	let startX = 0;
	let currentX = 0;
	let dragging = false;

	function onStart(e) {
		dragging = true;
		startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
		card.style.transition = 'none';
	}

	function onMove(e) {
		if (!dragging) return;
		currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
		const deltaX = currentX - startX;
		card.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`;
	}

  	function onEnd() {
		if (!dragging) return;
		dragging = false;
		const deltaX = currentX - startX;
		card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

		if (deltaX > 100) {
			// Like
			liked.push(cats[currentIndex]);
			card.style.transform = 'translateX(400px) rotate(20deg)';
			card.style.opacity = '0';
			setTimeout(() => {
				currentIndex++;
				renderCard();
			}, 300);
		}
		else if (deltaX < -100) {
			// Dislike
			card.style.transform = 'translateX(-400px) rotate(-20deg)';
			card.style.opacity = '0';
			setTimeout(() => {
				currentIndex++;
				renderCard();
		}, 300);
		}
		else {
			// Snap back
			card.style.transform = 'translateX(0) rotate(0)';
		}
  	}

	// Touch events
	card.addEventListener('touchstart', onStart);
	card.addEventListener('touchmove', onMove);
	card.addEventListener('touchend', onEnd);

	// Mouse events
	card.addEventListener('mousedown', onStart);
	document.addEventListener('mousemove', onMove);
	document.addEventListener('mouseup', onEnd);

	stack.appendChild(card);
}

function showSummary() {
	document.getElementById('card-stack').classList.add('hidden');
	document.getElementById('summary').classList.remove('hidden');
	document.getElementById('like-count').textContent = liked.length;
	const likedCatsDiv = document.getElementById('liked-cats');
	liked.forEach(url => {
		const img = document.createElement('img');
		img.src = url;
		img.width = 100;
		likedCatsDiv.appendChild(img);
	});
}

async function getCats(count = 10) {
	const cats = [];
	for (let i = 0; i < count; i++) {
		const res = await fetch('https://cataas.com/cat?json=true');
		const data = await res.json();
		let url = data.url;
		if (!url.startsWith('http')) {
			url = `https://cataas.com${url}`;
		}
		cats.push(url);
	}
	return cats;
}

init();