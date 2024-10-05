/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);

document.addEventListener('DOMContentLoaded', function() {
    const galleryImage = document.getElementById('galleryImage');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const imageDescription = document.getElementById('imageDescription');
    const photoCounter = document.getElementById('photoCounter');
    const yearSelect = document.getElementById('yearSelect');
    const conferenceSelect = document.getElementById('conferenceSelect');

    const photosByYear = {
        '2024': {
            'Aspen Center for Physics': [
                { src: 'photos/2024/Aspen/AspenGroupPhoto.JPG', desc: 'A group photo of the participants in attendance for the workshop on understanding the Multiphase CGM at Aspen Center for Physics, Aspen, Colorado.' },
                { src: 'photos/2024/Aspen/BlackBoardTalk1.jpg', desc: 'A blackboard talk delivered by me on small scale structure in the CGM.' },
                { src: 'photos/2024/Aspen/BlackBoardTalk2.jpg', desc: 'A blackboard talk delivered by me on small scale structure in the CGM.' },
                { src: 'photos/2024/Aspen/View1.jpg', desc: 'A stunning view of a manicured landscape surrounded by rolling hills in Aspen.' },
                { src: 'photos/2024/Aspen/View2.jpg', desc: 'A serene golf course featuring a tranquil pond.' },
                { src: 'photos/2024/Aspen/View3.jpg', desc: 'Majestic Maroon Bells peaks towering over an alpine lake.'},
                { src: 'photos/2024/Aspen/BalloonFestival1.jpg', desc: 'Snowmass Balloon Festival during the popular Night Glow - a long-standing rocky mountain tradition.'},
                { src: 'photos/2024/Aspen/BalloonFestival2.jpg', desc: 'Vibrant hot air balloons illuminate the twilight sky at the festival.'}
            ]
            'Harvard University': [
                { src: 'photos/2024/Harvard/PresentationPic.jpg', desc: 'Presenting my work on the properties of Cool CGM Gas of the Andromeda galaxy at the conference on Multiphase Madness: Resolving the CGM in Theory and Observations.' },
                { src: 'photos/2024/Harvard/Library.jpg', desc: 'Harvard Library - the largest academic and private library in the world.' },
                { src: 'photos/2024/Harvard/HarvardArtMuseum.jpg', desc: 'Gallery space at the Harvard Art Museum.' }
            ]
	'Northwestern University': [
                { src: 'photos/2024/CodeAstro/Presentation.jpg', desc: 'Presenting our Absorption line finding algorithm and its development at Code Astro.' },
                { src: 'photos/2024/CodeAstro/Presentation2.jpg', desc: 'Demonstrating the setup of pyALF package for finding absorption lines in quasar spectra.' }
            ]
	},
        '2023': {
            'Arizona State University': [
                { src: 'photos/2023/ASU/GroupPhoto.JPG', desc: 'A group photo of the participants in attendance for the conference on Oases in the Cosmic Desert: Understanding the Structure of the Circumgalactic Medium at ASU, Arizona.'},
                { src: 'photos/2023/ASU/Talk.jpg', desc: 'Delivering a talk on Observing the CGM through the Lens of a Forward Modeling Bayesian Approach.' },
                { src: 'photos/2023/ASU/Talk2.jpg', desc: 'Delivering a talk on Observing the CGM through the Lens of a Forward Modeling Bayesian Approach.' }
            ]
	},
        // Add more years and conferences as needed
    };

    let currentYear = Object.keys(photosByYear)[0];
    let currentConference = Object.keys(photosByYear[currentYear])[0];
    let currentIndex = 0;

    function updateImage() {
        const images = photosByYear[currentYear][currentConference];
        galleryImage.src = images[currentIndex].src;
        imageDescription.textContent = images[currentIndex].desc;
        photoCounter.textContent = `Photo ${currentIndex + 1} of ${images.length}`;
    }

    function populateYearSelect() {
        yearSelect.innerHTML = '';
        for (let year in photosByYear) {
            let option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    function populateConferenceSelect() {
        conferenceSelect.innerHTML = '';
        for (let conference in photosByYear[currentYear]) {
            let option = document.createElement('option');
            option.value = conference;
            option.textContent = conference;
            conferenceSelect.appendChild(option);
        }
    }

    prevButton.addEventListener('click', function() {
        const images = photosByYear[currentYear][currentConference];
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
    });

    nextButton.addEventListener('click', function() {
        const images = photosByYear[currentYear][currentConference];
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
    });

    yearSelect.addEventListener('change', function() {
        currentYear = this.value;
        populateConferenceSelect();
        currentConference = Object.keys(photosByYear[currentYear])[0];
        currentIndex = 0;
        updateImage();
    });

    conferenceSelect.addEventListener('change', function() {
        currentConference = this.value;
        currentIndex = 0;
        updateImage();
    });

    // Initialize
    populateYearSelect();
    populateConferenceSelect();
    updateImage();
});
