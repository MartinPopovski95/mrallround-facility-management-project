document.addEventListener("DOMContentLoaded", () => {
	const toggle = document.getElementById("darkModeToggle");
	const body = document.body;

	const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

	const updateMapTheme = (isDark) => {
		const mapIframes = document.querySelectorAll(
			'iframe[src*="google.com/maps"]'
		);

		mapIframes.forEach((iframe) => {
			const currentSrc = iframe.src;
			let newSrc = currentSrc;

			const isSatelliteView =
				currentSrc.includes("maptype=satellite") ||
				currentSrc.includes("maptype=hybrid");

			if (isDark && !isSatelliteView) {
				if (!currentSrc.includes("&style=")) {
					const darkStyles = [
						"element:geometry|color:0x242f3e",
						"element:labels.text.stroke|color:0x242f3e",
						"element:labels.text.fill|color:0x746855",
						"feature:administrative.locality|element:labels.text.fill|color:0xd59563",
						"feature:poi|element:labels.text.fill|color:0xd59563",
						"feature:poi.park|element:geometry|color:0x263c3f",
						"feature:poi.park|element:labels.text.fill|color:0x6b9a76",
						"feature:road|element:geometry|color:0x38414e",
						"feature:road|element:geometry.stroke|color:0x212a37",
						"feature:road|element:labels.text.fill|color:0x9ca5b3",
						"feature:road.highway|element:geometry|color:0x746855",
						"feature:road.highway|element:geometry.stroke|color:0x1f2835",
						"feature:road.highway|element:labels.text.fill|color:0xf3d19c",
						"feature:transit|element:geometry|color:0x2f3948",
						"feature:transit.station|element:labels.text.fill|color:0xd59563",
						"feature:water|element:geometry|color:0x17263c",
						"feature:water|element:labels.text.fill|color:0x515c6d",
						"feature:water|element:labels.text.stroke|color:0x17263c",
					];

					darkStyles.forEach((style) => {
						newSrc += `&style=${encodeURIComponent(style)}`;
					});
				}
			} else if (!isDark && !isSatelliteView) {
				if (currentSrc.includes("&style=")) {
					newSrc = currentSrc.split("&style=")[0];
				}
			}

			if (newSrc !== currentSrc) {
				iframe.src = newSrc;
			}
		});
	};

	const applyDarkMode = (isDark) => {
		if (isDark) {
			body.classList.add("dark-mode");
			if (toggle) toggle.classList.add("active");
		} else {
			body.classList.remove("dark-mode");
			if (toggle) toggle.classList.remove("active");
		}

		updateMapTheme(isDark);
	};

	const savedTheme = localStorage.getItem("theme");
	let isDarkMode;

	if (savedTheme !== null) {
		isDarkMode = savedTheme === "dark";
	} else {
		isDarkMode = prefersDarkScheme.matches;
	}

	applyDarkMode(isDarkMode);

	prefersDarkScheme.addEventListener("change", (e) => {
		if (localStorage.getItem("theme") === null) {
			applyDarkMode(e.matches);
		}
	});

	const toggleDarkMode = () => {
		body.classList.toggle("dark-mode");
		if (toggle) toggle.classList.toggle("active");

		const isDarkMode = body.classList.contains("dark-mode");
		localStorage.setItem("theme", isDarkMode ? "dark" : "light");

		updateMapTheme(isDarkMode);
	};

	if (toggle) {
		toggle.addEventListener("click", toggleDarkMode);
	}
});
