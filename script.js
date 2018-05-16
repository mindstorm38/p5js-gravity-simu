const GRAVITATIONAL_CONSTANT = 6.67408 * Math.pow( 10, -11 );
const GIF_FRAME_LIMIT = 60 * 10;
// const LOGIC_DELAY = 1 / 60; // s : Realtime
const LOGIC_DELAY = 1 / 60 * 1000000;
const MIN_SCALING = 0.00000000006;
const MID_SCALING = 0.0000001;
const MAX_SCALING = 1;

const points = [];

let canvas = null;
let scaling = MIN_SCALING;
let lastCursorX = 0, lastCursorY = 0;
let translateX = 0, translateY = 0;

let sun, earth, lune, mars, venus, mercure, jupiter, saturne, uranus, neptune;

let focusedPoint = null;

function setup() {

	canvas = createCanvas( 640, 640 );
	ellipseMode( CENTER );
	frameRate( 60 );

	canvas.mouseWheel( rescale );

	sun = new Point( 0, 0 );
	sun.radius = 696342 * 1000;
	sun.mass = 1.9891 * Math.pow( 10, 30 );
	sun.color = color( 240, 240, 40 );
	points.push( sun );

	earth = new Point( sun.pos.x + -( 149597887.5 * 1000 ), sun.pos.y );
	earth.radius = 6371.008 * 1000;
	earth.mass = 5.9736 * Math.pow( 10, 24 );
	earth.color = color( 40, 240, 40 );
	earth.vel.y = 29.783 * 1000;
	points.push( earth );

	lune = new Point( earth.pos.x + -( 406300 * 1000 ), earth.pos.y );
	lune.radius = 1735.97 * 1000;
	lune.mass = 7.3477 * Math.pow( 10, 22 );
	lune.color = color( 240, 40, 40 );
	lune.vel.y = earth.vel.y + 1.022 * 1000;
	points.push( lune );

	mars = new Point( sun.pos.x + -( 227936637 * 1000 ), sun.pos.y );
	mars.radius = 3389.5 * 1000;
	mars.mass = 641.85 * Math.pow( 10, 21 );
	mars.color = color( 240, 150, 40 );
	mars.vel.y = 24.077 * 1000;
	points.push( mars );

	venus = new Point( sun.pos.x + -( 108208930 * 1000 ), sun.pos.y );
	venus.radius = 6051.8 * 1000;
	venus.mass = 4.8685 * Math.pow( 10, 24 )
	venus.color = color( 240, 240, 200 );
	venus.vel.y = 35.02 * 1000;
	points.push( venus );

	mercure = new Point( sun.pos.x + -( 57909176 * 1000 ), sun.pos.y );
	mercure.radius = 2439.7 * 1000;
	mercure.mass = 3.3011 * Math.pow( 10, 23 );
	mercure.color = color( 100, 100, 100 );
	mercure.vel.y = 47.36 * 1000;
	points.push( mercure );

	jupiter = new Point( sun.pos.x + -( 778412027 * 1000 ), sun.pos.y );
	jupiter.radius = 69911 * 1000;
	jupiter.mass = 1.8986 * Math.pow( 10, 27 );
	jupiter.color = color( 200, 140, 20 );
	jupiter.vel.y = 13.0572 * 1000;
	points.push( jupiter );

	saturne = new Point( sun.pos.x + -( 1429394069 * 1000 ), sun.pos.y );
	saturne.radius = 58232 * 1000;
	saturne.mass = 568.46 * Math.pow( 10, 24 );
	saturne.color = color( 200, 200, 20 );
	saturne.vel.y = 9.6446 * 1000;
	points.push( saturne );

	uranus = new Point( sun.pos.x + -( 2870658186 * 1000 ), sun.pos.y );
	uranus.radius = 25362 * 1000;
	uranus.mass = 8.6810 * Math.pow( 10, 25 );
	uranus.color = color( 60, 60, 200 );
	uranus.vel.y = 6.80 * 1000;
	points.push( uranus );

	neptune = new Point( sun.pos.x + -( 4503443661 * 1000 ), sun.pos.y );
	neptune.radius = 24622 * 1000;
	neptune.mass = 102.43 * Math.pow( 10, 24 );
	neptune.color = color( 120, 120, 200 );
	neptune.vel.y = 5.4317 * 1000;
	points.push( neptune );

	focusedPoint = sun;

}

function draw() {

	background( 10 );

	if ( focusedPoint !== null ) {

		translateX = -focusedPoint.pos.x + ( width * ( 1 / scaling ) / 2 );
		translateY = -focusedPoint.pos.y + ( height * ( 1 / scaling ) / 2 );

	}

	scale( scaling );
	translate( translateX, translateY );

	points.forEach( p => p.draw() );
	points.forEach( p => p.update() );

}

function rescale( e ) {

	let dif = -e.deltaY * map( scaling, 0, 1, 0.00000000000000001, 0.1 );

	/*
	let relCursorX = map( mouseX, 0, width, translateX, translateX + width * ( 1 / scaling ) );
	let relCursorY = map( mouseY, 0, height, translateY, translateY + height * ( 1 / scaling ) );

	console.log( relCursorX + ":" + relCursorY );

	translateX += 0;
	translateY += 0;
	*/

	scaling += dif;

	if ( scaling < MIN_SCALING ) scaling = MIN_SCALING;
	else if ( scaling > MAX_SCALING ) scaling = MAX_SCALING;

}

function mousePressed() {

	lastCursorX = mouseX;
	lastCursorY = mouseY;

}

function mouseDragged() {

	let difCursorX = mouseX - lastCursorX;
	let difCursorY = mouseY - lastCursorY;

	translateX += difCursorX / scaling;
	translateY += difCursorY / scaling;

	lastCursorX = mouseX;
	lastCursorY = mouseY;

}

class Point {

	constructor( x, y ) {

		this.pos = createVector( x, y );
		this.vel = createVector( 0, 0 );

		this.radius = 1; // m
		this.mass = 1000000000; // kg

		this.color = color( 255, 255, 255 );
		this.label = null;

		this.colliding = [];

	}

	draw() {

		fill( this.color );

		let s = ( 1 / scaling ) * 10;

		if ( scaling < MID_SCALING ) {
			ellipse( this.pos.x, this.pos.y, s, s );
		} else {
			ellipse( this.pos.x, this.pos.y, this.radius * 2, this.radius * 2 );
		}



		points.forEach( p => {

			if ( p === this ) return;
			// if ( this.colliding.indexOf( p ) !== -1 ) return;

			let dist = this.pos.dist( p.pos );

			let force = ( this.mass * p.mass ) / ( dist * dist ) * GRAVITATIONAL_CONSTANT;
			let acceleration = force / this.mass;

			let angle = p.pos.copy().sub( this.pos );
			angle.normalize();
			angle.mult( acceleration * LOGIC_DELAY );

			this.vel.add( angle );

		} );

	}

	update() {

		this.pos.add( this.vel.copy().mult( LOGIC_DELAY ) );

		this.colliding = [];

		points.forEach( p => {

			if ( p === this ) return;

			let dist = this.pos.dist( p.pos );
			let minlength = this.radius + p.radius;

			if ( dist < minlength ) {

				let angle = p.pos.copy().sub( this.pos );
				angle.normalize();
				angle.mult( - ( minlength - dist ) );

				this.pos.add( angle );

				this.colliding.push( p );

			}

		} );



	}

}
