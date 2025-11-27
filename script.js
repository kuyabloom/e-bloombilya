document.addEventListener("DOMContentLoaded", () => {
	const colors = [
		"#ff3b30", // red
		"#ff9500", // orange
		"#ffcc00", // yellow
		"#34c759", // green
		"#5ac8fa", // sky
		"#007aff", // blue
		"#5856d6", // indigo
		"#af52de", // purple
		"#ff2d55", // pink
		"#ffffff", // white
	];

	const glow = document.getElementById("glow");
	const colorsGrid = document.getElementById("colors");
	const btnOn = document.getElementById("btn-on");
	const btnOff = document.getElementById("btn-off");
	const modeButtons = Array.from(document.querySelectorAll(".mode"));

	let isOn = false;
	let currentColor = colors[0];
	let currentMode = "fixed";
	let modeInterval = null;

	function applyGlowStyle(color) {
		document.documentElement.style.setProperty("--light-color", color);
		glow.style.background = `radial-gradient(circle at 50% 40%, ${color} 0%, rgba(255,255,255,0.08) 40%, transparent 60%)`;
		glow.style.boxShadow = `0 0 40px ${color}, 0 0 100px ${color}, 0 0 160px ${color}`;
	}

	function setColor(color) {
		currentColor = color;
		applyGlowStyle(color);
		document
			.querySelectorAll(".color-btn")
			.forEach((b) =>
				b.classList.toggle("selected", b.dataset.color === color)
			);
	}

	function turnOn() {
		if (isOn) return;
		isOn = true;
		glow.classList.add("on");
		applyGlowStyle(currentColor);
		startMode();
	}

	function turnOff() {
		if (!isOn) return;
		isOn = false;
		glow.classList.remove("on");
		stopMode();
	}

	function startMode() {
		stopMode();
		if (!isOn) return;
		if (currentMode === "fixed") {
			glow.classList.add("on");
			applyGlowStyle(currentColor);
		} else if (currentMode === "random") {
			modeInterval = setInterval(() => {
				const c = colors[Math.floor(Math.random() * colors.length)];
				setColor(c);
			}, 700);
		} else if (currentMode === "blink") {
			let visible = true;
			modeInterval = setInterval(() => {
				visible = !visible;
				if (visible) glow.classList.add("on");
				else glow.classList.remove("on");
			}, 450);
		}
	}

	function stopMode() {
		if (modeInterval) {
			clearInterval(modeInterval);
			modeInterval = null;
		}
	}

	// build color buttons
	colors.forEach((color) => {
		const btn = document.createElement("button");
		btn.className = "color-btn";
		btn.style.background = color;
		btn.dataset.color = color;
		btn.setAttribute("aria-label", `Color ${color}`);
		btn.addEventListener("click", () => {
			setColor(color);
			if (isOn && currentMode === "fixed") applyGlowStyle(color);
		});
		colorsGrid.appendChild(btn);
	});

	// initial selected color
	setColor(currentColor);

	// On/Off
	btnOn.addEventListener("click", () => {
		turnOn();
	});
	btnOff.addEventListener("click", () => {
		turnOff();
	});

	// modes
	modeButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			modeButtons.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
			currentMode = btn.dataset.mode;
			startMode();
		});
	});

	// Accessibility: toggle with space/enter for focused buttons
	document.addEventListener("keydown", (e) => {
		if (e.key === "l" || e.key === "L") {
			// quick toggle
			isOn ? turnOff() : turnOn();
		}
	});

	// cleanup on page hide
	window.addEventListener("visibilitychange", () => {
		if (document.hidden) stopMode();
		else if (isOn) startMode();
	});
});
