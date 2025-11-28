document.addEventListener("DOMContentLoaded", () => {
	const COLORS = [
		"#ff3b30",
		"#ff9500",
		"#ffcc00",
		"#34c759",
		"#0a84ff",
		"#5e5ce6",
		"#ff2d55",
		"#8e8e93",
		"#ff9f0a",
	];

	const glow = document.getElementById("glow");
	const colorsGrid = document.getElementById("colors");
	const btnOn = document.getElementById("btn-on");
	const btnOff = document.getElementById("btn-off");
	const btnFull = document.getElementById("btn-full");
	const modeButtons = Array.from(document.querySelectorAll(".mode"));
	const faceImg = document.getElementById("face-img");
	const faceWrap = document.querySelector(".face");
	const infinityBtn = document.getElementById("infinity-btn");

	let isOn = false;
	let currentColor = COLORS[0];
	const OFFICIAL_FACE = "images/bloombilya.png";
	let currentMode = "fixed";
	let modeInterval = null;

	function hexToRgba(hex, a = 1) {
		const h = hex.replace("#", "");
		const bigint = parseInt(h, 16);
		const r = (bigint >> 16) & 255;
		const g = (bigint >> 8) & 255;
		const b = bigint & 255;
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}

	function applyGlow(colorHex) {
		if (!glow) return;
		// gentle white center + colored glow
		const c1 = "rgba(255,255,255,0.18)";
		const c2 = hexToRgba(colorHex, 0.85);
		const c3 = hexToRgba(colorHex, 0.28);
		glow.style.background = `radial-gradient(circle at 50% 40%, ${c1} 0%, ${c2} 22%, ${c3} 55%, transparent 70%)`;
		glow.style.boxShadow = `0 0 40px ${hexToRgba(
			colorHex,
			0.4
		)}, 0 0 140px ${hexToRgba(colorHex, 0.18)}`;
	}

	function setColor(colorHex) {
		currentColor = colorHex;
		// keep official face visible
		if (faceImg) faceImg.src = OFFICIAL_FACE;
		for (const b of document.querySelectorAll(".color-btn")) {
			b.classList.toggle("selected", b.dataset.color === colorHex);
		}
		if (isOn) applyGlow(colorHex);
	}

	function turnOn() {
		if (isOn) return;
		isOn = true;
		faceWrap && faceWrap.classList.remove("off");
		glow && glow.classList.add("on");
		applyGlow(currentColor);
		startMode();
	}

	function turnOff() {
		if (!isOn) return;
		isOn = false;
		faceWrap && faceWrap.classList.add("off");
		glow && glow.classList.remove("on");
		stopMode();
	}

	function startMode() {
		stopMode();
		if (!isOn) return;
		if (currentMode === "fixed") {
			applyGlow(currentColor);
		} else if (currentMode === "random") {
			modeInterval = setInterval(() => {
				const c = COLORS[Math.floor(Math.random() * COLORS.length)];
				setColor(c);
			}, 800);
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

	// build swatches
	if (colorsGrid) {
		for (const c of COLORS) {
			const btn = document.createElement("button");
			btn.className = "color-btn";
			btn.dataset.color = c;
			btn.setAttribute("aria-label", `Color ${c}`);
			btn.style.background = c;
			btn.style.minHeight = "36px";
			btn.style.border = "2px solid rgba(255,255,255,0.06)";
			btn.addEventListener("click", () => setColor(c));
			colorsGrid.appendChild(btn);
		}
	}

	// initial
	setColor(currentColor);

	// wire buttons
	btnOn && btnOn.addEventListener("click", turnOn);
	btnOff && btnOff.addEventListener("click", turnOff);

	// fullscreen / bigview
	function enterBigView() {
		const el = document.documentElement;
		if (el.requestFullscreen) {
			el.requestFullscreen().catch(() => {
				document.documentElement.classList.add(
					"bigview",
					"is-full",
					"fullscreen-expand"
				);
			});
		} else {
			document.documentElement.classList.add(
				"bigview",
				"is-full",
				"fullscreen-expand"
			);
		}
	}

	function exitBigView() {
		if (document.fullscreenElement)
			document.exitFullscreen().catch(() => {});
		document.documentElement.classList.remove(
			"bigview",
			"is-full",
			"fullscreen-expand"
		);
	}

	btnFull &&
		btnFull.addEventListener("click", () => {
			if (
				!document.fullscreenElement &&
				!document.documentElement.classList.contains("bigview")
			)
				enterBigView();
			else exitBigView();
		});

	document.addEventListener("fullscreenchange", () => {
		if (document.fullscreenElement)
			document.documentElement.classList.add(
				"is-full",
				"fullscreen-expand"
			);
		else
			document.documentElement.classList.remove(
				"is-full",
				"fullscreen-expand"
			);
	});

	// infinity overlay
	infinityBtn &&
		infinityBtn.addEventListener("click", () =>
			isOn ? turnOff() : turnOn()
		);

	// modes
	for (const btn of modeButtons) {
		btn.addEventListener("click", () => {
			for (const b of modeButtons) b.classList.remove("active");
			btn.classList.add("active");
			currentMode = btn.dataset.mode || "fixed";
			startMode();
		});
	}

	// keyboard quick toggle L
	document.addEventListener("keydown", (e) => {
		if (e.key === "l" || e.key === "L") isOn ? turnOff() : turnOn();
	});

	// visibility
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) stopMode();
		else if (isOn) startMode();
	});
});

// register service worker safely
(async () => {
	try {
		if ("serviceWorker" in navigator)
			await navigator.serviceWorker.register("/sw.js");
	} catch (e) {
		// silent fail
	}
})();
