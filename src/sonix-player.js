import "./style.css";

import {
	play,
	pause,
	volumeMute,
	volumeMedium,
	volumeHigh,
	repeatOutline,
	playForwardOutline,
	cloudDownload,
} from "ionicons/icons";

/* ion icons have a problem when used this way ${icon} return a type of URL data:image */
function iconSpliter(iconName) {
	return iconName.split(",")[1];
}

// check any audio is Playing or not
let isPlaying = false;

// keep track of which audio player has auto-play enabled
let currentAutoPlayElement = null;

// keep track of all audio elements
let allAudioElements = [];

// keep track when user is dragging in the timeline container
let isDraggingTime = false;

// keep track when user is dragging in the volume control
let isDraggingVol = false;

export class AudioPlayer extends HTMLElement {
	connectedCallback() {
		// check if this element wants to auto-play
		if (this.dataset.auto === "true") {
			// if there's already an auto-play element, disable it
			if (currentAutoPlayElement && currentAutoPlayElement !== this) {
				currentAutoPlayElement.dataset.auto = "false";
				console.warn("only one c-audio element can have data-auto attribute, please fix it");
			}
			// set this element as the current auto-play element
			currentAutoPlayElement = this;
		}

		const audioSrc = this.dataset.src || "";
		const audioElement = document.createElement("audio");
		audioElement.src = audioSrc;
		// add this audio element to our tracking array
		allAudioElements.push(audioElement);

		function durationLoader() {
			if (audioElement.duration) {
				const totalSeconds = Math.floor(audioElement.duration);
				const minutes = Math.floor(totalSeconds / 60);
				const seconds = totalSeconds % 60;

				// Format time as MM:SS
				return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
			} else {
				console.warn("No audio duration found. Please check data-src attribute");
				return "00:00";
			}
		}

		const cover = {
			thumbnail: this.dataset.thumbnail || "",
			figure: this.dataset.figure || "",
		};

		const textDisplays = {
			artist: this.dataset.artist || "default",
			name: this.dataset.name || "default",
		};

		const controls = {
			autoPlay: this.dataset.auto || "false",
			volumeControl: this.dataset.volume || "true",
			repeat: this.dataset.repeat || "true",
		};

		const speedControl = {
			speed: this.dataset.speed || "true",
			minSpeed: 1,
			maxSpeed: this.dataset.max || "2",
		};

		const canDownload = this.dataset.download || "true";

		// set audio player theme colors like this sytanx => data-accent="#f50"
		const setPlayerTheme = () => {
			const accent = this.dataset.accent || document.documentElement.style.getPropertyValue("--color-accent");
			const primary = this.dataset.primary || document.documentElement.style.getPropertyValue("--color-primary");
			const secondary = this.dataset.secondary || document.documentElement.style.getPropertyValue("--color-secondary");

			// Set CSS custom properties for the component
			this.style.setProperty("--color-accent", accent);
			this.style.setProperty("--color-primary", primary);
			this.style.setProperty("--color-secondary", secondary);
		};

		// Call setPlayerTheme before setting innerHTML
		setPlayerTheme();

		this.innerHTML = /*html*/ `
			<div class="c-audio">
				<!--  -->
				${
					cover.thumbnail.trim() !== ""
						? `
					<div class="thumbnail-img">
						<div class="thumbnail-filter" style="background-image:url(${cover.thumbnail})"></div>
						<img src="${cover.thumbnail}" alt="${textDisplays.name}" loading="lazy"/>
					</div>	
				`
						: ""
				}

				<div class="c-audio-inner">
					<div class="flex items-center">
						<div class="btn-holder">
								<button
									class="play-btn"
									title="Play current"
									aria-label="Play current"
									tabindex="0">
									<span class="icon">
										${iconSpliter(play)}
									</span>
									<span class="icon">
										${iconSpliter(pause)}
									</span>
								</button>
						</div>
						<!--  -->
						${
							controls.repeat == "true"
								? `
							<div class="btn-holder col-span-1">
								<button
									class="repeat-btn" 
									title="Repeat current"
									aria-label="Repeat current"
									tabindex="0">
									<span class="icon">
										${iconSpliter(repeatOutline)}
									</span>
								</button>
							</div>
							`
								: ""
						}
					</div>
						<!--  -->
						<div class="timeline-container flex-2">
							<div class="current-time">
								<span>${audioElement.currentTime}:00</span>
							</div>
							<div class="timeline-outer">
								<div class="timeline-inner"></div>
							</div>
							<div class="duration">
								<span></span>
							</div>
						</div>
						<!--  -->
						<div class="flex items-center vol-speed">
							${
								controls.volumeControl == "true"
									? `
								<div class="btn-holder flex gap-4">
									<button
										class="volume-btn"
										title="Control volume"
										aria-label="Control volume"
										tabindex="0">
										<span class="icon">
											${iconSpliter(volumeHigh)}
										</span>
									</button>
									<div
										class="custom-range"
										data-value="100">
										<div class="custom-range-outer">
											<div class="custom-range-inner"></div>
										</div>
									</div>
								</div>
							`
									: ""
							}
							<!--  -->
							${
								speedControl.speed == "true"
									? `
								<div class="btn-holder">
									<button
										class="speed-btn"
										title="Control speed"
										aria-label="Control speed"
										tabindex="0"
										data-value="1">
										<span class="icon">
											<span>1x</span>
											${iconSpliter(playForwardOutline)}
										</span>
									</button>
								</div>
								`
									: ""
							}
						</div>
						<!--  -->
						<div class="flex justify-between items-center flex-1">
							<div class="audio-info">
								<div class="figure-img">
									<img src="${cover.figure}" alt="${textDisplays.name}" loading="lazy" />
								</div>
								<div class="text-info">
									<span data-artist>${textDisplays.artist}</span>
									<span data-name>${textDisplays.name}</span>
								</div>
							</div>
							<!--  -->
							${
								canDownload == "true"
									? `
								<div class="btn-holder">
									<button
										class="download-btn"
										title="Download audio"
										aria-label="Download audio"
										tabindex="0">
										<span class="icon">
											${iconSpliter(cloudDownload)}
										</span>
									</button>
								</div>
								`
									: ""
							}
					</div>
				</div>
		</div>
        `;

		// when data fully loaded catch audio duration and control autoplay audio if true or false
		window.addEventListener("load", () => {
			this.querySelector(".duration span").innerHTML = durationLoader();

			// audio Global Status
			function audioStatus(status, doing) {
				isPlaying = status;
				playButton.title = `${doing} current`;
				playButton.ariaLabel = `${doing} current`;
			}

			// Initialize Play & Pause Control
			const playButton = this.querySelector(".play-btn");

			playButton.addEventListener("click", () => {
				const isCurrentlyPaused = playButton.classList.contains("is-playing");

				if (!isCurrentlyPaused) {
					// Pause all other audio elements and reset their buttons
					allAudioElements.forEach((audio) => {
						if (audio !== audioElement) {
							audio.pause();
							// Find the play button for this audio element
							const otherPlayButton = audio.closest("c-audio")?.querySelector(".play-btn");
							if (otherPlayButton) {
								otherPlayButton.classList.remove("is-playing");
							}
						}
					});
					// Add playing class to current button
					playButton.classList.add("is-playing");
					if (audioElement.duration) {
						audioElement.play();
					}
					audioStatus(true, "Pause");
				} else {
					playButton.classList.remove("is-playing");
					audioElement.pause();
					audioStatus(false, "Play");
				}
			});

			// Initialize Repeat
			const repeatButton = this.querySelector(".repeat-btn");
			repeatButton?.addEventListener("click", () => {
				const isRepeat = repeatButton.classList.toggle("active");
				if (isRepeat) {
					audioElement.loop = true;
				} else {
					audioElement.loop = false;
				}
			});

			// Initialize Audio Time
			const currentTime = this.querySelector(".current-time span");
			const timelineOuter = this.querySelector(".timeline-outer");
			const timelineInner = this.querySelector(".timeline-inner");

			audioElement.addEventListener("timeupdate", () => {
				let percent = (audioElement.currentTime / audioElement.duration) * 100;
				const audioCurrentTime = Math.floor(audioElement.currentTime);

				const minutes = Math.floor(audioCurrentTime / 60);
				const seconds = Math.floor(audioCurrentTime % 60);

				if (audioCurrentTime) {
					const formatSeconds = seconds < 10 ? `0${seconds}` : seconds;
					currentTime.innerHTML = minutes + ":" + formatSeconds;
				}

				timelineInner.style.width = `${percent}%`;

				if (audioElement.currentTime === audioElement.duration) {
					if (audioElement.loop === true) {
						audioStatus(true, "Pause");
					} else {
						audioStatus(false, "Play");
						playButton.classList.toggle("is-playing");
					}
				}
			});

			// Initialize volume control
			const volumeButton = this.querySelector(".volume-btn");
			const volumeIcon = this.querySelector(".volume-btn .icon");
			const customRange = this.querySelector(".custom-range");
			const customRangeInner = this.querySelector(".custom-range-inner");

			// Set initial volume
			if (volumeButton) {
				audioElement.volume = 1;
				customRangeInner.style.width = "100%";

				// Handle volume button click
				volumeButton.addEventListener("click", () => {
					if (!audioElement.muted) {
						audioElement.volume = 0;
						audioElement.muted = true;
						customRangeInner.style.width = "0%";
						volumeIcon.innerHTML = iconSpliter(volumeMute);
					} else {
						audioElement.volume = 1;
						audioElement.muted = false;
						customRangeInner.style.width = "100%";
						volumeIcon.innerHTML = iconSpliter(volumeHigh);
					}
				});

				let volumeMoveHandler;
				let volumeUpHandler;

				// Handle volume range interaction
				customRange.addEventListener("mousedown", (e) => {
					isDraggingVol = true;
					controlVolume(e);

					// Add event listeners only when dragging starts
					volumeMoveHandler = (e) => {
						if (isDraggingVol) {
							controlVolume(e);
						}
					};

					volumeUpHandler = () => {
						isDraggingVol = false;
						// Remove event listeners when dragging ends
						document.removeEventListener("mousemove", volumeMoveHandler);
						document.removeEventListener("mouseup", volumeUpHandler);
					};

					document.addEventListener("mousemove", volumeMoveHandler);
					document.addEventListener("mouseup", volumeUpHandler);
				});
			}

			function controlVolume(e) {
				const rect = customRange.getBoundingClientRect();
				const width = rect.width;
				const x = Math.max(0, Math.min(e.clientX - rect.left, width));
				const volume = Math.max(0, Math.min(1, x / width));

				// Ensure volume is a valid number between 0 and 1
				if (isFinite(volume)) {
					audioElement.volume = volume;
					customRangeInner.style.width = `${volume * 100}%`;

					// Update volume icon based on level
					if (volume === 0) {
						volumeIcon.innerHTML = iconSpliter(volumeMute);
						audioElement.muted = true;
					} else if (volume < 0.5) {
						volumeIcon.innerHTML = iconSpliter(volumeMedium);
					} else {
						audioElement.muted = false;
						volumeIcon.innerHTML = iconSpliter(volumeHigh);
					}
				}
			}

			// Handle Audio Speed Controls
			const speedButton = this.querySelector(".speed-btn");
			speedButton?.addEventListener("click", handleSpeed);

			function handleSpeed() {
				let currentSpeed = parseFloat(speedButton.dataset.value);
				currentSpeed = currentSpeed >= parseFloat(speedControl.maxSpeed) ? speedControl.minSpeed : currentSpeed + 0.5;

				// Update speed value
				speedButton.dataset.value = currentSpeed;
				audioElement.playbackRate = currentSpeed;

				// Update speed display
				speedButton.querySelector(".icon span").textContent = `${currentSpeed}x`;
			}

			// Control download button
			if (audioElement.duration) {
				this.querySelector(".download-btn")?.addEventListener("click", () => {
					if (canDownload == "true") {
						const a = document.createElement("a");
						a.href = audioElement.src;
						a.download = textDisplays.name;
						a.click();
					}
				});
			} else {
				console.warn("audio source not found check data-src");
			}

			// Update audio time based on click and mouse move in timeline container
			let mouseMoveHandler;
			let mouseUpHandler;

			timelineOuter.addEventListener("mousedown", (e) => {
				isDraggingTime = true;
				updateSeek(e);

				// Add event listeners only when dragging starts
				mouseMoveHandler = (e) => {
					if (isDraggingTime) {
						updateSeek(e);
					}
				};

				mouseUpHandler = () => {
					isDraggingTime = false;
					// Remove event listeners when dragging ends
					document.removeEventListener("mousemove", mouseMoveHandler);
					document.removeEventListener("mouseup", mouseUpHandler);
				};

				document.addEventListener("mousemove", mouseMoveHandler);
				document.addEventListener("mouseup", mouseUpHandler);
			});

			function updateSeek(e) {
				if (!audioElement.duration) return;

				const rect = timelineOuter.getBoundingClientRect();
				let offsetX = e.clientX - rect.left;
				offsetX = Math.max(0, Math.min(offsetX, timelineOuter.offsetWidth));

				const percent = offsetX / timelineOuter.offsetWidth;
				audioElement.currentTime = percent * audioElement.duration;
				timelineInner.style.width = `${percent * 100}%`;
			}

			setTimeout(() => {
				const handleFirstInteraction = () => {
					if (this.dataset.auto == "true" && audioElement.duration) {
						audioElement.play();
						playButton.classList.add("is-playing");
						audioStatus(true, "Pause");
					}

					window.removeEventListener("click", handleFirstInteraction);
				};

				window.addEventListener("click", handleFirstInteraction);
			}, 500);
		});
	}
}

customElements.define("c-audio", AudioPlayer);
