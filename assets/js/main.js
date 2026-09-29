/**
 * Mohan Portfolio — static site front-end interactions.
 *
 * Everything here is plain JS, no build step, no dependencies:
 *  - scroll-triggered fade/slide reveals
 *  - fixed navbar "scrolled" state + smooth-scroll active-section highlight
 *  - a thin scroll-progress bar (the "smooth transition while scrolling" cue)
 *  - the accordion "stages" list
 *  - the draggable, gently floating hero ID card
 *  - the 3D case-study card stack cycler
 */
( function () {
	'use strict';

	var reduceMotion = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	document.addEventListener( 'DOMContentLoaded', function () {
		initNavbarScrollState();
		initScrollProgress();
		initScrollSpy();
		initReveals();
		initAccordion();
		initIdCardDrag();
		initWorkStack();
	} );

	/** Toggle .is-scrolled on the navbar past 30px. */
	function initNavbarScrollState() {
		var nav = document.getElementById( 'mp-navbar' );
		if ( ! nav ) { return; }
		function handler() {
			nav.classList.toggle( 'is-scrolled', window.scrollY > 30 );
		}
		handler();
		window.addEventListener( 'scroll', handler, { passive: true } );
	}

	/** Thin progress bar across the top of the viewport tied to scroll position. */
	function initScrollProgress() {
		var bar = document.querySelector( '.mp-scroll-progress' );
		if ( ! bar ) { return; }
		function handler() {
			var doc = document.documentElement;
			var scrollTop = window.scrollY || doc.scrollTop;
			var height = ( doc.scrollHeight - doc.clientHeight ) || 1;
			bar.style.width = Math.min( 100, ( scrollTop / height ) * 100 ) + '%';
		}
		handler();
		window.addEventListener( 'scroll', handler, { passive: true } );
		window.addEventListener( 'resize', handler );
	}

	/**
	 * On the one-page home, highlight the matching nav icon as each
	 * section scrolls into view (only runs when [data-scrollspy] sections
	 * exist on the current page — standalone pages don't have them).
	 */
	function initScrollSpy() {
		var sections = document.querySelectorAll( '[data-scrollspy]' );
		var navButtons = document.querySelectorAll( '.mp-navbar__btn[data-nav-key]' );
		if ( ! sections.length || ! navButtons.length || typeof IntersectionObserver === 'undefined' ) { return; }

		var map = {};
		navButtons.forEach( function ( btn ) { map[ btn.getAttribute( 'data-nav-key' ) ] = btn; } );

		var observer = new IntersectionObserver( function ( entries ) {
			entries.forEach( function ( entry ) {
				if ( ! entry.isIntersecting ) { return; }
				var key = entry.target.getAttribute( 'data-scrollspy' );
				navButtons.forEach( function ( b ) { b.classList.remove( 'is-active' ); } );
				if ( map[ key ] ) { map[ key ].classList.add( 'is-active' ); }
			} );
		}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 } );

		sections.forEach( function ( s ) { observer.observe( s ); } );
	}

	/** IntersectionObserver-driven fade/slide-up reveal for .reveal elements. */
	function initReveals() {
		var items = document.querySelectorAll( '.reveal' );
		if ( ! items.length ) { return; }
		if ( reduceMotion || typeof IntersectionObserver === 'undefined' ) {
			items.forEach( function ( el ) { el.classList.add( 'is-visible' ); } );
			return;
		}
		var observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'is-visible' );
						observer.unobserve( entry.target );
					}
				} );
			},
			{ threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
		);
		items.forEach( function ( el ) { observer.observe( el ); } );
	}

	/** Single-open accordion for the "Stages of Digital Marketing" list. */
	function initAccordion() {
		var stages = document.querySelectorAll( '[data-stage]' );
		stages.forEach( function ( stage ) {
			var trigger = stage.querySelector( '.mp-stage__trigger' );
			if ( ! trigger ) { return; }
			trigger.addEventListener( 'click', function () {
				var isOpen = stage.classList.contains( 'is-open' );
				stages.forEach( function ( other ) {
					other.classList.remove( 'is-open' );
					var t = other.querySelector( '.mp-stage__trigger' );
					if ( t ) { t.setAttribute( 'aria-expanded', 'false' ); }
				} );
				if ( ! isOpen ) {
					stage.classList.add( 'is-open' );
					trigger.setAttribute( 'aria-expanded', 'true' );
				}
			} );
		} );
	}

	/** Draggable hero ID card, constrained to its wrapper, eases back on release. */
	function initIdCardDrag() {
		var card = document.getElementById( 'mp-id-card' );
		var wrap = document.getElementById( 'mp-id-card-constraints' );
		if ( ! card || ! wrap || reduceMotion ) { return; }

		var dragging = false;
		var startX = 0, startY = 0, offsetX = 0, offsetY = 0;
		var maxRange = 60;

		function clamp( v, min, max ) { return Math.max( min, Math.min( max, v ) ); }

		function pointerDown( e ) {
			dragging = true;
			card.classList.add( 'is-dragging' );
			startX = ( e.touches ? e.touches[0].clientX : e.clientX ) - offsetX;
			startY = ( e.touches ? e.touches[0].clientY : e.clientY ) - offsetY;
			card.style.transition = 'none';
		}
		function pointerMove( e ) {
			if ( ! dragging ) { return; }
			var x = ( e.touches ? e.touches[0].clientX : e.clientX ) - startX;
			var y = ( e.touches ? e.touches[0].clientY : e.clientY ) - startY;
			offsetX = clamp( x, -maxRange, maxRange );
			offsetY = clamp( y, -maxRange, maxRange );
			card.style.transform = 'translate(' + offsetX + 'px,' + offsetY + 'px)';
		}
		function pointerUp() {
			if ( ! dragging ) { return; }
			dragging = false;
			card.classList.remove( 'is-dragging' );
			card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
			card.style.transform = '';
			offsetX = 0;
			offsetY = 0;
			window.setTimeout( function () { card.style.transition = ''; }, 650 );
		}

		card.addEventListener( 'mousedown', pointerDown );
		window.addEventListener( 'mousemove', pointerMove );
		window.addEventListener( 'mouseup', pointerUp );
		card.addEventListener( 'touchstart', pointerDown, { passive: true } );
		window.addEventListener( 'touchmove', pointerMove, { passive: true } );
		window.addEventListener( 'touchend', pointerUp );
	}

	/** 3D card-stack cycler for the "Selected Work" section. */
	function initWorkStack() {
		var stack = document.getElementById( 'mp-work-stack' );
		if ( ! stack ) { return; }
		var count = parseInt( stack.getAttribute( 'data-count' ), 10 ) || 0;
		if ( count < 2 ) { return; }

		var cards = Array.prototype.slice.call( stack.querySelectorAll( '.mp-work__card' ) );
		var dots = Array.prototype.slice.call( document.querySelectorAll( '#mp-work-dots .mp-work__dot' ) );
		var panels = Array.prototype.slice.call( document.querySelectorAll( '#mp-work-panel .mp-work__panel' ) );
		var active = 0;

		function render() {
			cards.forEach( function ( card, i ) {
				var diff = ( i - active + count ) % count;
				card.style.zIndex = String( count - diff );
				card.style.transform = 'translateY(' + ( diff * 28 ) + 'px) scale(' + ( 1 - diff * 0.045 ) + ')';
				card.style.opacity = diff > 2 ? '0' : '1';
				card.classList.toggle( 'is-active', diff === 0 );
			} );
			dots.forEach( function ( dot, i ) { dot.classList.toggle( 'is-active', i === active ); } );
			panels.forEach( function ( panel, i ) { panel.hidden = i !== active; } );
		}

		cards.forEach( function ( card, i ) {
			card.addEventListener( 'click', function () {
				active = ( i === active ) ? ( active + 1 ) % count : i;
				render();
			} );
		} );
		dots.forEach( function ( dot, i ) {
			dot.addEventListener( 'click', function () { active = i; render(); } );
		} );

		render();
	}
} )();
