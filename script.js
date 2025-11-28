document.addEventListener("DOMContentLoaded", () => {
	// image assets (9 color pngs + official head image)
	const colorImages = [
		"images/AIAH.png",
		"images/COLET.png",
		"images/GWEN.png",
		"images/JHOANNA.png",
		"images/MALOI.png",
		"images/MIKHA.png",
		"images/SHEENA.png",
		"images/STACEY.png",
		"images/BINI OT8.png",
	];

	const glow = document.getElementById("glow");
	const colorsGrid = document.getElementById("colors");
	const btnOn = document.getElementById("btn-on");
	const btnOff = document.getElementById("btn-off");
	const modeButtons = Array.from(document.querySelectorAll(".mode"));
	const faceImg = document.getElementById("face-img");
	const faceWrap = document.querySelector(".face");
	const infinityBtn = document.getElementById("infinity-btn");

	let isOn = false;
	// default to the official bloombilya head so it's visible on load
	let currentImage = "images/bloombilya.png";
	let currentMode = "fixed";
	let modeInterval = null;

	function applyGlowForImage(imagePath) {
		// Use the selected image as a background for the glow and add a radial highlight
		glow.style.background = `radial-gradient(circle at 50% 40%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 60%), url(${imagePath})`;
		glow.style.backgroundSize = "cover";
		glow.style.boxShadow = `0 0 40px rgba(0,0,0,0.05), 0 0 100px rgba(0,0,0,0.04)`;
	}

	function setImage(imagePath) {
		currentImage = imagePath;
		faceImg.src = imagePath;
		document
			.querySelectorAll(".color-btn")
			.forEach((b) =>
				b.classList.toggle("selected", b.dataset.image === imagePath)
			);
		if (isOn) applyGlowForImage(imagePath);
	}

	function turnOn() {
		if (isOn) return;
		isOn = true;
		faceWrap.classList.remove("off");
		glow.classList.add("on");
		applyGlowForImage(currentImage);
		startMode();
	}

	function turnOff() {
		if (!isOn) return;
		isOn = false;
		faceWrap.classList.add("off");
		glow.classList.remove("on");
		stopMode();
	}

	function startMode() {
		stopMode();
		if (!isOn) return;
		if (currentMode === "fixed") {
			glow.classList.add("on");
			applyGlowForImage(currentImage);
		} else if (currentMode === "random") {
			modeInterval = setInterval(() => {
				const c =
					colorImages[Math.floor(Math.random() * colorImages.length)];
				setImage(c);
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

	// build color buttons using thumbnails from images folder
	colorImages.forEach((imgPath) => {
		const btn = document.createElement("button");
		btn.className = "color-btn";
		btn.dataset.image = imgPath;
		btn.setAttribute("aria-label", `Color ${imgPath}`);
		const thumb = document.createElement("img");
		thumb.src = imgPath;
		thumb.alt = "";
		btn.appendChild(thumb);
		btn.addEventListener("click", () => {
			setImage(imgPath);
			if (isOn && currentMode === "fixed") applyGlowForImage(imgPath);
		});
		colorsGrid.appendChild(btn);
	});

	// initial selected image
	setImage(currentImage);

	// On/Off buttons
	btnOn.addEventListener("click", () => turnOn());
	btnOff.addEventListener("click", () => turnOff());

	// Fullscreen / big view toggle
	const btnFull = document.getElementById("btn-full");
	function enterBigView() {
		const el = document.documentElement;
		if (el.requestFullscreen) {
			el.requestFullscreen().catch(() => {
				// fallback: apply classes that expand the layout to full viewport
				document.documentElement.classList.add(
					"bigview",
					"is-full",
					"fullscreen-expand"
				);
			});
		} else {
			// no Fullscreen API: apply bigview and expansion classes
			document.documentElement.classList.add(
				"bigview",
				"is-full",
				"fullscreen-expand"
			);
		}
	}
	function exitBigView() {
		if (document.fullscreenElement) {
			document.exitFullscreen().catch(() => {});
		}
		document.documentElement.classList.remove(
			"bigview",
			"is-full",
			"fullscreen-expand"
		);
	}
	if (btnFull) {
		btnFull.addEventListener("click", () => {
			if (
				!document.fullscreenElement &&
				!document.documentElement.classList.contains("bigview")
			) {
				enterBigView();
			} else {
				exitBigView();
			}
		});
	}

	// reflect fullscreen change with a class for styling
	document.addEventListener("fullscreenchange", () => {
		if (document.fullscreenElement) {
			document.documentElement.classList.add(
				"is-full",
				"fullscreen-expand"
			);
		} else {
			document.documentElement.classList.remove(
				"is-full",
				"fullscreen-expand"
			);
		}
	});

	// Infinity overlay toggles power
	if (infinityBtn) {
		infinityBtn.addEventListener("click", () => {
			isOn ? turnOff() : turnOn();
		});
	}

	// modes
	modeButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			modeButtons.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
			currentMode = btn.dataset.mode;
			startMode();
		});
	});

	// keyboard quick toggle
	document.addEventListener("keydown", (e) => {
		if (e.key === "l" || e.key === "L") {
			isOn ? turnOff() : turnOn();
		}
	});

	// visibility
	window.addEventListener("visibilitychange", () => {
		if (document.hidden) stopMode();
		else if (isOn) startMode();
	});
});
