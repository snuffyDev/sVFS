export {};
var process = {};
var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimeout() {
	throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
	throw new Error("clearTimeout has not been defined");
}
(function () {
	try {
		if (typeof setTimeout === "function") {
			cachedSetTimeout = setTimeout;
		} else {
			cachedSetTimeout = defaultSetTimeout;
		}
	} catch (e) {
		cachedSetTimeout = defaultSetTimeout;
	}
	try {
		if (typeof clearTimeout === "function") {
			cachedClearTimeout = clearTimeout;
		} else {
			cachedClearTimeout = defaultClearTimeout;
		}
	} catch (e) {
		cachedClearTimeout = defaultClearTimeout;
	}
})();
function runTimeout(fun) {
	if (cachedSetTimeout === setTimeout) {
		//normal enviroments in sane situations
		return setTimeout(fun, 0);
	}
	// if setTimeout wasn't available but was latter defined
	if ((cachedSetTimeout === defaultSetTimeout || !cachedSetTimeout) && setTimeout) {
		cachedSetTimeout = setTimeout;
		return setTimeout(fun, 0);
	}
	try {
		// when when somebody has screwed with setTimeout but no I.E. maddness
		return cachedSetTimeout(fun, 0);
	} catch (e) {
		try {
			// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
			return cachedSetTimeout.call(null, fun, 0);
		} catch (e) {
			// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
			return cachedSetTimeout.call(this, fun, 0);
		}
	}
}
function runClearTimeout(marker) {
	if (cachedClearTimeout === clearTimeout) {
		//normal enviroments in sane situations
		return clearTimeout(marker);
	}
	// if clearTimeout wasn't available but was latter defined
	if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
		cachedClearTimeout = clearTimeout;
		return clearTimeout(marker);
	}
	try {
		// when when somebody has screwed with setTimeout but no I.E. maddness
		return cachedClearTimeout(marker);
	} catch (e) {
		try {
			// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
			return cachedClearTimeout.call(null, marker);
		} catch (e) {
			// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
			// Some versions of I.E. have different rules for clearTimeout vs setTimeout
			return cachedClearTimeout.call(this, marker);
		}
	}
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
	if (!draining || !currentQueue) {
		return;
	}
	draining = false;
	if (currentQueue.length) {
		queue = currentQueue.concat(queue);
	} else {
		queueIndex = -1;
	}
	if (queue.length) {
		drainQueue();
	}
}

function drainQueue() {
	if (draining) {
		return;
	}
	var timeout = runTimeout(cleanUpNextTick);
	draining = true;

	var len = queue.length;
	while (len) {
		currentQueue = queue;
		queue = [];
		while (++queueIndex < len) {
			if (currentQueue) {
				currentQueue[queueIndex].run();
			}
		}
		queueIndex = -1;
		len = queue.length;
	}
	currentQueue = null;
	draining = false;
	runClearTimeout(timeout);
}

process.nextTick = function (fun) {
	var args = new Array(arguments.length - 1);
	if (arguments.length > 1) {
		for (var i = 1; i < arguments.length; i++) {
			args[i - 1] = arguments[i];
		}
	}
	queue.push(new Item(fun, args));
	if (queue.length === 1 && !draining) {
		runTimeout(drainQueue);
	}
};

// v8 likes predictible objects
function Item(fun, array) {
	this.fun = fun;
	this.array = array;
}
Item.prototype.run = function () {
	this.fun.apply(null, this.array);
};

export { process };
