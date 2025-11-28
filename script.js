document.addEventListener("DOMContentLoaded", () => {
	// use the member artwork in `images/colors/` as swatches
	const COLOR_IMAGES = [
		"images/colors/AIAH.png",
		"images/colors/BINI OT8.png",
		"images/colors/COLET.png",
		"images/colors/GWEN.png",
		"images/colors/JHOANNA.png",
		"images/colors/MALOI.png",
		"images/colors/MIKHA.png",
		"images/colors/SHEENA.png",
		"images/colors/STACEY.png",
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
	// default until swatches are generated
	let currentColor = "#ffffff";
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
				const btns = Array.from(
					document.querySelectorAll(".color-btn")
				);
				if (!btns.length) return;
				const chosen = btns[Math.floor(Math.random() * btns.length)];
				const c = chosen.dataset.color || "#ffffff";
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

	// build swatches from the images folder; compute an average color from each image
	function imageToHex(img, size = 32) {
		return new Promise((resolve) => {
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, size, size);
			ctx.drawImage(img, 0, 0, size, size);
			try {
				const data = ctx.getImageData(0, 0, size, size).data;
				let r = 0,
					g = 0,
					b = 0,
					count = 0;
				for (let i = 0; i < data.length; i += 4) {
					const alpha = data[i + 3];
					if (alpha === 0) continue;
					r += data[i];
					g += data[i + 1];
					b += data[i + 2];
					count++;
				}
				if (!count) return resolve("#ffffff");
				r = Math.round(r / count);
				g = Math.round(g / count);
				b = Math.round(b / count);
				const hex =
					"#" +
					((1 << 24) + (r << 16) + (g << 8) + b)
						.toString(16)
						.slice(1);
				resolve(hex);
			} catch (e) {
				// fallback to white if cross-origin or other error
				resolve("#ffffff");
			}
		});
	}

	if (colorsGrid) {
		for (const src of COLOR_IMAGES) {
			const img = new Image();
			img.src = src;
			img.onload = async () => {
				const hex = await imageToHex(img, 24);
				const btn = document.createElement("button");
				btn.className = "color-btn";
				btn.dataset.color = hex;
				btn.setAttribute("aria-label", `Color from ${src}`);
				// show the image inside the swatch
				const thumb = document.createElement("img");
				thumb.src = src;
				thumb.alt = "";
				thumb.style.width = "100%";
				thumb.style.height = "100%";
				thumb.style.objectFit = "cover";
				btn.appendChild(thumb);
				btn.addEventListener("click", () => setColor(hex));
				colorsGrid.appendChild(btn);
			};
			img.onerror = () => {
				// fallback to a simple color square if image fails
				const btn = document.createElement("button");
				btn.className = "color-btn";
				btn.dataset.color = "#ffffff";
				btn.style.background = "#ffffff";
				btn.addEventListener("click", () => setColor("#ffffff"));
				colorsGrid.appendChild(btn);
			};
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

	// Fix mobile viewport unit issues (particularly iOS) by setting a --vh CSS variable
	function setVhVar() {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	}

	// detect iOS to allow targeted CSS if needed
	function detectIOS() {
		const ua = navigator.userAgent || navigator.vendor || window.opera;
		if (
			/iPad|iPhone|iPod/.test(ua) ||
			(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
		) {
			document.documentElement.classList.add("is-ios");
		}
	}

	setVhVar();
	detectIOS();
	window.addEventListener("resize", setVhVar);

	// (removed previous inline CSS fallback to avoid layout conflicts)
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
