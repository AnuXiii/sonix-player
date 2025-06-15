import "./sonix-player.css";

// import ion-icons used icons
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
function splitIcon(iconName) {
	return iconName.split(",")[1];
}

// Check any audio is Playing or not
let isPlaying = false;

// Keep track of which audio player has auto-play enabled
let currentAutoPlayElement = null;

// Keep track of all audio elements
let allAudioElements = [];

// Keep track when user is dragging in the timeline container
let isDraggingTime = false;

// Keep track when user is dragging in the volume control
let isDraggingVol = false;

class SonixPlayer extends HTMLElement {
	connectedCallback() {
		// Check if this element wants to auto-play
		if (this.dataset.auto === "true") {
			// IF there's already an auto-play element, disable it
			if (currentAutoPlayElement && currentAutoPlayElement !== this) {
				currentAutoPlayElement.dataset.auto = "false";
				console.warn("only one sonix-player element in current page can have data-auto attribute, please fix it");
			}
			// Set this element as the current auto-play element
			currentAutoPlayElement = this;
		}

		// Set audio src with data-src attribute
		const audioSrc = this.dataset.src || "";
		const audioElement = document.createElement("audio");
		audioElement.src = audioSrc;

		// Add this audio element to our tracking array
		allAudioElements.push(audioElement);

		// Function to calculating audio minutes and seconds
		function formatDuration() {
			if (audioElement.duration) {
				const totalSeconds = Math.floor(audioElement.duration);
				const minutes = Math.floor(totalSeconds / 60);
				const seconds = totalSeconds % 60;

				// Format time as MM:SS
				return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
			} else {
				// IF audio duration have a problem return this
				console.warn("No audio duration found. Please check data-src attribute");
				return "00:00";
			}
		}

		// Set audio metadata when loaded
		audioElement.addEventListener("loadedmetadata", () => {
			const durationValue = this.querySelector(".sonix-duration-value");
			if (durationValue) {
				durationValue.innerHTML = formatDuration();
			}
		});

		// Update duration if it changes
		audioElement.addEventListener("durationchange", () => {
			const durationValue = this.querySelector(".sonix-duration-value");
			if (durationValue) {
				durationValue.innerHTML = formatDuration();
			}
		});

		// Set thumbnail and figure data-thumbnail="/images/default.png" & data-figure="/images/default.png"
		const cover = {
			thumbnail: this.dataset.thumbnail || "",
			figure: this.dataset.figure || "",
		};

		// Set artist and track name data-artist="text" & data-name="text"
		const textDisplays = {
			artist: this.dataset.artist || "",
			name: this.dataset.name || "",
		};

		// Set audio autoplay - volume - repeat Controls true or false
		const controls = {
			autoPlay: this.dataset.auto || "false",
			volumeControl: this.dataset.volume || "true",
			repeat: this.dataset.repeat || "true",
		};

		// Set speed Control data-speed="true" & data-speed="number"
		const speedControl = {
			speed: this.dataset.speed || "true",
			minSpeed: 1,
			maxSpeed: this.dataset.max || "2",
		};

		// Set showing download button or not true or false
		const canDownload = this.dataset.download || "true";

		// Set audio player theme colors catching like this syntax => data-accent="#f50"
		const setPlayerTheme = () => {
			const black = this.dataset.black || document.documentElement.style.getPropertyValue("--color-sonix-black");
			const accent = this.dataset.accent || document.documentElement.style.getPropertyValue("--color-sonix-accent");
			const primary = this.dataset.primary || document.documentElement.style.getPropertyValue("--color-sonix-primary");
			const secondary =
				this.dataset.secondary || document.documentElement.style.getPropertyValue("--color-sonix-secondary");

			// Set CSS custom properties for the component
			this.style.setProperty("--color-sonix-black", black);
			this.style.setProperty("--color-sonix-accent", accent);
			this.style.setProperty("--color-sonix-primary", primary);
			this.style.setProperty("--color-sonix-secondary", secondary);
		};

		// Call setPlayerTheme before setting innerHTML
		setPlayerTheme();

		this.innerHTML = /*html*/ `
			<div class="sonix-player">
				<!--  -->
				${
					cover.thumbnail !== ""
						? `
					<div class="sonix-thumbnail-container">
						<div class="sonix-thumbnail-filter" style="background-image:url(${cover.thumbnail})"></div>
						<img class="sonix-thumbnail-img" src="${cover.thumbnail}" alt="${textDisplays.name}" loading="lazy"/>
						<div class="sonix-loader">
							<div class="sonix-loader-inner">
								<div class="sonix-line h-7"></div>
								<div class="sonix-line h-4"></div>
								<div class="sonix-line h-8"></div>
								<div class="sonix-line h-10"></div>
								<div class="sonix-line h-8"></div>
								<div class="sonix-line h-4"></div>
								<div class="sonix-line h-7"></div>
							</div>
						</div>
					</div>	
				`
						: ""
				}
				<!--  -->
				<div class="sonix-inner">
					<div class="flex items-center">
						<div class="sonix-btn-holder">
								<button
									class="sonix-play-btn"
									title="Play current"
									aria-label="Play current"
									tabindex="0">
									<span class="sonix-icon">
										${splitIcon(play)}
									</span>
									<span class="sonix-icon">
										${splitIcon(pause)}
									</span>
								</button>
						</div>
						<!--  -->
						${
							controls.repeat == "true"
								? `
							<div class="sonix-btn-holder col-span-1">
								<button
									class="sonix-repeat-btn" 
									title="Repeat current"
									aria-label="Repeat current"
									tabindex="0">
									<span class="sonix-icon">
										${splitIcon(repeatOutline)}
									</span>
								</button>
							</div>
							`
								: ""
						}
					</div>
						<!--  -->
						<div class="sonix-timeline-container flex-2">
							<div class="sonix-current-time-container">
								<span class="sonix-current-time-value">${audioElement.currentTime}:00</span>
							</div>
							<div class="sonix-timeline-outer">
								<div class="sonix-timeline-inner"></div>
							</div>
							<div class="sonix-duration-container">
								<span class="sonix-duration-value">00:00</span>
							</div>
						</div>
						<!--  -->
						<div class="flex items-center sonix-vol-speed">
							${
								controls.volumeControl == "true"
									? `
								<div class="sonix-btn-holder flex">
									<button
										class="sonix-volume-btn"
										title="Control volume"
										aria-label="Control volume"
										tabindex="0">
										<span class="sonix-icon">
											${splitIcon(volumeHigh)}
										</span>
									</button>
									<div
										class="sonix-custom-range"
										data-value="100">
										<div class="sonix-custom-range-outer">
											<div class="sonix-custom-range-inner"></div>
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
								<div class="sonix-btn-holder">
									<button
										class="sonix-speed-btn"
										title="Control speed"
										aria-label="Control speed"
										tabindex="0"
										data-value="1">
										<span class="sonix-icon">
											<span class="sonix-speed-value">1x</span>
											${splitIcon(playForwardOutline)}
										</span>
									</button>
								</div>
								`
									: ""
							}
						</div>
						<!--  -->
						<div class="flex justify-between items-center flex-1">
							<div class="sonix-info ${canDownload == "false" ? "lg:justify-center w-full" : ""}">
							${
								cover.figure !== ""
									? `
								<div class="sonix-figure-container">
									<img class="sonix-figure-img" src="${cover.figure}" alt="${textDisplays.name || ""}" loading="lazy" />
									<div class="sonix-loader">
										<div class="sonix-loader-inner">
											<div class="sonix-line h-7"></div>
											<div class="sonix-line h-4"></div>
											<div class="sonix-line h-8"></div>
											<div class="sonix-line h-10"></div>
											<div class="sonix-line h-8"></div>
											<div class="sonix-line h-4"></div>
											<div class="sonix-line h-7"></div>
										</div>
									</div>
								</div>
								`
									: ""
							}
								<div class="sonix-text-info">
									${textDisplays.artist !== "" ? `<span class="sonix-artist">${textDisplays.artist}</span>` : ""}
									${textDisplays.name !== "" ? `<span class="sonix-name">${textDisplays.name}</span>` : ""}
								</div>
							</div>
							<!--  -->
							${
								canDownload == "true"
									? `
								<div class="sonix-btn-holder">
									<button
										class="sonix-download-btn"
										title="Download audio"
										aria-label="Download audio"
										tabindex="0">
										<span class="sonix-icon">
											${splitIcon(cloudDownload)}
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
			// find duration value element and place audio duration inner
			const durationValue = this.querySelector(".sonix-duration-value");
			durationValue ? (durationValue.innerHTML = formatDuration()) : "";

			const playButton = this.querySelector(".sonix-play-btn");
			// Attached controlPlayStatus() function to play button
			playButton.addEventListener("click", handlePlayPause);

			// Audio status
			function updateAudioStatus(status, doing) {
				isPlaying = status;
				playButton.title = `${doing} current`;
				playButton.ariaLabel = `${doing} current`;
			}

			// Function to Play & Pause Control
			function handlePlayPause() {
				const isCurrentlyPaused = playButton.classList.contains("sonix-is-playing");

				// if user clicked on play button and have't data-auto="true" attribute we stopping auto-play another audio
				if (this.dataset.auto == "false" || !this.dataset.auto) {
					const autoPlayTarget = document.querySelector("[data-auto='true']");
					autoPlayTarget?.setAttribute("data-auto", "false");
					autoPlayTarget ? console.warn("auto-play disabled") : "";
				}

				if (!audioElement.duration) return;

				if (!isCurrentlyPaused) {
					// Pause all other audio elements
					allAudioElements.forEach((audio) => {
						if (audio !== audioElement) {
							audio.pause();
						}
					});
					// Remove sonix-is-playing class from all play buttons
					document.querySelectorAll(".sonix-player .sonix-play-btn").forEach((btn) => {
						btn.classList.remove("sonix-is-playing");
					});
					// Add sonix-is-playing class only to the current button
					playButton.classList.add("sonix-is-playing");
					audioElement.play();
					updateAudioStatus(true, "Pause");
				} else {
					playButton.classList.remove("sonix-is-playing");
					audioElement.pause();
					updateAudioStatus(false, "Play");
				}
			}

			const repeatButton = this.querySelector(".sonix-repeat-btn");
			// Attached repeactController to repeat button
			repeatButton?.addEventListener("click", handleRepeat);

			function handleRepeat() {
				const isRepeat = repeatButton.classList.toggle("sonix-active");
				if (isRepeat) {
					audioElement.loop = true;
				} else {
					audioElement.loop = false;
				}
			}

			// add timeupdate event to all audio elements
			audioElement.addEventListener("timeupdate", updatePlaybackTime);
			audioElement.addEventListener("timeupdate", handlePlaybackEnd);

			// Initialize Audio Time
			const currentTime = this.querySelector(".sonix-current-time-value");
			const timelineOuter = this.querySelector(".sonix-timeline-outer");
			const timelineInner = this.querySelector(".sonix-timeline-inner");

			function updatePlaybackTime() {
				// calculating audio current time and duration
				let percent = (audioElement.currentTime / audioElement.duration) * 100;
				const audioCurrentTime = Math.floor(audioElement.currentTime);

				const minutes = Math.floor(audioCurrentTime / 60);
				const seconds = Math.floor(audioCurrentTime % 60);

				// formating seconds and minutes
				if (audioCurrentTime) {
					const formatSeconds = seconds < 10 ? `0${seconds}` : seconds;
					currentTime.innerHTML = minutes + ":" + formatSeconds;
				}

				// add number value to width of the timeline inner
				timelineInner.style.width = `${percent}%`;
			}

			function handlePlaybackEnd() {
				// if current time and duration are equal sonix-is-playing removed and audio status changed
				if (audioElement.currentTime !== audioElement.duration) return;

				// if loop activated keep playing current the sound
				if (audioElement.loop === true) {
					updateAudioStatus(true, "Pause");
				} else {
					// if loop not activated stopping the current sound
					updateAudioStatus(false, "Play");
				}
				playButton.classList.remove("sonix-is-playing");
			}

			// Initialize volume control
			const volumeButton = this.querySelector(".sonix-volume-btn");
			const volumeIcon = volumeButton?.querySelector(".sonix-icon");
			const customRange = this.querySelector(".sonix-custom-range");
			const customRangeInner = this.querySelector(".sonix-custom-range-inner");

			if (volumeButton) {
				// Set initial volume
				audioElement.volume = 1;
				customRangeInner.style.width = "100%";

				// Handle volume button click - unmute or muted

				volumeButton.addEventListener("click", handleVolumeToggle);
				function handleVolumeToggle() {
					if (!audioElement.muted) {
						audioElement.volume = 0;
						audioElement.muted = true;
						customRangeInner.style.width = "0%";
						volumeIcon.innerHTML = splitIcon(volumeMute);
					} else {
						audioElement.volume = 1;
						audioElement.muted = false;
						customRangeInner.style.width = "100%";
						volumeIcon.innerHTML = splitIcon(volumeHigh);
					}
				}

				let volumeMoveHandler;
				let volumeUpHandler;
				let volumeTouchMoveHandler;
				let volumeTouchEndHandler;

				// Handle volume range interaction for mouse
				customRange.addEventListener("mousedown", (e) => handleVolumeMouse(e));

				function handleVolumeMouse(e) {
					isDraggingVol = true;
					updateVolume(e);

					// Add event listeners only when dragging starts
					volumeMoveHandler = (e) => {
						if (isDraggingVol) {
							updateVolume(e);
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
				}

				customRange.addEventListener("touchstart", (e) => handleVolumeTouch(e));
				function handleVolumeTouch(e) {
					e.preventDefault();
					isDraggingVol = true;
					updateVolume(e.touches[0]);

					volumeTouchMoveHandler = (e) => {
						if (isDraggingVol) {
							updateVolume(e.touches[0]);
						}
					};

					volumeTouchEndHandler = () => {
						isDraggingVol = false;
						customRangeInner.removeEventListener("touchmove", volumeTouchMoveHandler);
						customRangeInner.removeEventListener("touchend", volumeTouchEndHandler);
					};

					customRangeInner.addEventListener("touchmove", volumeTouchMoveHandler);
					customRangeInner.addEventListener("touchend", volumeTouchEndHandler);
				}
			}

			// control sound volume based on mouse listener
			function updateVolume(e) {
				const rect = customRange.getBoundingClientRect();
				const width = rect.width;
				const x = Math.max(0, Math.min(e.clientX - rect.left, width));
				const volume = Math.max(0, Math.min(1, x / width));

				// Ensure volume is a valid number between 0 and 1
				if (!isFinite(volume)) return;

				audioElement.volume = volume;
				customRangeInner.style.width = `${volume * 100}%`;

				// Update volume icon based on level
				if (volume === 0) {
					volumeIcon.innerHTML = splitIcon(volumeMute);
					audioElement.muted = true;
				} else if (volume < 0.5) {
					volumeIcon.innerHTML = splitIcon(volumeMedium);
				} else {
					audioElement.muted = false;
					volumeIcon.innerHTML = splitIcon(volumeHigh);
				}
			}

			// Handle Audio Speed Controls
			const speedButton = this.querySelector(".sonix-speed-btn");
			speedButton?.addEventListener("click", updatePlaybackSpeed);

			/**
			 * This function retrieves the current playback speed from the speed button's dataset,
			 * increments it by 0.5 (or resets to the minimum speed if the maximum is reached),
			 * updates the audio element's playback rate, and updates the displayed speed value.
			 */
			function updatePlaybackSpeed() {
				let currentSpeed = parseFloat(speedButton.dataset.value);
				currentSpeed = currentSpeed >= parseFloat(speedControl.maxSpeed) ? speedControl.minSpeed : currentSpeed + 0.5;

				// Update speed value
				speedButton.dataset.value = currentSpeed;
				audioElement.playbackRate = currentSpeed;

				// Update speed display
				speedButton.querySelector(".sonix-speed-value").textContent = `${currentSpeed}x`;
			}

			// Control download button
			this.querySelector(".sonix-download-btn")?.addEventListener("click", handleDownload);
			function handleDownload() {
				if (audioElement.duration) {
					const a = document.createElement("a");
					a.href = audioElement.src;
					a.download = textDisplays.name;
					a.click();
				} else {
					console.warn("audio source not found check data-src please");
				}
			}

			// Update audio time based on click and mouse listener in timeline container
			let mouseMoveHandler;
			let mouseUpHandler;
			let touchMoveHandler;
			let touchEndHandler;

			timelineOuter.addEventListener("mousedown", (e) => handleTimelineMouse(e));

			function handleTimelineMouse(e) {
				isDraggingTime = true;
				updateSeekPosition(e);

				// Add event listeners only when dragging starts
				mouseMoveHandler = (e) => {
					if (isDraggingTime) {
						updateSeekPosition(e);
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
			}

			timelineOuter.addEventListener("touchstart", (e) => handleTimelineTouch(e));

			function handleTimelineTouch(e) {
				isDraggingTime = true;
				updateSeekPosition(e.touches[0]);

				touchMoveHandler = (e) => {
					if (isDraggingTime && e.cancelable) {
						e.preventDefault();
						updateSeekPosition(e.touches[0]);
					}
				};

				touchEndHandler = () => {
					isDraggingTime = false;
					timelineOuter.removeEventListener("touchmove", touchMoveHandler);
					timelineOuter.removeEventListener("touchend", touchEndHandler);
				};

				timelineOuter.addEventListener("touchmove", touchMoveHandler);
				timelineOuter.removeEventListener("touchend", touchEndHandler);
			}

			/* 
			Checks if the audio has a valid duration.
			Calculates where the user clicked relative to the timeline.
			Converts that position to a percentage of the timeline's width.
			Sets the audio's current playback time based on that percentage.
			Visually updates the timeline to reflect the new position.
			*/
			function updateSeekPosition(e) {
				if (!audioElement.duration) return;

				const rect = timelineOuter.getBoundingClientRect();
				let offsetX = e.clientX - rect.left;
				offsetX = Math.max(0, Math.min(offsetX, timelineOuter.offsetWidth));

				const percent = offsetX / timelineOuter.offsetWidth;
				audioElement.currentTime = percent * audioElement.duration;
				timelineInner.style.width = `${percent * 100}%`;
			}

			setTimeout(() => {
				// Set autoplay handler when user clicked anywhere of the document playing audio
				const handleAutoPlay = () => {
					if (this.dataset.auto == "true" && audioElement.duration) {
						audioElement.play();
						playButton.classList.add("sonix-is-playing");
						updateAudioStatus(true, "Pause");
					}

					window.removeEventListener("click", handleAutoPlay);
				};

				window.addEventListener("click", handleAutoPlay);
			}, 100);

			if (document.querySelector(".sonix-loader")) {
				document.querySelectorAll(".sonix-loader").forEach((loader) => loader.remove());
			}
		});
	}
}

customElements.define("sonix-player", SonixPlayer);
export default SonixPlayer;
