/*
 * Author: cargomedia.ch
 *
 * Binds 'touchstart' when binding $.on('click')
 * and triggers 'click' when 'touchend' happens without 'touchmove' inbetween.
 */
(function($) {
	if (!("ontouchstart" in window)) {
		return;
	}

	var clickbuster = {
		isLocked: false,
		delayedUnlock: null,
		onClick: function(event) {
			if (this.isLocked || !window.tapReady) {
				event.stopPropagation();
				event.preventDefault();
			}
		},
		lock: function() {
			this.isLocked = true;
			var clickbuster = this;
			this.delayedUnlock = setTimeout(function() {
				clickbuster.unlock();
			}, 2000);
		},
		unlock: function() {
			this.isLocked = false;
			if (this.delayedUnlock) {
				window.clearTimeout(this.delayedUnlock);
			}
		}
	};
	document.addEventListener('click', function(e) {
		clickbuster.onClick(e);
	}, true);





	$.event.special.click = {
		delegateType: "click",
		bindType: "click",
		setup: function(data, namespaces, eventHandle) {
			var element = this;
			var touchHandler = {
				moveThreshold: 20,  // in pixels
				handleEvent: function(e) {
					switch(e.type) {
						case 'touchstart': this.onTouchStart(e); break;
						case 'touchmove': this.onTouchMove(e); break;
						case 'touchend': this.onTouchEnd(e); break;
					}
				},
				onTouchStart: function(e) {
					e.stopPropagation();
					this.moved = false;
					this.startX = e.touches[0].clientX;
					this.startY = e.touches[0].clientY;
					element.addEventListener('touchmove', this, false);
					element.addEventListener('touchend', this, false);
				},
				onTouchMove: function(e) {
					if (Math.abs(e.touches[0].clientX - this.startX) > this.moveThreshold ||
							Math.abs(e.touches[0].clientY - this.startY) > this.moveThreshold) {
						this.moved = true;
					}
				},
				onTouchEnd: function(e) {
					element.removeEventListener('touchmove', this, false);
					element.removeEventListener('touchend', this, false);

					if (!this.moved) {
						clickbuster.unlock();

						var theEvent = document.createEvent('MouseEvents');
						theEvent.initEvent('click', true, true);
						e.target.dispatchEvent(theEvent);

						clickbuster.lock();

						e.stopPropagation();
					}
				}
			};

			element.addEventListener('touchstart', touchHandler, false);

			$(element).data('touchToClick-handler', touchHandler);

			return false;
		},
		teardown: function(namespaces) {
			var element = this;
			var touchHandler = $(element).data('touchToClick-handler');
			element.removeEventListener('touchstart', touchHandler, false);

			return false;
		}
	};
})(jQuery);
