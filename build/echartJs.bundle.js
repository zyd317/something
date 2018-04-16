/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "13a4e0272f122be8e13e"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _price = __webpack_require__(1);

var _price2 = _interopRequireDefault(_price);

var _data = __webpack_require__(4);

var _data2 = _interopRequireDefault(_data);

__webpack_require__(5);

__webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by yidi.zhao on 2018/4/16.
 *
 * 被js引入的css，会因为webpack的配置new ExtractTextPlugin("styles.css") 被自动加上前缀之后打包成styles.css
 */
new _price2.default().setData(_data2.default.lowPriceList, _data2.default.priceTrendDetailInfo);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by yidi.zhao on 2018/3/30.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _echarts = __webpack_require__(2);

var _echarts2 = _interopRequireDefault(_echarts);

var _iscroll = __webpack_require__(3);

var _iscroll2 = _interopRequireDefault(_iscroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PriceTrend = function () {
    function PriceTrend() {
        _classCallCheck(this, PriceTrend);

        this.itemLength = 53; // 设置每一个节点的宽度
        this.currentIndex = -1; // 防止按钮被多次点击,默认第一个按钮被点击
    }

    _createClass(PriceTrend, [{
        key: 'setData',
        value: function setData(data, priceTrendDetailInfo) {
            this.priceTime = [];
            this.priceHasIcon = [];
            this.price = [];
            this.data = data;
            this.startData = data[0].depDate; // 开始日期
            this.priceTrendDetailInfo = priceTrendDetailInfo;
            this.formatData();
            this.renderPriceTrend();
        }
    }, {
        key: 'renderPriceTrend',
        value: function renderPriceTrend() {
            var width = this.itemLength * this.priceHasIcon.length;
            $("#price-trend").removeClass("m-place-holder").css({ "background": "#142946" }).html('<div class="m-echarts" id="echarts">' + '<div class="m-container" style="width:' + width + 'px">' + '<div id="container" class="m-container"></div>' + '</div></div>');
            this.setInitOption();
            this.initScroll();
        }

        /**
         * 初始化scroll
         */

    }, {
        key: 'initScroll',
        value: function initScroll() {
            if (this.myScrollX) {
                this.myScrollX.refresh();
                return;
            }
            //水平方向的scroll
            if ($('#scrollerX .m-container').length > 0) {
                var width = $('#scrollerX .m-container').width();
                $('#scrollerX').css({ width: width });
                this.myScrollX = new _iscroll2.default('#wrapperX', { scrollX: true, scrollY: false });
                this.myScrollX.refresh();
            }
        }

        /**
         * 格式化data
         */

    }, {
        key: 'formatData',
        value: function formatData() {
            var _this = this;

            var priceTime = [];
            var priceHasIcon = [];
            var price = [];
            this.data.forEach(function (item) {
                priceTime.push(_this.parseDate(item.depDate));
                priceHasIcon.push("¥" + item.price);
                price.push(item.price);
            });

            this.priceTime = priceTime;
            this.priceHasIcon = priceHasIcon;
            this.price = price;
        }

        /**
         * 将"2018-09-01" -> "09-01\n星期一"
         * @param date
         * @return {string}
         */

    }, {
        key: 'parseDate',
        value: function parseDate(date) {
            var cn_week = ['日', '一', '二', '三', '四', '五', '六'];
            var time = new Date(date);
            date = date.split("-");
            return date[1] + '.' + date[2] + '\n星期' + cn_week[time.getDay()];
        }

        /**
         * 配置echart的options
         */

    }, {
        key: 'setInitOption',
        value: function setInitOption() {
            var _this2 = this;

            this.imageMarkLabel = new Image();
            this.imageMarkLabel.src = './img/bg.png';
            var dom = document.getElementById("container");
            // var myChart = echarts.init(dom, null, {renderer: 'svg'});
            this.myChart = _echarts2.default.init(dom);
            var colors = ['#4682B4', '#48D1CC', '#675bba'];

            // 设置最初的option
            this.initOption = {
                animation: false, // 不使用动画
                grid: { // 直角坐标系的位置,left.right隐藏边界值
                    left: -10,
                    top: 30, // 防止X轴被遮挡
                    right: -30,
                    bottom: 0
                },
                tooltip: { // 提示框组件
                    trigger: 'axis', // 三维度激活
                    formatter: function formatter(value) {
                        _this2.dealClick(value[0].dataIndex);
                    },
                    triggerOn: 'click', // click方式激活
                    axisPointer: { // 线的样式
                        type: 'line',
                        snap: true,
                        label: {
                            backgroundColor: "transparent",
                            color: '#FF8C00'
                        },
                        lineStyle: {
                            opacity: 0 // 删除竖线
                        },
                        crossStyle: {
                            opacity: 0 // 删除横线
                        }
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: this.priceTime,
                    inside: true,
                    offset: -60,
                    z: 100,
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        showMinLabel: true,
                        interval: 0,
                        color: '#6dccd9'
                    }
                }, {
                    type: 'category',
                    data: this.priceHasIcon,
                    position: "top",
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        showMinLabel: true,
                        interval: 0, // 显示所有数值
                        color: colors[0]
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'solid',
                            color: new _echarts2.default.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: colors[0]
                            }, {
                                offset: 1,
                                color: 'transparent'
                            }]),
                            width: 1
                        }
                    }
                }],
                yAxis: { // y轴不展示
                    show: false,
                    max: function max(value) {
                        // 设置Y轴最大值，避免遮挡X轴上坐标展示
                        return value.max + 100;
                    },
                    min: function min(value) {
                        // 设置Y轴最大值，避免遮挡X轴上坐标展示
                        return value.min - 1000;
                    },
                    axisPointer: { // 线的样式
                        show: false
                    }
                },
                series: [{
                    data: this.price,
                    symbol: 'emptyCircle',
                    symbolSize: 20,
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        origin: "start", // 颜色填充坐标轴底部
                        color: new _echarts2.default.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(15, 255, 183)'
                        }, {
                            offset: 1,
                            color: 'rgb(6, 134, 190)'
                        }])
                    },
                    lineStyle: {
                        normal: {
                            color: colors[1],
                            width: 1,
                            type: 'solid'
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 2,
                            borderColor: colors[1],
                            color: colors[1]
                        }
                    },
                    //期望价格
                    markLine: {
                        symbol: 'none',
                        label: {
                            position: 'start',
                            // backgroundColor: "#fff", // 使用颜色块
                            backgroundColor: {
                                image: this.imageMarkLabel, // 支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
                                repeat: 'repeat'
                            },
                            padding: [4, 12, 4, 4],
                            color: '#616161',
                            fontSize: 10,
                            formatter: '最低价{help|￥' + this.priceTrendDetailInfo.price + '}',
                            rich: {
                                help: {
                                    color: '#FF8C00'
                                }
                            }
                        },
                        lineStyle: {
                            color: '#FF8C00'
                        },
                        data: [{ // data设置出错会导致基准线无法显示
                            x: 105, // 距离Y轴的距离
                            yAxis: this.priceTrendDetailInfo.price // Y轴的值
                        }]
                    }
                }]
            };
            this.setXRange(this.initOption); // 设置X轴的价格区间，得到初始的initOption

            this.drawChart();
        }

        /**
         * 开始绘制echarts,并且设置初始值，滚动到初始位置
         */

    }, {
        key: 'drawChart',
        value: function drawChart() {
            var oneFrameTotal = Math.floor(window.innerWidth / this.itemLength / 2);
            var index = Math.ceil((new Date(this.priceTrendDetailInfo.depDate) - new Date(this.startData)) / 86400000);
            var day = oneFrameTotal - index;

            // 首次默认选中
            var option1 = $.extend(true, {}, this.initOption); // 获取最初的option
            this.setClickShape(option1, index, this.price[index]);

            this.currentIndex = index; // 保存初始index

            // todo 不知道这个为什么滚不回去了
            // $("#wrapperX").scrollLeft(-day*this.itemLength); // 滚动到初始位置
        }

        /**
         * 设置X轴特殊数据的样式
         * @param option1
         */

    }, {
        key: 'setXRange',
        value: function setXRange(option1) {
            var selectStartTime = '2018-04-19';
            var selectEndTime = '2018-04-28';
            // 设置时间区间样式
            var startIndex = this.getDataIndex(this.data, selectStartTime);
            var endIndex = this.getDataIndex(this.data, selectEndTime, true);
            for (var i = startIndex; i <= endIndex; i++) {
                option1.xAxis[0].data[i] = {
                    value: this.priceTime[i],
                    textStyle: {
                        color: "#fff"
                    }
                };
            }
        }
    }, {
        key: 'getDataIndex',
        value: function getDataIndex(arr, item, endTag) {
            for (var i = 0; i < arr.length; i++) {
                if ((new Date(item) - new Date(arr[i].date)) / 86400000 === 0) {
                    return i;
                } else if ((new Date(item) - new Date(arr[i].date)) / 86400000 < 0) {
                    if (endTag) {
                        return i - 1;
                    } else {
                        return i;
                    }
                }
            }
        }

        /**
         * 处理选中的样式,边界节点废弃，没有效果(为了图能够衔接在一起)
         * @param index 选中的index
         */

    }, {
        key: 'dealClick',
        value: function dealClick(index) {
            // 非点击的本节点和边界节点
            if (index !== this.currentIndex && index > 0 && index < this.price.length) {
                var option2 = $.extend(true, {}, this.initOption);
                this.price[index] += 10;

                option2.series[0].data = this.price; // 更新数据
                this.setClickShape(option2, index, this.price[index]);

                this.currentIndex = index; // 保存本次的index
            }
        }

        /**
         * 设置点击按钮的特效
         * @param option1
         * @param index
         * @param newPrice
         */

    }, {
        key: 'setClickShape',
        value: function setClickShape(option1, index, newPrice) {
            // 设置选中样式
            option1.series[0].data[index] = {
                value: newPrice,
                symbol: 'image://./img/btn.png',
                symbolSize: 40
            };
            option1.xAxis[0].data[index] = {
                value: this.priceTime[index].value || this.priceTime[index],
                textStyle: {
                    color: "#c96e1e"
                }
            };
            option1.xAxis[1].data[index] = {
                value: this.priceHasIcon[index].value || this.priceHasIcon[index],
                textStyle: {
                    color: "#c96e1e"
                }
            };
            this.myChart.setOption(option1); // 更新数据
        }
    }]);

    return PriceTrend;
}();

exports.default = PriceTrend;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};!function(t,e){"object"==( false?"undefined":_typeof(exports))&&"undefined"!=typeof module?e(exports): true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):e(t.echarts={});}(undefined,function(t){"use strict";var e=2311,n=function n(){return e++;},v="undefined"!=typeof wx?{browser:{},os:{},node:!1,wxa:!0,canvasSupported:!0,svgSupported:!1,touchEventsSupported:!0}:"undefined"==typeof document&&"undefined"!=typeof self?{browser:{},os:{},node:!1,worker:!0,canvasSupported:!0}:"undefined"==typeof navigator?{browser:{},os:{},node:!0,worker:!1,canvasSupported:!0,svgSupported:!0}:function(t){var e={},i=t.match(/Firefox\/([\d.]+)/),n=t.match(/MSIE\s([\d.]+)/)||t.match(/Trident\/.+?rv:(([\d.]+))/),a=t.match(/Edge\/([\d.]+)/),o=/micromessenger/i.test(t);i&&(e.firefox=!0,e.version=i[1]);n&&(e.ie=!0,e.version=n[1]);a&&(e.edge=!0,e.version=a[1]);o&&(e.weChat=!0);return{browser:e,os:{},node:!1,canvasSupported:!!document.createElement("canvas").getContext,svgSupported:"undefined"!=typeof SVGRect,touchEventsSupported:"ontouchstart"in window&&!e.ie&&!e.edge,pointerEventsSupported:"onpointerdown"in window&&(e.edge||e.ie&&11<=e.version)};}(navigator.userAgent);var s={"[object Function]":1,"[object RegExp]":1,"[object Date]":1,"[object Error]":1,"[object CanvasGradient]":1,"[object CanvasPattern]":1,"[object Image]":1,"[object Canvas]":1},l={"[object Int8Array]":1,"[object Uint8Array]":1,"[object Uint8ClampedArray]":1,"[object Int16Array]":1,"[object Uint16Array]":1,"[object Int32Array]":1,"[object Uint32Array]":1,"[object Float32Array]":1,"[object Float64Array]":1},h=Object.prototype.toString,i=Array.prototype,r=i.forEach,u=i.filter,a=i.slice,c=i.map,d=i.reduce,o={};function f(t,e){"createCanvas"===t&&(m=null),o[t]=e;}function A(t){if(null==t||"object"!=(typeof t==="undefined"?"undefined":_typeof(t)))return t;var e=t,i=h.call(t);if("[object Array]"===i){if(!K(t)){e=[];for(var n=0,a=t.length;n<a;n++){e[n]=A(t[n]);}}}else if(l[i]){if(!K(t)){var o=t.constructor;if(t.constructor.from)e=o.from(t);else{e=new o(t.length);for(n=0,a=t.length;n<a;n++){e[n]=A(t[n]);}}}}else if(!s[i]&&!K(t)&&!V(t))for(var r in e={},t){t.hasOwnProperty(r)&&(e[r]=A(t[r]));}return e;}function g(t,e,i){if(!R(e)||!R(t))return i?A(e):t;for(var n in e){if(e.hasOwnProperty(n)){var a=t[n],o=e[n];!R(o)||!R(a)||E(o)||E(a)||V(o)||V(a)||I(o)||I(a)||K(o)||K(a)?!i&&n in t||(t[n]=A(e[n])):g(a,o,i);}}return t;}function p(t,e){for(var i=t[0],n=1,a=t.length;n<a;n++){i=g(i,t[n],e);}return i;}function k(t,e){for(var i in e){e.hasOwnProperty(i)&&(t[i]=e[i]);}return t;}function C(t,e,i){for(var n in e){e.hasOwnProperty(n)&&(i?null!=e[n]:null==t[n])&&(t[n]=e[n]);}return t;}var m,y=function y(){return o.createCanvas();};function x(){return m||(m=y().getContext("2d")),m;}function L(t,e){if(t){if(t.indexOf)return t.indexOf(e);for(var i=0,n=t.length;i<n;i++){if(t[i]===e)return i;}}return-1;}function _(t,e){var i=t.prototype;function n(){}for(var a in n.prototype=e.prototype,t.prototype=new n(),i){t.prototype[a]=i[a];}(t.prototype.constructor=t).superClass=e;}function w(t,e,i){C(t="prototype"in t?t.prototype:t,e="prototype"in e?e.prototype:e,i);}function O(t){if(t)return"string"!=typeof t&&"number"==typeof t.length;}function z(t,e,i){if(t&&e)if(t.forEach&&t.forEach===r)t.forEach(e,i);else if(t.length===+t.length)for(var n=0,a=t.length;n<a;n++){e.call(i,t[n],n,t);}else for(var o in t){t.hasOwnProperty(o)&&e.call(i,t[o],o,t);}}function P(t,e,i){if(t&&e){if(t.map&&t.map===c)return t.map(e,i);for(var n=[],a=0,o=t.length;a<o;a++){n.push(e.call(i,t[a],a,t));}return n;}}function b(t,e,i,n){if(t&&e){if(t.reduce&&t.reduce===d)return t.reduce(e,i,n);for(var a=0,o=t.length;a<o;a++){i=e.call(n,i,t[a],a,t);}return i;}}function T(t,e,i){if(t&&e){if(t.filter&&t.filter===u)return t.filter(e,i);for(var n=[],a=0,o=t.length;a<o;a++){e.call(i,t[a],a,t)&&n.push(t[a]);}return n;}}function S(t,e){var i=a.call(arguments,2);return function(){return t.apply(e,i.concat(a.call(arguments)));};}function N(t){var e=a.call(arguments,1);return function(){return t.apply(this,e.concat(a.call(arguments)));};}function E(t){return"[object Array]"===h.call(t);}function M(t){return"function"==typeof t;}function D(t){return"[object String]"===h.call(t);}function R(t){var e=typeof t==="undefined"?"undefined":_typeof(t);return"function"===e||!!t&&"object"==e;}function I(t){return!!s[h.call(t)];}function B(t){return!!l[h.call(t)];}function V(t){return"object"==(typeof t==="undefined"?"undefined":_typeof(t))&&"number"==typeof t.nodeType&&"object"==_typeof(t.ownerDocument);}function G(t){return t!=t;}function W(t){for(var e=0,i=arguments.length;e<i;e++){if(null!=arguments[e])return arguments[e];}}function F(t,e){return null!=t?t:e;}function H(t,e,i){return null!=t?t:null!=e?e:i;}function Z(){return Function.call.apply(a,arguments);}function U(t){if("number"==typeof t)return[t,t,t,t];var e=t.length;return 2===e?[t[0],t[1],t[0],t[1]]:3===e?[t[0],t[1],t[2],t[1]]:t;}function j(t,e){if(!t)throw new Error(e);}function X(t){return null==t?null:"function"==typeof t.trim?t.trim():t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");}o.createCanvas=function(){return document.createElement("canvas");};var Y="__ec_primitive__";function q(t){t[Y]=!0;}function K(t){return t[Y];}function $(t){var i=E(t),n=this;function e(t,e){i?n.set(t,e):n.set(e,t);}t instanceof $?t.each(e):t&&z(t,e);}function J(t){return new $(t);}function Q(t,e){for(var i=new t.constructor(t.length+e.length),n=0;n<t.length;n++){i[n]=t[n];}var a=t.length;for(n=0;n<e.length;n++){i[n+a]=e[n];}return i;}function tt(){}$.prototype={constructor:$,get:function get(t){return this.hasOwnProperty(t)?this[t]:null;},set:function set(t,e){return this[t]=e;},each:function each(t,e){for(var i in void 0!==e&&(t=S(t,e)),this){this.hasOwnProperty(i)&&t(this[i],i);}},removeKey:function removeKey(t){delete this[t];}};var et=(Object.freeze||Object)({$override:f,clone:A,merge:g,mergeAll:p,extend:k,defaults:C,createCanvas:y,getContext:x,indexOf:L,inherits:_,mixin:w,isArrayLike:O,each:z,map:P,reduce:b,filter:T,find:function find(t,e,i){if(t&&e)for(var n=0,a=t.length;n<a;n++){if(e.call(i,t[n],n,t))return t[n];}},bind:S,curry:N,isArray:E,isFunction:M,isString:D,isObject:R,isBuiltInObject:I,isTypedArray:B,isDom:V,eqNaN:G,retrieve:W,retrieve2:F,retrieve3:H,slice:Z,normalizeCssArray:U,assert:j,trim:X,setAsPrimitive:q,isPrimitive:K,createHashMap:J,concatArray:Q,noop:tt}),it="undefined"==typeof Float32Array?Array:Float32Array;function nt(t,e){var i=new it(2);return null==t&&(t=0),null==e&&(e=0),i[0]=t,i[1]=e,i;}function at(t,e){return t[0]=e[0],t[1]=e[1],t;}function ot(t){var e=new it(2);return e[0]=t[0],e[1]=t[1],e;}function rt(t,e,i){return t[0]=e,t[1]=i,t;}function st(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t;}function lt(t,e,i,n){return t[0]=e[0]+i[0]*n,t[1]=e[1]+i[1]*n,t;}function ht(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t;}function ut(t){return Math.sqrt(dt(t));}var ct=ut;function dt(t){return t[0]*t[0]+t[1]*t[1];}var ft=dt;function pt(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t;}function gt(t,e){var i=ut(e);return 0===i?(t[0]=0,t[1]=0):(t[0]=e[0]/i,t[1]=e[1]/i),t;}function mt(t,e){return Math.sqrt((t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1]));}var vt=mt;function yt(t,e){return(t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1]);}var xt=yt;function _t(t,e,i,n){return t[0]=e[0]+n*(i[0]-e[0]),t[1]=e[1]+n*(i[1]-e[1]),t;}function wt(t,e,i){var n=e[0],a=e[1];return t[0]=i[0]*n+i[2]*a+i[4],t[1]=i[1]*n+i[3]*a+i[5],t;}function bt(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t;}function St(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t;}var Mt=(Object.freeze||Object)({create:nt,copy:at,clone:ot,set:rt,add:st,scaleAndAdd:lt,sub:ht,len:ut,length:ct,lenSquare:dt,lengthSquare:ft,mul:function mul(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t;},div:function div(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t;},dot:function dot(t,e){return t[0]*e[0]+t[1]*e[1];},scale:pt,normalize:gt,distance:mt,dist:vt,distanceSquare:yt,distSquare:xt,negate:function negate(t,e){return t[0]=-e[0],t[1]=-e[1],t;},lerp:_t,applyTransform:wt,min:bt,max:St});function It(){this.on("mousedown",this._dragStart,this),this.on("mousemove",this._drag,this),this.on("mouseup",this._dragEnd,this),this.on("globalout",this._dragEnd,this);}function Tt(t,e){return{target:t,topTarget:e&&e.topTarget};}It.prototype={constructor:It,_dragStart:function _dragStart(t){var e=t.target;e&&e.draggable&&((this._draggingTarget=e).dragging=!0,this._x=t.offsetX,this._y=t.offsetY,this.dispatchToElement(Tt(e,t),"dragstart",t.event));},_drag:function _drag(t){var e=this._draggingTarget;if(e){var i=t.offsetX,n=t.offsetY,a=i-this._x,o=n-this._y;this._x=i,this._y=n,e.drift(a,o,t),this.dispatchToElement(Tt(e,t),"drag",t.event);var r=this.findHover(i,n,e).target,s=this._dropTarget;e!==(this._dropTarget=r)&&(s&&r!==s&&this.dispatchToElement(Tt(s,t),"dragleave",t.event),r&&r!==s&&this.dispatchToElement(Tt(r,t),"dragenter",t.event));}},_dragEnd:function _dragEnd(t){var e=this._draggingTarget;e&&(e.dragging=!1),this.dispatchToElement(Tt(e,t),"dragend",t.event),this._dropTarget&&this.dispatchToElement(Tt(this._dropTarget,t),"drop",t.event),this._draggingTarget=null,this._dropTarget=null;}};var Dt=Array.prototype.slice,At=function At(){this._$handlers={};};At.prototype={constructor:At,one:function one(t,e,i){var n=this._$handlers;if(!e||!t)return this;n[t]||(n[t]=[]);for(var a=0;a<n[t].length;a++){if(n[t][a].h===e)return this;}return n[t].push({h:e,one:!0,ctx:i||this}),this;},on:function on(t,e,i){var n=this._$handlers;if(!e||!t)return this;n[t]||(n[t]=[]);for(var a=0;a<n[t].length;a++){if(n[t][a].h===e)return this;}return n[t].push({h:e,one:!1,ctx:i||this}),this;},isSilent:function isSilent(t){var e=this._$handlers;return e[t]&&e[t].length;},off:function off(t,e){var i=this._$handlers;if(!t)return this._$handlers={},this;if(e){if(i[t]){for(var n=[],a=0,o=i[t].length;a<o;a++){i[t][a].h!=e&&n.push(i[t][a]);}i[t]=n;}i[t]&&0===i[t].length&&delete i[t];}else delete i[t];return this;},trigger:function trigger(t){if(this._$handlers[t]){var e=arguments,i=e.length;3<i&&(e=Dt.call(e,1));for(var n=this._$handlers[t],a=n.length,o=0;o<a;){switch(i){case 1:n[o].h.call(n[o].ctx);break;case 2:n[o].h.call(n[o].ctx,e[1]);break;case 3:n[o].h.call(n[o].ctx,e[1],e[2]);break;default:n[o].h.apply(n[o].ctx,e);}n[o].one?(n.splice(o,1),a--):o++;}}return this;},triggerWithContext:function triggerWithContext(t){if(this._$handlers[t]){var e=arguments,i=e.length;4<i&&(e=Dt.call(e,1,e.length-1));for(var n=e[e.length-1],a=this._$handlers[t],o=a.length,r=0;r<o;){switch(i){case 1:a[r].h.call(n);break;case 2:a[r].h.call(n,e[1]);break;case 3:a[r].h.call(n,e[1],e[2]);break;default:a[r].h.apply(n,e);}a[r].one?(a.splice(r,1),o--):r++;}}return this;}};var Ct="silent";function Lt(){}Lt.prototype.dispose=function(){};var kt=["click","dblclick","mousewheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],Pt=function Pt(t,e,i,n){At.call(this),this.storage=t,this.painter=e,this.painterRoot=n,i=i||new Lt(),this.proxy=null,this._hovered={},this._lastTouchMoment,this._lastX,this._lastY,It.call(this),this.setHandlerProxy(i);};function Nt(t,e,i){if(t[t.rectHover?"rectContain":"contain"](e,i)){for(var n,a=t;a;){if(a.clipPath&&!a.clipPath.contain(e,i))return!1;a.silent&&(n=!0),a=a.parent;}return!n||Ct;}return!1;}Pt.prototype={constructor:Pt,setHandlerProxy:function setHandlerProxy(e){this.proxy&&this.proxy.dispose(),e&&(z(kt,function(t){e.on&&e.on(t,this[t],this);},this),e.handler=this),this.proxy=e;},mousemove:function mousemove(t){var e=t.zrX,i=t.zrY,n=this._hovered,a=n.target;a&&!a.__zr&&(a=(n=this.findHover(n.x,n.y)).target);var o=this._hovered=this.findHover(e,i),r=o.target,s=this.proxy;s.setCursor&&s.setCursor(r?r.cursor:"default"),a&&r!==a&&this.dispatchToElement(n,"mouseout",t),this.dispatchToElement(o,"mousemove",t),r&&r!==a&&this.dispatchToElement(o,"mouseover",t);},mouseout:function mouseout(t){this.dispatchToElement(this._hovered,"mouseout",t);for(var e,i=t.toElement||t.relatedTarget;(i=i&&i.parentNode)&&9!=i.nodeType&&!(e=i===this.painterRoot);){}!e&&this.trigger("globalout",{event:t});},resize:function resize(t){this._hovered={};},dispatch:function dispatch(t,e){var i=this[t];i&&i.call(this,e);},dispose:function dispose(){this.proxy.dispose(),this.storage=this.proxy=this.painter=null;},setCursorStyle:function setCursorStyle(t){var e=this.proxy;e.setCursor&&e.setCursor(t);},dispatchToElement:function dispatchToElement(t,e,i){var n=(t=t||{}).target;if(!n||!n.silent){for(var a,o,r="on"+e,s={type:e,event:o=i,target:(a=t).target,topTarget:a.topTarget,cancelBubble:!1,offsetX:o.zrX,offsetY:o.zrY,gestureEvent:o.gestureEvent,pinchX:o.pinchX,pinchY:o.pinchY,pinchScale:o.pinchScale,wheelDelta:o.zrDelta,zrByTouch:o.zrByTouch,which:o.which};n&&(n[r]&&(s.cancelBubble=n[r].call(n,s)),n.trigger(e,s),n=n.parent,!s.cancelBubble);){}s.cancelBubble||(this.trigger(e,s),this.painter&&this.painter.eachOtherLayer(function(t){"function"==typeof t[r]&&t[r].call(t,s),t.trigger&&t.trigger(e,s);}));}},findHover:function findHover(t,e,i){for(var n=this.storage.getDisplayList(),a={x:t,y:e},o=n.length-1;0<=o;o--){var r;if(n[o]!==i&&!n[o].ignore&&(r=Nt(n[o],t,e))&&(!a.topTarget&&(a.topTarget=n[o]),r!==Ct)){a.target=n[o];break;}}return a;}},z(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(n){Pt.prototype[n]=function(t){var e=this.findHover(t.zrX,t.zrY),i=e.target;if("mousedown"===n)this._downEl=i,this._downPoint=[t.zrX,t.zrY],this._upEl=i;else if("mouseup"===n)this._upEl=i;else if("click"===n){if(this._downEl!==this._upEl||!this._downPoint||4<vt(this._downPoint,[t.zrX,t.zrY]))return;this._downPoint=null;}this.dispatchToElement(e,n,t);};}),w(Pt,At),w(Pt,It);var Ot="undefined"==typeof Float32Array?Array:Float32Array;function Et(){var t=new Ot(6);return Rt(t),t;}function Rt(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t;}function zt(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t;}function Bt(t,e,i){var n=e[0]*i[0]+e[2]*i[1],a=e[1]*i[0]+e[3]*i[1],o=e[0]*i[2]+e[2]*i[3],r=e[1]*i[2]+e[3]*i[3],s=e[0]*i[4]+e[2]*i[5]+e[4],l=e[1]*i[4]+e[3]*i[5]+e[5];return t[0]=n,t[1]=a,t[2]=o,t[3]=r,t[4]=s,t[5]=l,t;}function Vt(t,e,i){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4]+i[0],t[5]=e[5]+i[1],t;}function Gt(t,e,i){var n=e[0],a=e[2],o=e[4],r=e[1],s=e[3],l=e[5],h=Math.sin(i),u=Math.cos(i);return t[0]=n*u+r*h,t[1]=-n*h+r*u,t[2]=a*u+s*h,t[3]=-a*h+u*s,t[4]=u*o+h*l,t[5]=u*l-h*o,t;}function Wt(t,e,i){var n=i[0],a=i[1];return t[0]=e[0]*n,t[1]=e[1]*a,t[2]=e[2]*n,t[3]=e[3]*a,t[4]=e[4]*n,t[5]=e[5]*a,t;}function Ft(t,e){var i=e[0],n=e[2],a=e[4],o=e[1],r=e[3],s=e[5],l=i*r-o*n;return l?(l=1/l,t[0]=r*l,t[1]=-o*l,t[2]=-n*l,t[3]=i*l,t[4]=(n*s-r*a)*l,t[5]=(o*a-i*s)*l,t):null;}function Ht(t){var e=Et();return zt(e,t),e;}var Zt=(Object.freeze||Object)({create:Et,identity:Rt,copy:zt,mul:Bt,translate:Vt,rotate:Gt,scale:Wt,invert:Ft,clone:Ht}),Ut=Rt,jt=5e-5;function Xt(t){return jt<t||t<-jt;}var Yt=function Yt(t){(t=t||{}).position||(this.position=[0,0]),null==t.rotation&&(this.rotation=0),t.scale||(this.scale=[1,1]),this.origin=this.origin||null;},qt=Yt.prototype;qt.transform=null,qt.needLocalTransform=function(){return Xt(this.rotation)||Xt(this.position[0])||Xt(this.position[1])||Xt(this.scale[0]-1)||Xt(this.scale[1]-1);},qt.updateTransform=function(){var t=this.parent,e=t&&t.transform,i=this.needLocalTransform(),n=this.transform;i||e?(n=n||Et(),i?this.getLocalTransform(n):Ut(n),e&&(i?Bt(n,t.transform,n):zt(n,t.transform)),this.transform=n,this.invTransform=this.invTransform||Et(),Ft(this.invTransform,n)):n&&Ut(n);},qt.getLocalTransform=function(t){return Yt.getLocalTransform(this,t);},qt.setTransform=function(t){var e=this.transform,i=t.dpr||1;e?t.setTransform(i*e[0],i*e[1],i*e[2],i*e[3],i*e[4],i*e[5]):t.setTransform(i,0,0,i,0,0);},qt.restoreTransform=function(t){var e=t.dpr||1;t.setTransform(e,0,0,e,0,0);};var Kt=[];qt.decomposeTransform=function(){if(this.transform){var t=this.parent,e=this.transform;t&&t.transform&&(Bt(Kt,t.invTransform,e),e=Kt);var i=e[0]*e[0]+e[1]*e[1],n=e[2]*e[2]+e[3]*e[3],a=this.position,o=this.scale;Xt(i-1)&&(i=Math.sqrt(i)),Xt(n-1)&&(n=Math.sqrt(n)),e[0]<0&&(i=-i),e[3]<0&&(n=-n),a[0]=e[4],a[1]=e[5],o[0]=i,o[1]=n,this.rotation=Math.atan2(-e[1]/n,e[0]/i);}},qt.getGlobalScale=function(){var t=this.transform;if(!t)return[1,1];var e=Math.sqrt(t[0]*t[0]+t[1]*t[1]),i=Math.sqrt(t[2]*t[2]+t[3]*t[3]);return t[0]<0&&(e=-e),t[3]<0&&(i=-i),[e,i];},qt.transformCoordToLocal=function(t,e){var i=[t,e],n=this.invTransform;return n&&wt(i,i,n),i;},qt.transformCoordToGlobal=function(t,e){var i=[t,e],n=this.transform;return n&&wt(i,i,n),i;},Yt.getLocalTransform=function(t,e){Ut(e=e||[]);var i=t.origin,n=t.scale||[1,1],a=t.rotation||0,o=t.position||[0,0];return i&&(e[4]-=i[0],e[5]-=i[1]),Wt(e,e,n),a&&Gt(e,e,a),i&&(e[4]+=i[0],e[5]+=i[1]),e[4]+=o[0],e[5]+=o[1],e;};var $t={linear:function linear(t){return t;},quadraticIn:function quadraticIn(t){return t*t;},quadraticOut:function quadraticOut(t){return t*(2-t);},quadraticInOut:function quadraticInOut(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1);},cubicIn:function cubicIn(t){return t*t*t;},cubicOut:function cubicOut(t){return--t*t*t+1;},cubicInOut:function cubicInOut(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2);},quarticIn:function quarticIn(t){return t*t*t*t;},quarticOut:function quarticOut(t){return 1- --t*t*t*t;},quarticInOut:function quarticInOut(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2);},quinticIn:function quinticIn(t){return t*t*t*t*t;},quinticOut:function quinticOut(t){return--t*t*t*t*t+1;},quinticInOut:function quinticInOut(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2);},sinusoidalIn:function sinusoidalIn(t){return 1-Math.cos(t*Math.PI/2);},sinusoidalOut:function sinusoidalOut(t){return Math.sin(t*Math.PI/2);},sinusoidalInOut:function sinusoidalInOut(t){return .5*(1-Math.cos(Math.PI*t));},exponentialIn:function exponentialIn(t){return 0===t?0:Math.pow(1024,t-1);},exponentialOut:function exponentialOut(t){return 1===t?1:1-Math.pow(2,-10*t);},exponentialInOut:function exponentialInOut(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(2-Math.pow(2,-10*(t-1)));},circularIn:function circularIn(t){return 1-Math.sqrt(1-t*t);},circularOut:function circularOut(t){return Math.sqrt(1- --t*t);},circularInOut:function circularInOut(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1);},elasticIn:function elasticIn(t){var e,i=.1;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=.1):e=.4*Math.asin(1/i)/(2*Math.PI),-i*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4));},elasticOut:function elasticOut(t){var e,i=.1;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=.1):e=.4*Math.asin(1/i)/(2*Math.PI),i*Math.pow(2,-10*t)*Math.sin((t-e)*(2*Math.PI)/.4)+1);},elasticInOut:function elasticInOut(t){var e,i=.1;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=.1):e=.4*Math.asin(1/i)/(2*Math.PI),(t*=2)<1?i*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4)*-.5:i*Math.pow(2,-10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4)*.5+1);},backIn:function backIn(t){return t*t*(2.70158*t-1.70158);},backOut:function backOut(t){return--t*t*(2.70158*t+1.70158)+1;},backInOut:function backInOut(t){var e=2.5949095;return(t*=2)<1?t*t*((e+1)*t-e)*.5:.5*((t-=2)*t*((e+1)*t+e)+2);},bounceIn:function bounceIn(t){return 1-$t.bounceOut(1-t);},bounceOut:function bounceOut(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375;},bounceInOut:function bounceInOut(t){return t<.5?.5*$t.bounceIn(2*t):.5*$t.bounceOut(2*t-1)+.5;}};function Jt(t){this._target=t.target,this._life=t.life||1e3,this._delay=t.delay||0,this._initialized=!1,this.loop=null!=t.loop&&t.loop,this.gap=t.gap||0,this.easing=t.easing||"Linear",this.onframe=t.onframe,this.ondestroy=t.ondestroy,this.onrestart=t.onrestart,this._pausedTime=0,this._paused=!1;}Jt.prototype={constructor:Jt,step:function step(t,e){if(this._initialized||(this._startTime=t+this._delay,this._initialized=!0),this._paused)this._pausedTime+=e;else{var i=(t-this._startTime-this._pausedTime)/this._life;if(!(i<0)){i=Math.min(i,1);var n=this.easing,a="string"==typeof n?$t[n]:n,o="function"==typeof a?a(i):i;return this.fire("frame",o),1==i?this.loop?(this.restart(t),"restart"):(this._needsRemove=!0,"destroy"):null;}}},restart:function restart(t){var e=(t-this._startTime-this._pausedTime)%this._life;this._startTime=t-e+this.gap,this._pausedTime=0,this._needsRemove=!1;},fire:function fire(t,e){this[t="on"+t]&&this[t](this._target,e);},pause:function pause(){this._paused=!0;},resume:function resume(){this._paused=!1;}};var Qt=function Qt(){this.head=null,this.tail=null,this._len=0;},te=Qt.prototype;te.insert=function(t){var e=new ee(t);return this.insertEntry(e),e;},te.insertEntry=function(t){this.head?((this.tail.next=t).prev=this.tail,t.next=null,this.tail=t):this.head=this.tail=t,this._len++;},te.remove=function(t){var e=t.prev,i=t.next;e?e.next=i:this.head=i,i?i.prev=e:this.tail=e,t.next=t.prev=null,this._len--;},te.len=function(){return this._len;},te.clear=function(){this.head=this.tail=null,this._len=0;};var ee=function ee(t){this.value=t,this.next,this.prev;},ie=function ie(t){this._list=new Qt(),this._map={},this._maxSize=t||10,this._lastRemovedEntry=null;},ne=ie.prototype;ne.put=function(t,e){var i=this._list,n=this._map,a=null;if(null==n[t]){var o=i.len(),r=this._lastRemovedEntry;if(o>=this._maxSize&&0<o){var s=i.head;i.remove(s),delete n[s.key],a=s.value,this._lastRemovedEntry=s;}r?r.value=e:r=new ee(e),r.key=t,i.insertEntry(r),n[t]=r;}return a;},ne.get=function(t){var e=this._map[t],i=this._list;if(null!=e)return e!==i.tail&&(i.remove(e),i.insertEntry(e)),e.value;},ne.clear=function(){this._list.clear(),this._map={};};var ae={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};function oe(t){return(t=Math.round(t))<0?0:255<t?255:t;}function re(t){return t<0?0:1<t?1:t;}function se(t){return t.length&&"%"===t.charAt(t.length-1)?oe(parseFloat(t)/100*255):oe(parseInt(t,10));}function le(t){return t.length&&"%"===t.charAt(t.length-1)?re(parseFloat(t)/100):re(parseFloat(t));}function he(t,e,i){return i<0?i+=1:1<i&&(i-=1),6*i<1?t+(e-t)*i*6:2*i<1?e:3*i<2?t+(e-t)*(2/3-i)*6:t;}function ue(t,e,i){return t+(e-t)*i;}function ce(t,e,i,n,a){return t[0]=e,t[1]=i,t[2]=n,t[3]=a,t;}function de(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t;}var fe=new ie(20),pe=null;function ge(t,e){pe&&de(pe,e),pe=fe.put(t,pe||e.slice());}function me(t,e){if(t){e=e||[];var i=fe.get(t);if(i)return de(e,i);var n,a=(t+="").replace(/ /g,"").toLowerCase();if(a in ae)return de(e,ae[a]),ge(t,e),e;if("#"===a.charAt(0))return 4===a.length?0<=(n=parseInt(a.substr(1),16))&&n<=4095?(ce(e,(3840&n)>>4|(3840&n)>>8,240&n|(240&n)>>4,15&n|(15&n)<<4,1),ge(t,e),e):void ce(e,0,0,0,1):7===a.length?0<=(n=parseInt(a.substr(1),16))&&n<=16777215?(ce(e,(16711680&n)>>16,(65280&n)>>8,255&n,1),ge(t,e),e):void ce(e,0,0,0,1):void 0;var o=a.indexOf("("),r=a.indexOf(")");if(-1!==o&&r+1===a.length){var s=a.substr(0,o),l=a.substr(o+1,r-(o+1)).split(","),h=1;switch(s){case"rgba":if(4!==l.length)return void ce(e,0,0,0,1);h=le(l.pop());case"rgb":return 3!==l.length?void ce(e,0,0,0,1):(ce(e,se(l[0]),se(l[1]),se(l[2]),h),ge(t,e),e);case"hsla":return 4!==l.length?void ce(e,0,0,0,1):(l[3]=le(l[3]),ve(l,e),ge(t,e),e);case"hsl":return 3!==l.length?void ce(e,0,0,0,1):(ve(l,e),ge(t,e),e);default:return;}}ce(e,0,0,0,1);}}function ve(t,e){var i=(parseFloat(t[0])%360+360)%360/360,n=le(t[1]),a=le(t[2]),o=a<=.5?a*(n+1):a+n-a*n,r=2*a-o;return ce(e=e||[],oe(255*he(r,o,i+1/3)),oe(255*he(r,o,i)),oe(255*he(r,o,i-1/3)),1),4===t.length&&(e[3]=t[3]),e;}function ye(t,e){var i=me(t);if(i){for(var n=0;n<3;n++){i[n]=e<0?i[n]*(1-e)|0:(255-i[n])*e+i[n]|0,255<i[n]?i[n]=255:t[n]<0&&(i[n]=0);}return Te(i,4===i.length?"rgba":"rgb");}}function xe(t){var e=me(t);if(e)return((1<<24)+(e[0]<<16)+(e[1]<<8)+ +e[2]).toString(16).slice(1);}function _e(t,e,i){if(e&&e.length&&0<=t&&t<=1){i=i||[];var n=t*(e.length-1),a=Math.floor(n),o=Math.ceil(n),r=e[a],s=e[o],l=n-a;return i[0]=oe(ue(r[0],s[0],l)),i[1]=oe(ue(r[1],s[1],l)),i[2]=oe(ue(r[2],s[2],l)),i[3]=re(ue(r[3],s[3],l)),i;}}var we=_e;function be(t,e,i){if(e&&e.length&&0<=t&&t<=1){var n=t*(e.length-1),a=Math.floor(n),o=Math.ceil(n),r=me(e[a]),s=me(e[o]),l=n-a,h=Te([oe(ue(r[0],s[0],l)),oe(ue(r[1],s[1],l)),oe(ue(r[2],s[2],l)),re(ue(r[3],s[3],l))],"rgba");return i?{color:h,leftIndex:a,rightIndex:o,value:n}:h;}}var Se=be;function Me(t,e,i,n){if(t=me(t))return t=function(t){if(t){var e,i,n=t[0]/255,a=t[1]/255,o=t[2]/255,r=Math.min(n,a,o),s=Math.max(n,a,o),l=s-r,h=(s+r)/2;if(0===l)i=e=0;else{i=h<.5?l/(s+r):l/(2-s-r);var u=((s-n)/6+l/2)/l,c=((s-a)/6+l/2)/l,d=((s-o)/6+l/2)/l;n===s?e=d-c:a===s?e=1/3+u-d:o===s&&(e=2/3+c-u),e<0&&(e+=1),1<e&&(e-=1);}var f=[360*e,i,h];return null!=t[3]&&f.push(t[3]),f;}}(t),null!=e&&(t[0]=(a=e,(a=Math.round(a))<0?0:360<a?360:a)),null!=i&&(t[1]=le(i)),null!=n&&(t[2]=le(n)),Te(ve(t),"rgba");var a;}function Ie(t,e){if((t=me(t))&&null!=e)return t[3]=re(e),Te(t,"rgba");}function Te(t,e){if(t&&t.length){var i=t[0]+","+t[1]+","+t[2];return"rgba"!==e&&"hsva"!==e&&"hsla"!==e||(i+=","+t[3]),e+"("+i+")";}}var De=(Object.freeze||Object)({parse:me,lift:ye,toHex:xe,fastLerp:_e,fastMapToColor:we,lerp:be,mapToColor:Se,modifyHSL:Me,modifyAlpha:Ie,stringify:Te}),Ae=Array.prototype.slice;function Ce(t,e){return t[e];}function Le(t,e,i){t[e]=i;}function ke(t,e,i){return(e-t)*i+t;}function Pe(t,e,i){return .5<i?e:t;}function Ne(t,e,i,n,a){var o=t.length;if(1==a)for(var r=0;r<o;r++){n[r]=ke(t[r],e[r],i);}else{var s=o&&t[0].length;for(r=0;r<o;r++){for(var l=0;l<s;l++){n[r][l]=ke(t[r][l],e[r][l],i);}}}}function Oe(t,e,i){var n=t.length,a=e.length;if(n!==a)if(a<n)t.length=a;else for(var o=n;o<a;o++){t.push(1===i?e[o]:Ae.call(e[o]));}var r=t[0]&&t[0].length;for(o=0;o<t.length;o++){if(1===i)isNaN(t[o])&&(t[o]=e[o]);else for(var s=0;s<r;s++){isNaN(t[o][s])&&(t[o][s]=e[o][s]);}}}function Ee(t,e,i){if(t===e)return!0;var n=t.length;if(n!==e.length)return!1;if(1===i){for(var a=0;a<n;a++){if(t[a]!==e[a])return!1;}}else{var o=t[0].length;for(a=0;a<n;a++){for(var r=0;r<o;r++){if(t[a][r]!==e[a][r])return!1;}}}return!0;}function Re(t,e,i,n,a,o,r,s,l){var h=t.length;if(1==l)for(var u=0;u<h;u++){s[u]=ze(t[u],e[u],i[u],n[u],a,o,r);}else{var c=t[0].length;for(u=0;u<h;u++){for(var d=0;d<c;d++){s[u][d]=ze(t[u][d],e[u][d],i[u][d],n[u][d],a,o,r);}}}}function ze(t,e,i,n,a,o,r){var s=.5*(i-t),l=.5*(n-e);return(2*(e-i)+s+l)*r+(-3*(e-i)-2*s-l)*o+s*a+e;}function Be(t){if(O(t)){var e=t.length;if(O(t[0])){for(var i=[],n=0;n<e;n++){i.push(Ae.call(t[n]));}return i;}return Ae.call(t);}return t;}function Ve(t){return t[0]=Math.floor(t[0]),t[1]=Math.floor(t[1]),t[2]=Math.floor(t[2]),"rgba("+t.join(",")+")";}function Ge(t,e,i,n,o,a){var r=t._getter,s=t._setter,l="spline"===e,h=n.length;if(h){var u,c,d,f=O(n[0].value),p=!1,g=!1,m=f?O((c=(u=n)[u.length-1].value)&&c[0])?2:1:0;n.sort(function(t,e){return t.time-e.time;}),d=n[h-1].time;for(var v=[],y=[],x=n[0].value,_=!0,w=0;w<h;w++){v.push(n[w].time/d);var b=n[w].value;if(f&&Ee(b,x,m)||!f&&b===x||(_=!1),"string"==typeof(x=b)){var S=me(b);S?(b=S,p=!0):g=!0;}y.push(b);}if(a||!_){var M=y[h-1];for(w=0;w<h-1;w++){f?Oe(y[w],M,m):!isNaN(y[w])||isNaN(M)||g||p||(y[w]=M);}f&&Oe(r(t._target,o),M,m);var I,T,D,A,C,L=0,k=0;if(p)var P=[0,0,0,0];var N=new Jt({target:t._target,life:d,loop:t._loop,delay:t._delay,onframe:function onframe(t,e){var i;if(e<0)i=0;else if(e<k){for(i=Math.min(L+1,h-1);0<=i&&!(v[i]<=e);i--){}i=Math.min(i,h-2);}else{for(i=L;i<h&&!(v[i]>e);i++){}i=Math.min(i-1,h-2);}k=e;var n=v[(L=i)+1]-v[i];if(0!==n)if(I=(e-v[i])/n,l){if(D=y[i],T=y[0===i?i:i-1],A=y[h-2<i?h-1:i+1],C=y[h-3<i?h-1:i+2],f)Re(T,D,A,C,I,I*I,I*I*I,r(t,o),m);else{if(p)a=Re(T,D,A,C,I,I*I,I*I*I,P,1),a=Ve(P);else{if(g)return Pe(D,A,I);a=ze(T,D,A,C,I,I*I,I*I*I);}s(t,o,a);}}else if(f)Ne(y[i],y[i+1],I,r(t,o),m);else{var a;if(p)Ne(y[i],y[i+1],I,P,1),a=Ve(P);else{if(g)return Pe(y[i],y[i+1],I);a=ke(y[i],y[i+1],I);}s(t,o,a);}},ondestroy:i});return e&&"spline"!==e&&(N.easing=e),N;}}}var We=function We(t,e,i,n){this._tracks={},this._target=t,this._loop=e||!1,this._getter=i||Ce,this._setter=n||Le,this._clipCount=0,this._delay=0,this._doneList=[],this._onframeList=[],this._clipList=[];};We.prototype={when:function when(t,e){var i=this._tracks;for(var n in e){if(e.hasOwnProperty(n)){if(!i[n]){i[n]=[];var a=this._getter(this._target,n);if(null==a)continue;0!==t&&i[n].push({time:0,value:Be(a)});}i[n].push({time:t,value:e[n]});}}return this;},during:function during(t){return this._onframeList.push(t),this;},pause:function pause(){for(var t=0;t<this._clipList.length;t++){this._clipList[t].pause();}this._paused=!0;},resume:function resume(){for(var t=0;t<this._clipList.length;t++){this._clipList[t].resume();}this._paused=!1;},isPaused:function isPaused(){return!!this._paused;},_doneCallback:function _doneCallback(){this._tracks={},this._clipList.length=0;for(var t=this._doneList,e=t.length,i=0;i<e;i++){t[i].call(this);}},start:function start(t,e){var i,n=this,a=0,o=function o(){--a||n._doneCallback();};for(var r in this._tracks){if(this._tracks.hasOwnProperty(r)){var s=Ge(this,t,o,this._tracks[r],r,e);s&&(this._clipList.push(s),a++,this.animation&&this.animation.addClip(s),i=s);}}if(i){var l=i.onframe;i.onframe=function(t,e){l(t,e);for(var i=0;i<n._onframeList.length;i++){n._onframeList[i](t,e);}};}return a||this._doneCallback(),this;},stop:function stop(t){for(var e=this._clipList,i=this.animation,n=0;n<e.length;n++){var a=e[n];t&&a.onframe(this._target,1),i&&i.removeClip(a);}e.length=0;},delay:function delay(t){return this._delay=t,this;},done:function done(t){return t&&this._doneList.push(t),this;},getClips:function getClips(){return this._clipList;}};var Fe=1;"undefined"!=typeof window&&(Fe=Math.max(window.devicePixelRatio||1,1));var He=Fe,Ze=function Ze(){};var Ue=Ze,je=function je(){this.animators=[];};je.prototype={constructor:je,animate:function animate(t,e){var i,n=!1,a=this,o=this.__zr;if(t){var r=t.split("."),s=a;n="shape"===r[0];for(var l=0,h=r.length;l<h;l++){s&&(s=s[r[l]]);}s&&(i=s);}else i=a;if(i){var u=a.animators,c=new We(i,e);return c.during(function(t){a.dirty(n);}).done(function(){u.splice(L(u,c),1);}),u.push(c),o&&o.animation.addAnimator(c),c;}Ue('Property "'+t+'" is not existed in element '+a.id);},stopAnimation:function stopAnimation(t){for(var e=this.animators,i=e.length,n=0;n<i;n++){e[n].stop(t);}return e.length=0,this;},animateTo:function animateTo(t,e,i,n,a,o){D(i)?(a=n,n=i,i=0):M(n)?(a=n,n="linear",i=0):M(i)?(a=i,i=0):M(e)?(a=e,e=500):e||(e=500),this.stopAnimation(),this._animateToShallow("",this,t,e,i);var r=this.animators.slice(),s=r.length;function l(){--s||a&&a();}s||a&&a();for(var h=0;h<r.length;h++){r[h].done(l).start(n,o);}},_animateToShallow:function _animateToShallow(t,e,i,n,a){var o={},r=0;for(var s in i){if(i.hasOwnProperty(s))if(null!=e[s])R(i[s])&&!O(i[s])?this._animateToShallow(t?t+"."+s:s,e[s],i[s],n,a):(o[s]=i[s],r++);else if(null!=i[s])if(t){var l={};l[t]={},l[t][s]=i[s],this.attr(l);}else this.attr(s,i[s]);}return 0<r&&this.animate(t,!1).when(null==n?500:n,o).delay(a||0),this;}};var Xe=function Xe(t){Yt.call(this,t),At.call(this,t),je.call(this,t),this.id=t.id||n();};Xe.prototype={type:"element",name:"",__zr:null,ignore:!1,clipPath:null,isGroup:!1,drift:function drift(t,e){switch(this.draggable){case"horizontal":e=0;break;case"vertical":t=0;}var i=this.transform;i||(i=this.transform=[1,0,0,1,0,0]),i[4]+=t,i[5]+=e,this.decomposeTransform(),this.dirty(!1);},beforeUpdate:function beforeUpdate(){},afterUpdate:function afterUpdate(){},update:function update(){this.updateTransform();},traverse:function traverse(t,e){},attrKV:function attrKV(t,e){if("position"===t||"scale"===t||"origin"===t){if(e){var i=this[t];i||(i=this[t]=[]),i[0]=e[0],i[1]=e[1];}}else this[t]=e;},hide:function hide(){this.ignore=!0,this.__zr&&this.__zr.refresh();},show:function show(){this.ignore=!1,this.__zr&&this.__zr.refresh();},attr:function attr(t,e){if("string"==typeof t)this.attrKV(t,e);else if(R(t))for(var i in t){t.hasOwnProperty(i)&&this.attrKV(i,t[i]);}return this.dirty(!1),this;},setClipPath:function setClipPath(t){var e=this.__zr;e&&t.addSelfToZr(e),this.clipPath&&this.clipPath!==t&&this.removeClipPath(),(this.clipPath=t).__zr=e,(t.__clipTarget=this).dirty(!1);},removeClipPath:function removeClipPath(){var t=this.clipPath;t&&(t.__zr&&t.removeSelfFromZr(t.__zr),t.__zr=null,t.__clipTarget=null,this.clipPath=null,this.dirty(!1));},addSelfToZr:function addSelfToZr(t){this.__zr=t;var e=this.animators;if(e)for(var i=0;i<e.length;i++){t.animation.addAnimator(e[i]);}this.clipPath&&this.clipPath.addSelfToZr(t);},removeSelfFromZr:function removeSelfFromZr(t){this.__zr=null;var e=this.animators;if(e)for(var i=0;i<e.length;i++){t.animation.removeAnimator(e[i]);}this.clipPath&&this.clipPath.removeSelfFromZr(t);}},w(Xe,je),w(Xe,Yt),w(Xe,At);var Ye,qe,Ke,$e,Je=wt,Qe=Math.min,ti=Math.max;function ei(t,e,i,n){i<0&&(t+=i,i=-i),n<0&&(e+=n,n=-n),this.x=t,this.y=e,this.width=i,this.height=n;}ei.prototype={constructor:ei,union:function union(t){var e=Qe(t.x,this.x),i=Qe(t.y,this.y);this.width=ti(t.x+t.width,this.x+this.width)-e,this.height=ti(t.y+t.height,this.y+this.height)-i,this.x=e,this.y=i;},applyTransform:(Ye=[],qe=[],Ke=[],$e=[],function(t){if(t){Ye[0]=Ke[0]=this.x,Ye[1]=$e[1]=this.y,qe[0]=$e[0]=this.x+this.width,qe[1]=Ke[1]=this.y+this.height,Je(Ye,Ye,t),Je(qe,qe,t),Je(Ke,Ke,t),Je($e,$e,t),this.x=Qe(Ye[0],qe[0],Ke[0],$e[0]),this.y=Qe(Ye[1],qe[1],Ke[1],$e[1]);var e=ti(Ye[0],qe[0],Ke[0],$e[0]),i=ti(Ye[1],qe[1],Ke[1],$e[1]);this.width=e-this.x,this.height=i-this.y;}}),calculateTransform:function calculateTransform(t){var e=t.width/this.width,i=t.height/this.height,n=Et();return Vt(n,n,[-this.x,-this.y]),Wt(n,n,[e,i]),Vt(n,n,[t.x,t.y]),n;},intersect:function intersect(t){if(!t)return!1;t instanceof ei||(t=ei.create(t));var e=this,i=e.x,n=e.x+e.width,a=e.y,o=e.y+e.height,r=t.x,s=t.x+t.width,l=t.y,h=t.y+t.height;return!(n<r||s<i||o<l||h<a);},contain:function contain(t,e){var i=this;return t>=i.x&&t<=i.x+i.width&&e>=i.y&&e<=i.y+i.height;},clone:function clone(){return new ei(this.x,this.y,this.width,this.height);},copy:function copy(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height;},plain:function plain(){return{x:this.x,y:this.y,width:this.width,height:this.height};}},ei.create=function(t){return new ei(t.x,t.y,t.width,t.height);};var ii=function ii(t){for(var e in t=t||{},Xe.call(this,t),t){t.hasOwnProperty(e)&&(this[e]=t[e]);}this._children=[],this.__storage=null,this.__dirty=!0;};ii.prototype={constructor:ii,isGroup:!0,type:"group",silent:!1,children:function children(){return this._children.slice();},childAt:function childAt(t){return this._children[t];},childOfName:function childOfName(t){for(var e=this._children,i=0;i<e.length;i++){if(e[i].name===t)return e[i];}},childCount:function childCount(){return this._children.length;},add:function add(t){return t&&t!==this&&t.parent!==this&&(this._children.push(t),this._doAdd(t)),this;},addBefore:function addBefore(t,e){if(t&&t!==this&&t.parent!==this&&e&&e.parent===this){var i=this._children,n=i.indexOf(e);0<=n&&(i.splice(n,0,t),this._doAdd(t));}return this;},_doAdd:function _doAdd(t){t.parent&&t.parent.remove(t);var e=(t.parent=this).__storage,i=this.__zr;e&&e!==t.__storage&&(e.addToStorage(t),t instanceof ii&&t.addChildrenToStorage(e)),i&&i.refresh();},remove:function remove(t){var e=this.__zr,i=this.__storage,n=this._children,a=L(n,t);return a<0||(n.splice(a,1),t.parent=null,i&&(i.delFromStorage(t),t instanceof ii&&t.delChildrenFromStorage(i)),e&&e.refresh()),this;},removeAll:function removeAll(){var t,e,i=this._children,n=this.__storage;for(e=0;e<i.length;e++){t=i[e],n&&(n.delFromStorage(t),t instanceof ii&&t.delChildrenFromStorage(n)),t.parent=null;}return i.length=0,this;},eachChild:function eachChild(t,e){for(var i=this._children,n=0;n<i.length;n++){var a=i[n];t.call(e,a,n);}return this;},traverse:function traverse(t,e){for(var i=0;i<this._children.length;i++){var n=this._children[i];t.call(e,n),"group"===n.type&&n.traverse(t,e);}return this;},addChildrenToStorage:function addChildrenToStorage(t){for(var e=0;e<this._children.length;e++){var i=this._children[e];t.addToStorage(i),i instanceof ii&&i.addChildrenToStorage(t);}},delChildrenFromStorage:function delChildrenFromStorage(t){for(var e=0;e<this._children.length;e++){var i=this._children[e];t.delFromStorage(i),i instanceof ii&&i.delChildrenFromStorage(t);}},dirty:function dirty(){return this.__dirty=!0,this.__zr&&this.__zr.refresh(),this;},getBoundingRect:function getBoundingRect(t){for(var e=null,i=new ei(0,0,0,0),n=t||this._children,a=[],o=0;o<n.length;o++){var r=n[o];if(!r.ignore&&!r.invisible){var s=r.getBoundingRect(),l=r.getLocalTransform(a);l?(i.copy(s),i.applyTransform(l),(e=e||i.clone()).union(i)):(e=e||s.clone()).union(s);}}return e||i;}},_(ii,Xe);var ni=32,ai=7;function oi(t,e,i,n){var a=e+1;if(a===i)return 1;if(n(t[a++],t[e])<0){for(;a<i&&n(t[a],t[a-1])<0;){a++;}!function(t,e,i){i--;for(;e<i;){var n=t[e];t[e++]=t[i],t[i--]=n;}}(t,e,a);}else for(;a<i&&0<=n(t[a],t[a-1]);){a++;}return a-e;}function ri(t,e,i,n,a){for(n===e&&n++;n<i;n++){for(var o,r=t[n],s=e,l=n;s<l;){a(r,t[o=s+l>>>1])<0?l=o:s=o+1;}var h=n-s;switch(h){case 3:t[s+3]=t[s+2];case 2:t[s+2]=t[s+1];case 1:t[s+1]=t[s];break;default:for(;0<h;){t[s+h]=t[s+h-1],h--;}}t[s]=r;}}function si(t,e,i,n,a,o){var r=0,s=0,l=1;if(0<o(t,e[i+a])){for(s=n-a;l<s&&0<o(t,e[i+a+l]);){(l=1+((r=l)<<1))<=0&&(l=s);}s<l&&(l=s),r+=a,l+=a;}else{for(s=a+1;l<s&&o(t,e[i+a-l])<=0;){(l=1+((r=l)<<1))<=0&&(l=s);}s<l&&(l=s);var h=r;r=a-l,l=a-h;}for(r++;r<l;){var u=r+(l-r>>>1);0<o(t,e[i+u])?r=u+1:l=u;}return l;}function li(t,e,i,n,a,o){var r=0,s=0,l=1;if(o(t,e[i+a])<0){for(s=a+1;l<s&&o(t,e[i+a-l])<0;){(l=1+((r=l)<<1))<=0&&(l=s);}s<l&&(l=s);var h=r;r=a-l,l=a-h;}else{for(s=n-a;l<s&&0<=o(t,e[i+a+l]);){(l=1+((r=l)<<1))<=0&&(l=s);}s<l&&(l=s),r+=a,l+=a;}for(r++;r<l;){var u=r+(l-r>>>1);o(t,e[i+u])<0?l=u:r=u+1;}return l;}function hi(p,g){var r,s,m=ai,l=0,v=[];function e(t){var e=r[t],i=s[t],n=r[t+1],a=s[t+1];s[t]=i+a,t===l-3&&(r[t+1]=r[t+2],s[t+1]=s[t+2]),l--;var o=li(p[n],p,e,i,0,g);e+=o,0!==(i-=o)&&0!==(a=si(p[e+i-1],p,n,a,a-1,g))&&(i<=a?function(t,e,i,n){var a=0;for(a=0;a<e;a++){v[a]=p[t+a];}var o=0,r=i,s=t;if(p[s++]=p[r++],0==--n){for(a=0;a<e;a++){p[s+a]=v[o+a];}return;}if(1===e){for(a=0;a<n;a++){p[s+a]=p[r+a];}return p[s+n]=v[o];}var l,h,u,c=m;for(;;){h=l=0,u=!1;do{if(g(p[r],v[o])<0){if(p[s++]=p[r++],h++,(l=0)==--n){u=!0;break;}}else if(p[s++]=v[o++],l++,h=0,1==--e){u=!0;break;}}while((l|h)<c);if(u)break;do{if(0!==(l=li(p[r],v,o,e,0,g))){for(a=0;a<l;a++){p[s+a]=v[o+a];}if(s+=l,o+=l,(e-=l)<=1){u=!0;break;}}if(p[s++]=p[r++],0==--n){u=!0;break;}if(0!==(h=si(v[o],p,r,n,0,g))){for(a=0;a<h;a++){p[s+a]=p[r+a];}if(s+=h,r+=h,0===(n-=h)){u=!0;break;}}if(p[s++]=v[o++],1==--e){u=!0;break;}c--;}while(ai<=l||ai<=h);if(u)break;c<0&&(c=0),c+=2;}if((m=c)<1&&(m=1),1===e){for(a=0;a<n;a++){p[s+a]=p[r+a];}p[s+n]=v[o];}else{if(0===e)throw new Error();for(a=0;a<e;a++){p[s+a]=v[o+a];}}}(e,i,n,a):function(t,e,i,n){var a=0;for(a=0;a<n;a++){v[a]=p[i+a];}var o=t+e-1,r=n-1,s=i+n-1,l=0,h=0;if(p[s--]=p[o--],0==--e){for(l=s-(n-1),a=0;a<n;a++){p[l+a]=v[a];}return;}if(1===n){for(h=(s-=e)+1,l=(o-=e)+1,a=e-1;0<=a;a--){p[h+a]=p[l+a];}return p[s]=v[r];}var u=m;for(;;){var c=0,d=0,f=!1;do{if(g(v[r],p[o])<0){if(p[s--]=p[o--],c++,(d=0)==--e){f=!0;break;}}else if(p[s--]=v[r--],d++,c=0,1==--n){f=!0;break;}}while((c|d)<u);if(f)break;do{if(0!==(c=e-li(v[r],p,t,e,e-1,g))){for(e-=c,h=(s-=c)+1,l=(o-=c)+1,a=c-1;0<=a;a--){p[h+a]=p[l+a];}if(0===e){f=!0;break;}}if(p[s--]=v[r--],1==--n){f=!0;break;}if(0!==(d=n-si(p[o],v,0,n,n-1,g))){for(n-=d,h=(s-=d)+1,l=(r-=d)+1,a=0;a<d;a++){p[h+a]=v[l+a];}if(n<=1){f=!0;break;}}if(p[s--]=p[o--],0==--e){f=!0;break;}u--;}while(ai<=c||ai<=d);if(f)break;u<0&&(u=0),u+=2;}(m=u)<1&&(m=1);if(1===n){for(h=(s-=e)+1,l=(o-=e)+1,a=e-1;0<=a;a--){p[h+a]=p[l+a];}p[s]=v[r];}else{if(0===n)throw new Error();for(l=s-(n-1),a=0;a<n;a++){p[l+a]=v[a];}}}(e,i,n,a));}r=[],s=[],this.mergeRuns=function(){for(;1<l;){var t=l-2;if(1<=t&&s[t-1]<=s[t]+s[t+1]||2<=t&&s[t-2]<=s[t]+s[t-1])s[t-1]<s[t+1]&&t--;else if(s[t]>s[t+1])break;e(t);}},this.forceMergeRuns=function(){for(;1<l;){var t=l-2;0<t&&s[t-1]<s[t+1]&&t--,e(t);}},this.pushRun=function(t,e){r[l]=t,s[l]=e,l+=1;};}function ui(t,e,i,n){i||(i=0),n||(n=t.length);var a=n-i;if(!(a<2)){var o=0;if(a<ni)ri(t,i,n,i+(o=oi(t,i,n,e)),e);else{var r=new hi(t,e),s=function(t){for(var e=0;ni<=t;){e|=1&t,t>>=1;}return t+e;}(a);do{if((o=oi(t,i,n,e))<s){var l=a;s<l&&(l=s),ri(t,i,i+l,i+o,e),o=l;}r.pushRun(i,o),r.mergeRuns(),a-=o,i+=o;}while(0!==a);r.forceMergeRuns();}}}function ci(t,e){return t.zlevel===e.zlevel?t.z===e.z?t.z2-e.z2:t.z-e.z:t.zlevel-e.zlevel;}var di=function di(){this._roots=[],this._displayList=[],this._displayListLen=0;};di.prototype={constructor:di,traverse:function traverse(t,e){for(var i=0;i<this._roots.length;i++){this._roots[i].traverse(t,e);}},getDisplayList:function getDisplayList(t,e){return e=e||!1,t&&this.updateDisplayList(e),this._displayList;},updateDisplayList:function updateDisplayList(t){this._displayListLen=0;for(var e=this._roots,i=this._displayList,n=0,a=e.length;n<a;n++){this._updateAndAddDisplayable(e[n],null,t);}i.length=this._displayListLen,v.canvasSupported&&ui(i,ci);},_updateAndAddDisplayable:function _updateAndAddDisplayable(t,e,i){if(!t.ignore||i){t.beforeUpdate(),t.__dirty&&t.update(),t.afterUpdate();var n=t.clipPath;if(n){e=e?e.slice():[];for(var a=n,o=t;a;){a.parent=o,a.updateTransform(),e.push(a),a=(o=a).clipPath;}}if(t.isGroup){for(var r=t._children,s=0;s<r.length;s++){var l=r[s];t.__dirty&&(l.__dirty=!0),this._updateAndAddDisplayable(l,e,i);}t.__dirty=!1;}else t.__clipPaths=e,this._displayList[this._displayListLen++]=t;}},addRoot:function addRoot(t){t.__storage!==this&&(t instanceof ii&&t.addChildrenToStorage(this),this.addToStorage(t),this._roots.push(t));},delRoot:function delRoot(t){if(null==t){for(var e=0;e<this._roots.length;e++){var i=this._roots[e];i instanceof ii&&i.delChildrenFromStorage(this);}return this._roots=[],this._displayList=[],void(this._displayListLen=0);}if(t instanceof Array){e=0;for(var n=t.length;e<n;e++){this.delRoot(t[e]);}}else{var a=L(this._roots,t);0<=a&&(this.delFromStorage(t),this._roots.splice(a,1),t instanceof ii&&t.delChildrenFromStorage(this));}},addToStorage:function addToStorage(t){return t&&(t.__storage=this,t.dirty(!1)),this;},delFromStorage:function delFromStorage(t){return t&&(t.__storage=null),this;},dispose:function dispose(){this._renderList=this._roots=null;},displayableSortFunc:ci};var fi={shadowBlur:1,shadowOffsetX:1,shadowOffsetY:1,textShadowBlur:1,textShadowOffsetX:1,textShadowOffsetY:1,textBoxShadowBlur:1,textBoxShadowOffsetX:1,textBoxShadowOffsetY:1},pi=function pi(t,e,i){return fi.hasOwnProperty(e)?i*t.dpr:i;},gi=[["shadowBlur",0],["shadowOffsetX",0],["shadowOffsetY",0],["shadowColor","#000"],["lineCap","butt"],["lineJoin","miter"],["miterLimit",10]],mi=function mi(t,e){this.extendFrom(t,!1),this.host=e;};function vi(t,e,i){var n=null==e.x?0:e.x,a=null==e.x2?1:e.x2,o=null==e.y?0:e.y,r=null==e.y2?0:e.y2;return e.global||(n=n*i.width+i.x,a=a*i.width+i.x,o=o*i.height+i.y,r=r*i.height+i.y),n=isNaN(n)?0:n,a=isNaN(a)?1:a,o=isNaN(o)?0:o,r=isNaN(r)?0:r,t.createLinearGradient(n,o,a,r);}function yi(t,e,i){var n=i.width,a=i.height,o=Math.min(n,a),r=null==e.x?.5:e.x,s=null==e.y?.5:e.y,l=null==e.r?.5:e.r;return e.global||(r=r*n+i.x,s=s*a+i.y,l*=o),t.createRadialGradient(r,s,0,r,s,l);}mi.prototype={constructor:mi,host:null,fill:"#000",stroke:null,opacity:1,lineDash:null,lineDashOffset:0,shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,lineWidth:1,strokeNoScale:!1,text:null,font:null,textFont:null,fontStyle:null,fontWeight:null,fontSize:null,fontFamily:null,textTag:null,textFill:"#000",textStroke:null,textWidth:null,textHeight:null,textStrokeWidth:0,textLineHeight:null,textPosition:"inside",textRect:null,textOffset:null,textAlign:null,textVerticalAlign:null,textDistance:5,textShadowColor:"transparent",textShadowBlur:0,textShadowOffsetX:0,textShadowOffsetY:0,textBoxShadowColor:"transparent",textBoxShadowBlur:0,textBoxShadowOffsetX:0,textBoxShadowOffsetY:0,transformText:!1,textRotation:0,textOrigin:null,textBackgroundColor:null,textBorderColor:null,textBorderWidth:0,textBorderRadius:0,textPadding:null,rich:null,truncate:null,blend:null,bind:function bind(t,e,i){for(var n=this,a=i&&i.style,o=!a,r=0;r<gi.length;r++){var s=gi[r],l=s[0];(o||n[l]!==a[l])&&(t[l]=pi(t,l,n[l]||s[1]));}if((o||n.fill!==a.fill)&&(t.fillStyle=n.fill),(o||n.stroke!==a.stroke)&&(t.strokeStyle=n.stroke),(o||n.opacity!==a.opacity)&&(t.globalAlpha=null==n.opacity?1:n.opacity),(o||n.blend!==a.blend)&&(t.globalCompositeOperation=n.blend||"source-over"),this.hasStroke()){var h=n.lineWidth;t.lineWidth=h/(this.strokeNoScale&&e&&e.getLineScale?e.getLineScale():1);}},hasFill:function hasFill(){var t=this.fill;return null!=t&&"none"!==t;},hasStroke:function hasStroke(){var t=this.stroke;return null!=t&&"none"!==t&&0<this.lineWidth;},extendFrom:function extendFrom(t,e){if(t)for(var i in t){!t.hasOwnProperty(i)||!0!==e&&(!1===e?this.hasOwnProperty(i):null==t[i])||(this[i]=t[i]);}},set:function set(t,e){"string"==typeof t?this[t]=e:this.extendFrom(t,!0);},clone:function clone(){var t=new this.constructor();return t.extendFrom(this,!0),t;},getGradient:function getGradient(t,e,i){for(var n=("radial"===e.type?yi:vi)(t,e,i),a=e.colorStops,o=0;o<a.length;o++){n.addColorStop(a[o].offset,a[o].color);}return n;}};for(var xi=mi.prototype,_i=0;_i<gi.length;_i++){var wi=gi[_i];wi[0]in xi||(xi[wi[0]]=wi[1]);}mi.getGradient=xi.getGradient;var bi=function bi(t,e){this.image=t,this.repeat=e,this.type="pattern";};function Si(){return!1;}function Mi(t,e,i){var n=y(),a=e.getWidth(),o=e.getHeight(),r=n.style;return r&&(r.position="absolute",r.left=0,r.top=0,r.width=a+"px",r.height=o+"px",n.setAttribute("data-zr-dom-id",t)),n.width=a*i,n.height=o*i,n;}var Ii=function Ii(t,e,i){var n;i=i||He,"string"==typeof t?n=Mi(t,e,i):R(t)&&(t=(n=t).id),this.id=t;var a=(this.dom=n).style;a&&(n.onselectstart=Si,a["-webkit-user-select"]="none",a["user-select"]="none",a["-webkit-touch-callout"]="none",a["-webkit-tap-highlight-color"]="rgba(0,0,0,0)",a.padding=0,a.margin=0,a["border-width"]=0),this.domBack=null,this.ctxBack=null,this.painter=e,this.config=null,this.clearColor=0,this.motionBlur=!1,this.lastFrameAlpha=.7,this.dpr=i;};Ii.prototype={constructor:Ii,__dirty:!0,__used:!(bi.prototype.getCanvasPattern=function(t){return t.createPattern(this.image,this.repeat||"repeat");}),__drawIndex:0,__startIndex:0,__endIndex:0,incremental:!1,getElementCount:function getElementCount(){return this.__endIndex-this.__startIndex;},initContext:function initContext(){this.ctx=this.dom.getContext("2d"),this.ctx.dpr=this.dpr;},createBackBuffer:function createBackBuffer(){var t=this.dpr;this.domBack=Mi("back-"+this.id,this.painter,t),this.ctxBack=this.domBack.getContext("2d"),1!=t&&this.ctxBack.scale(t,t);},resize:function resize(t,e){var i=this.dpr,n=this.dom,a=n.style,o=this.domBack;a&&(a.width=t+"px",a.height=e+"px"),n.width=t*i,n.height=e*i,o&&(o.width=t*i,o.height=e*i,1!=i&&this.ctxBack.scale(i,i));},clear:function clear(t,e){var i,n=this.dom,a=this.ctx,o=n.width,r=n.height,s=(e=e||this.clearColor,this.motionBlur&&!t),l=this.lastFrameAlpha,h=this.dpr;(s&&(this.domBack||this.createBackBuffer(),this.ctxBack.globalCompositeOperation="copy",this.ctxBack.drawImage(n,0,0,o/h,r/h)),a.clearRect(0,0,o,r),e&&"transparent"!==e)&&(e.colorStops?(i=e.__canvasGradient||mi.getGradient(a,e,{x:0,y:0,width:o,height:r}),e.__canvasGradient=i):e.image&&(i=bi.prototype.getCanvasPattern.call(e,a)),a.save(),a.fillStyle=i||e,a.fillRect(0,0,o,r),a.restore());if(s){var u=this.domBack;a.save(),a.globalAlpha=l,a.drawImage(u,0,0,o,r),a.restore();}}};var Ti="undefined"!=typeof window&&(window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.msRequestAnimationFrame&&window.msRequestAnimationFrame.bind(window)||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(t){setTimeout(t,16);},Di=new ie(50);function Ai(t){if("string"==typeof t){var e=Di.get(t);return e&&e.image;}return t;}function Ci(t,e,i,n,a){if(t){if("string"==typeof t){if(e&&e.__zrImageSrc===t||!i)return e;var o=Di.get(t),r={hostEl:i,cb:n,cbPayload:a};return o?!ki(e=o.image)&&o.pending.push(r):(!e&&(e=new Image()),e.onload=Li,Di.put(t,e.__cachedImgObj={image:e,pending:[r]}),e.src=e.__zrImageSrc=t),e;}return t;}return e;}function Li(){var t=this.__cachedImgObj;this.onload=this.__cachedImgObj=null;for(var e=0;e<t.pending.length;e++){var i=t.pending[e],n=i.cb;n&&n(this,i.cbPayload),i.hostEl.dirty();}t.pending.length=0;}function ki(t){return t&&t.width&&t.height;}var Pi={},Ni=0,Oi=5e3,Ei=/\{([a-zA-Z0-9_]+)\|([^}]*)\}/g,Ri="12px sans-serif",zi={};function Bi(t,e){var i=t+":"+(e=e||Ri);if(Pi[i])return Pi[i];for(var n,a,o=(t+"").split("\n"),r=0,s=0,l=o.length;s<l;s++){r=Math.max((n=o[s],a=e,zi.measureText(n,a)).width,r);}return Oi<Ni&&(Ni=0,Pi={}),Ni++,Pi[i]=r;}function Vi(t,e,i,n,a,o,r){return o?(l=n,h=qi(t,{rich:o,truncate:r,font:e,textAlign:s=i,textPadding:a}),u=h.outerWidth,c=h.outerHeight,d=Gi(0,u,s),f=Wi(0,c,l),new ei(d,f,u,c)):function(t,e,i,n,a,o){var r=Yi(t,e,a,o),s=Bi(t,e);a&&(s+=a[1]+a[3]);var l=r.outerHeight,h=Gi(0,s,i),u=Wi(0,l,n),c=new ei(h,u,s,l);return c.lineHeight=r.lineHeight,c;}(t,e,i,n,a,r);var s,l,h,u,c,d,f;}function Gi(t,e,i){return"right"===i?t-=e:"center"===i&&(t-=e/2),t;}function Wi(t,e,i){return"middle"===i?t-=e/2:"bottom"===i&&(t-=e),t;}function Fi(t,e,i){var n=e.x,a=e.y,o=e.height,r=e.width,s=o/2,l="left",h="top";switch(t){case"left":n-=i,a+=s,l="right",h="middle";break;case"right":n+=i+r,a+=s,h="middle";break;case"top":n+=r/2,a-=i,l="center",h="bottom";break;case"bottom":n+=r/2,a+=o+i,l="center";break;case"inside":n+=r/2,a+=s,l="center",h="middle";break;case"insideLeft":n+=i,a+=s,h="middle";break;case"insideRight":n+=r-i,a+=s,l="right",h="middle";break;case"insideTop":n+=r/2,a+=i,l="center";break;case"insideBottom":n+=r/2,a+=o-i,l="center",h="bottom";break;case"insideTopLeft":n+=i,a+=i;break;case"insideTopRight":n+=r-i,a+=i,l="right";break;case"insideBottomLeft":n+=i,a+=o-i,h="bottom";break;case"insideBottomRight":n+=r-i,a+=o-i,l="right",h="bottom";}return{x:n,y:a,textAlign:l,textVerticalAlign:h};}function Hi(t,e,i,n,a){if(!e)return"";var o=(t+"").split("\n");a=Zi(e,i,n,a);for(var r=0,s=o.length;r<s;r++){o[r]=Ui(o[r],a);}return o.join("\n");}function Zi(t,e,i,n){(n=k({},n)).font=e;i=F(i,"...");n.maxIterations=F(n.maxIterations,2);var a=n.minChar=F(n.minChar,0);n.cnCharWidth=Bi("鍥�",e);var o=n.ascCharWidth=Bi("a",e);n.placeholder=F(n.placeholder,"");for(var r=t=Math.max(0,t-1),s=0;s<a&&o<=r;s++){r-=o;}var l=Bi(i);return r<l&&(i="",l=0),r=t-l,n.ellipsis=i,n.ellipsisWidth=l,n.contentWidth=r,n.containerWidth=t,n;}function Ui(t,e){var i=e.containerWidth,n=e.font,a=e.contentWidth;if(!i)return"";var o=Bi(t,n);if(o<=i)return t;for(var r=0;;r++){if(o<=a||r>=e.maxIterations){t+=e.ellipsis;break;}var s=0===r?ji(t,a,e.ascCharWidth,e.cnCharWidth):0<o?Math.floor(t.length*a/o):0;o=Bi(t=t.substr(0,s),n);}return""===t&&(t=e.placeholder),t;}function ji(t,e,i,n){for(var a=0,o=0,r=t.length;o<r&&a<e;o++){var s=t.charCodeAt(o);a+=0<=s&&s<=127?i:n;}return o;}function Xi(t){return Bi("鍥�",t);}function Yi(t,e,i,n){null!=t&&(t+="");var a=Xi(e),o=t?t.split("\n"):[],r=o.length*a,s=r;if(i&&(s+=i[0]+i[2]),t&&n){var l=n.outerHeight,h=n.outerWidth;if(null!=l&&l<s)t="",o=[];else if(null!=h)for(var u=Zi(h-(i?i[1]+i[3]:0),e,n.ellipsis,{minChar:n.minChar,placeholder:n.placeholder}),c=0,d=o.length;c<d;c++){o[c]=Ui(o[c],u);}}return{lines:o,height:r,outerHeight:s,lineHeight:a};}function qi(t,e){var i={lines:[],width:0,height:0};if(null!=t&&(t+=""),!t)return i;for(var n,a=Ei.lastIndex=0;null!=(n=Ei.exec(t));){var o=n.index;a<o&&Ki(i,t.substring(a,o)),Ki(i,n[2],n[1]),a=Ei.lastIndex;}a<t.length&&Ki(i,t.substring(a,t.length));var r=i.lines,s=0,l=0,h=[],u=e.textPadding,c=e.truncate,d=c&&c.outerWidth,f=c&&c.outerHeight;u&&(null!=d&&(d-=u[1]+u[3]),null!=f&&(f-=u[0]+u[2]));for(var p=0;p<r.length;p++){for(var g=r[p],m=0,v=0,y=0;y<g.tokens.length;y++){var x=(C=g.tokens[y]).styleName&&e.rich[C.styleName]||{},_=C.textPadding=x.textPadding,w=C.font=x.font||e.font,b=C.textHeight=F(x.textHeight,Xi(w));if(_&&(b+=_[0]+_[2]),C.height=b,C.lineHeight=H(x.textLineHeight,e.textLineHeight,b),C.textAlign=x&&x.textAlign||e.textAlign,C.textVerticalAlign=x&&x.textVerticalAlign||"middle",null!=f&&s+C.lineHeight>f)return{lines:[],width:0,height:0};C.textWidth=Bi(C.text,w);var S=x.textWidth,M=null==S||"auto"===S;if("string"==typeof S&&"%"===S.charAt(S.length-1))C.percentWidth=S,h.push(C),S=0;else{if(M){S=C.textWidth;var I=x.textBackgroundColor,T=I&&I.image;T&&ki(T=Ai(T))&&(S=Math.max(S,T.width*b/T.height));}var D=_?_[1]+_[3]:0;S+=D;var A=null!=d?d-v:null;null!=A&&A<S&&(!M||A<D?(C.text="",C.textWidth=S=0):(C.text=Hi(C.text,A-D,w,c.ellipsis,{minChar:c.minChar}),C.textWidth=Bi(C.text,w),S=C.textWidth+D));}v+=C.width=S,x&&(m=Math.max(m,C.lineHeight));}g.width=v,s+=g.lineHeight=m,l=Math.max(l,v);}i.outerWidth=i.width=F(e.textWidth,l),i.outerHeight=i.height=F(e.textHeight,s),u&&(i.outerWidth+=u[1]+u[3],i.outerHeight+=u[0]+u[2]);for(p=0;p<h.length;p++){var C,L=(C=h[p]).percentWidth;C.width=parseInt(L,10)/100*l;}return i;}function Ki(t,e,i){for(var n=""===e,a=e.split("\n"),o=t.lines,r=0;r<a.length;r++){var s=a[r],l={styleName:i,text:s,isLineHolder:!s&&!n};if(r)o.push({tokens:[l]});else{var h=(o[o.length-1]||(o[0]={tokens:[]})).tokens,u=h.length;1===u&&h[0].isLineHolder?h[0]=l:(s||!u||n)&&h.push(l);}}}function $i(t){var e=(t.fontSize||t.fontFamily)&&[t.fontStyle,t.fontWeight,(t.fontSize||12)+"px",t.fontFamily||"sans-serif"].join(" ");return e&&X(e)||t.textFont||t.font;}function Ji(t,e){var i,n,a,o,r,s=e.x,l=e.y,h=e.width,u=e.height,c=e.r;h<0&&(s+=h,h=-h),u<0&&(l+=u,u=-u),"number"==typeof c?i=n=a=o=c:c instanceof Array?1===c.length?i=n=a=o=c[0]:2===c.length?(i=a=c[0],n=o=c[1]):3===c.length?(i=c[0],n=o=c[1],a=c[2]):(i=c[0],n=c[1],a=c[2],o=c[3]):i=n=a=o=0,h<i+n&&(i*=h/(r=i+n),n*=h/r),h<a+o&&(a*=h/(r=a+o),o*=h/r),u<n+a&&(n*=u/(r=n+a),a*=u/r),u<i+o&&(i*=u/(r=i+o),o*=u/r),t.moveTo(s+i,l),t.lineTo(s+h-n,l),0!==n&&t.arc(s+h-n,l+n,n,-Math.PI/2,0),t.lineTo(s+h,l+u-a),0!==a&&t.arc(s+h-a,l+u-a,a,0,Math.PI/2),t.lineTo(s+o,l+u),0!==o&&t.arc(s+o,l+u-o,o,Math.PI/2,Math.PI),t.lineTo(s,l+i),0!==i&&t.arc(s+i,l+i,i,Math.PI,1.5*Math.PI);}zi.measureText=function(t,e){var i=x();return i.font=e||Ri,i.measureText(t);};var Qi={left:1,right:1,center:1},tn={top:1,bottom:1,middle:1};function en(t){return nn(t),z(t.rich,nn),t;}function nn(t){if(t){t.font=$i(t);var e=t.textAlign;"middle"===e&&(e="center"),t.textAlign=null==e||Qi[e]?e:"left";var i=t.textVerticalAlign||t.textBaseline;"center"===i&&(i="middle"),t.textVerticalAlign=null==i||tn[i]?i:"top",t.textPadding&&(t.textPadding=U(t.textPadding));}}function an(t,e,i,n,a){n.rich?function(t,e,i,n,a){var o=t.__textCotentBlock;o&&!t.__dirty||(o=t.__textCotentBlock=qi(i,n));!function(t,e,i,n,a){var o=i.width,r=i.outerWidth,s=i.outerHeight,l=n.textPadding,h=un(s,n,a),u=h.baseX,c=h.baseY,d=h.textAlign,f=h.textVerticalAlign;on(e,n,a,u,c);var p=Gi(u,r,d),g=Wi(c,s,f),m=p,v=g;l&&(m+=l[3],v+=l[0]);var y=m+o;sn(n)&&ln(t,e,n,p,g,r,s);for(var x=0;x<i.lines.length;x++){for(var _,w=i.lines[x],b=w.tokens,S=b.length,M=w.lineHeight,I=w.width,T=0,D=m,A=y,C=S-1;T<S&&(!(_=b[T]).textAlign||"left"===_.textAlign);){rn(t,e,_,n,M,v,D,"left"),I-=_.width,D+=_.width,T++;}for(;0<=C&&"right"===(_=b[C]).textAlign;){rn(t,e,_,n,M,v,A,"right"),I-=_.width,A-=_.width,C--;}for(D+=(o-(D-m)-(y-A)-I)/2;T<=C;){_=b[T],rn(t,e,_,n,M,v,D+_.width/2,"center"),D+=_.width,T++;}v+=M;}}(t,e,o,n,a);}(t,e,i,n,a):function(t,e,i,n,a){var o=cn(e,"font",n.font||Ri),r=n.textPadding,s=t.__textCotentBlock;s&&!t.__dirty||(s=t.__textCotentBlock=Yi(i,o,r,n.truncate));var l=s.outerHeight,h=s.lines,u=s.lineHeight,c=un(l,n,a),d=c.baseX,f=c.baseY,p=c.textAlign,g=c.textVerticalAlign;on(e,n,a,d,f);var m=Wi(f,l,g),v=d,y=m,x=sn(n);if(x||r){var _=Bi(i,o),w=_;r&&(w+=r[1]+r[3]);var b=Gi(d,w,p);x&&ln(t,e,n,b,m,w,l),r&&(v=gn(d,p,r),y+=r[0]);}cn(e,"textAlign",p||"left"),cn(e,"textBaseline","middle"),cn(e,"shadowBlur",n.textShadowBlur||0),cn(e,"shadowColor",n.textShadowColor||"transparent"),cn(e,"shadowOffsetX",n.textShadowOffsetX||0),cn(e,"shadowOffsetY",n.textShadowOffsetY||0),y+=u/2;var S=n.textStrokeWidth,M=dn(n.textStroke,S),I=fn(n.textFill);M&&(cn(e,"lineWidth",S),cn(e,"strokeStyle",M));I&&cn(e,"fillStyle",I);for(var T=0;T<h.length;T++){M&&e.strokeText(h[T],v,y),I&&e.fillText(h[T],v,y),y+=u;}}(t,e,i,n,a);}function on(t,e,i,n,a){if(i&&e.textRotation){var o=e.textOrigin;"center"===o?(n=i.width/2+i.x,a=i.height/2+i.y):o&&(n=o[0]+i.x,a=o[1]+i.y),t.translate(n,a),t.rotate(-e.textRotation),t.translate(-n,-a);}}function rn(t,e,i,n,a,o,r,s){var l=n.rich[i.styleName]||{},h=i.textVerticalAlign,u=o+a/2;"top"===h?u=o+i.height/2:"bottom"===h&&(u=o+a-i.height/2),!i.isLineHolder&&sn(l)&&ln(t,e,l,"right"===s?r-i.width:"center"===s?r-i.width/2:r,u-i.height/2,i.width,i.height);var c=i.textPadding;c&&(r=gn(r,s,c),u-=i.height/2-c[2]-i.textHeight/2),cn(e,"shadowBlur",H(l.textShadowBlur,n.textShadowBlur,0)),cn(e,"shadowColor",l.textShadowColor||n.textShadowColor||"transparent"),cn(e,"shadowOffsetX",H(l.textShadowOffsetX,n.textShadowOffsetX,0)),cn(e,"shadowOffsetY",H(l.textShadowOffsetY,n.textShadowOffsetY,0)),cn(e,"textAlign",s),cn(e,"textBaseline","middle"),cn(e,"font",i.font||Ri);var d=dn(l.textStroke||n.textStroke,p),f=fn(l.textFill||n.textFill),p=F(l.textStrokeWidth,n.textStrokeWidth);d&&(cn(e,"lineWidth",p),cn(e,"strokeStyle",d),e.strokeText(i.text,r,u)),f&&(cn(e,"fillStyle",f),e.fillText(i.text,r,u));}function sn(t){return t.textBackgroundColor||t.textBorderWidth&&t.textBorderColor;}function ln(t,e,i,n,a,o,r){var s=i.textBackgroundColor,l=i.textBorderWidth,h=i.textBorderColor,u=D(s);if(cn(e,"shadowBlur",i.textBoxShadowBlur||0),cn(e,"shadowColor",i.textBoxShadowColor||"transparent"),cn(e,"shadowOffsetX",i.textBoxShadowOffsetX||0),cn(e,"shadowOffsetY",i.textBoxShadowOffsetY||0),u||l&&h){e.beginPath();var c=i.textBorderRadius;c?Ji(e,{x:n,y:a,width:o,height:r,r:c}):e.rect(n,a,o,r),e.closePath();}if(u)cn(e,"fillStyle",s),e.fill();else if(R(s)){var d=s.image;(d=Ci(d,null,t,hn,s))&&ki(d)&&e.drawImage(d,n,a,o,r);}l&&h&&(cn(e,"lineWidth",l),cn(e,"strokeStyle",h),e.stroke());}function hn(t,e){e.image=t;}function un(t,e,i){var n=e.x||0,a=e.y||0,o=e.textAlign,r=e.textVerticalAlign;if(i){var s=e.textPosition;if(s instanceof Array)n=i.x+pn(s[0],i.width),a=i.y+pn(s[1],i.height);else{var l=Fi(s,i,e.textDistance);n=l.x,a=l.y,o=o||l.textAlign,r=r||l.textVerticalAlign;}var h=e.textOffset;h&&(n+=h[0],a+=h[1]);}return{baseX:n,baseY:a,textAlign:o,textVerticalAlign:r};}function cn(t,e,i){return t[e]=pi(t,e,i),t[e];}function dn(t,e){return null==t||e<=0||"transparent"===t||"none"===t?null:t.image||t.colorStops?"#000":t;}function fn(t){return null==t||"none"===t?null:t.image||t.colorStops?"#000":t;}function pn(t,e){return"string"==typeof t?0<=t.lastIndexOf("%")?parseFloat(t)/100*e:parseFloat(t):t;}function gn(t,e,i){return"right"===e?t-i[1]:"center"===e?t+i[3]/2-i[1]/2:t+i[3];}function mn(t,e){return null!=t&&(t||e.textBackgroundColor||e.textBorderWidth&&e.textBorderColor||e.textPadding);}var vn=new ei(),yn=function yn(){};function xn(t){for(var e in t=t||{},Xe.call(this,t),t){t.hasOwnProperty(e)&&"style"!==e&&(this[e]=t[e]);}this.style=new mi(t.style,this),this._rect=null,this.__clipPaths=[];}function _n(t){xn.call(this,t);}xn.prototype={constructor:xn,type:"displayable",__dirty:!0,invisible:!(yn.prototype={constructor:yn,drawRectText:function drawRectText(t,e){var i=this.style;e=i.textRect||e,this.__dirty&&en(i);var n=i.text;if(null!=n&&(n+=""),mn(n,i)){t.save();var a=this.transform;i.transformText?this.setTransform(t):a&&(vn.copy(e),vn.applyTransform(a),e=vn),an(this,t,n,i,e),t.restore();}}}),z:0,z2:0,zlevel:0,draggable:!1,dragging:!1,silent:!1,culling:!1,cursor:"pointer",rectHover:!1,progressive:!1,incremental:!1,inplace:!1,beforeBrush:function beforeBrush(t){},afterBrush:function afterBrush(t){},brush:function brush(t,e){},getBoundingRect:function getBoundingRect(){},contain:function contain(t,e){return this.rectContain(t,e);},traverse:function traverse(t,e){t.call(e,this);},rectContain:function rectContain(t,e){var i=this.transformCoordToLocal(t,e);return this.getBoundingRect().contain(i[0],i[1]);},dirty:function dirty(){this.__dirty=!0,this._rect=null,this.__zr&&this.__zr.refresh();},animateStyle:function animateStyle(t){return this.animate("style",t);},attrKV:function attrKV(t,e){"style"!==t?Xe.prototype.attrKV.call(this,t,e):this.style.set(e);},setStyle:function setStyle(t,e){return this.style.set(t,e),this.dirty(!1),this;},useStyle:function useStyle(t){return this.style=new mi(t,this),this.dirty(!1),this;}},_(xn,Xe),w(xn,yn),_n.prototype={constructor:_n,type:"image",brush:function brush(t,e){var i=this.style,n=i.image;i.bind(t,this,e);var a=this._image=Ci(n,this._image,this,this.onload);if(a&&ki(a)){var o=i.x||0,r=i.y||0,s=i.width,l=i.height,h=a.width/a.height;if(null==s&&null!=l?s=l*h:null==l&&null!=s?l=s/h:null==s&&null==l&&(s=a.width,l=a.height),this.setTransform(t),i.sWidth&&i.sHeight){var u=i.sx||0,c=i.sy||0;t.drawImage(a,u,c,i.sWidth,i.sHeight,o,r,s,l);}else if(i.sx&&i.sy){var d=s-(u=i.sx),f=l-(c=i.sy);t.drawImage(a,u,c,d,f,o,r,s,l);}else t.drawImage(a,o,r,s,l);null!=i.text&&(this.restoreTransform(t),this.drawRectText(t,this.getBoundingRect()));}},getBoundingRect:function getBoundingRect(){var t=this.style;return this._rect||(this._rect=new ei(t.x||0,t.y||0,t.width||0,t.height||0)),this._rect;}},_(_n,xn);var wn=314159;function bn(t){return parseInt(t,10);}var Sn=new ei(0,0,0,0),Mn=new ei(0,0,0,0);var In=function In(t,e,i){this.type="canvas";var n=!t.nodeName||"CANVAS"===t.nodeName.toUpperCase();this._opts=i=k({},i||{}),this.dpr=i.devicePixelRatio||He,this._singleCanvas=n;var a=(this.root=t).style;a&&(a["-webkit-tap-highlight-color"]="transparent",a["-webkit-user-select"]=a["user-select"]=a["-webkit-touch-callout"]="none",t.innerHTML=""),this.storage=e;var o,r,s,l=this._zlevelList=[],h=this._layers={};if(this._layerConfig={},this._needsManuallyCompositing=!1,n){var u=t.width,c=t.height;null!=i.width&&(u=i.width),null!=i.height&&(c=i.height),this.dpr=i.devicePixelRatio||1,t.width=u*this.dpr,t.height=c*this.dpr,this._width=u,this._height=c;var d=new Ii(t,this,this.dpr);d.__builtin__=!0,d.initContext(),h[wn]=d,l.push(wn),this._domRoot=t;}else{this._width=this._getSize(0),this._height=this._getSize(1);var f=this._domRoot=(o=this._width,r=this._height,(s=document.createElement("div")).style.cssText=["position:relative","overflow:hidden","width:"+o+"px","height:"+r+"px","padding:0","margin:0","border-width:0"].join(";")+";",s);t.appendChild(f);}this._hoverlayer=null,this._hoverElements=[];};In.prototype={constructor:In,getType:function getType(){return"canvas";},isSingleCanvas:function isSingleCanvas(){return this._singleCanvas;},getViewportRoot:function getViewportRoot(){return this._domRoot;},getViewportRootOffset:function getViewportRootOffset(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0};},refresh:function refresh(t){var e=this.storage.getDisplayList(!0),i=this._zlevelList;this._redrawId=Math.random(),this._paintList(e,t,this._redrawId);for(var n=0;n<i.length;n++){var a=i[n],o=this._layers[a];if(!o.__builtin__&&o.refresh){var r=0===n?this._backgroundColor:null;o.refresh(r);}}return this.refreshHover(),this;},addHover:function addHover(t,e){if(!t.__hoverMir){var i=new t.constructor({style:t.style,shape:t.shape});((i.__from=t).__hoverMir=i).setStyle(e),this._hoverElements.push(i);}},removeHover:function removeHover(t){var e=t.__hoverMir,i=this._hoverElements,n=L(i,e);0<=n&&i.splice(n,1),t.__hoverMir=null;},clearHover:function clearHover(t){for(var e=this._hoverElements,i=0;i<e.length;i++){var n=e[i].__from;n&&(n.__hoverMir=null);}e.length=0;},refreshHover:function refreshHover(){var t=this._hoverElements,e=t.length,i=this._hoverlayer;if(i&&i.clear(),e){ui(t,this.storage.displayableSortFunc),i||(i=this._hoverlayer=this.getLayer(1e5));var n={};i.ctx.save();for(var a=0;a<e;){var o=t[a],r=o.__from;r&&r.__zr?(a++,r.invisible||(o.transform=r.transform,o.invTransform=r.invTransform,o.__clipPaths=r.__clipPaths,this._doPaintEl(o,i,!0,n))):(t.splice(a,1),r.__hoverMir=null,e--);}i.ctx.restore();}},getHoverLayer:function getHoverLayer(){return this.getLayer(1e5);},_paintList:function _paintList(t,e,i){if(this._redrawId===i){e=e||!1,this._updateLayerStatus(t);var n=this._doPaintList(t,e);if(this._needsManuallyCompositing&&this._compositeManually(),!n){var a=this;Ti(function(){a._paintList(t,e,i);});}}},_compositeManually:function _compositeManually(){var e=this.getLayer(wn).ctx,i=this._domRoot.width,n=this._domRoot.height;e.clearRect(0,0,i,n),this.eachBuiltinLayer(function(t){t.virtual&&e.drawImage(t.dom,0,0,i,n);});},_doPaintList:function _doPaintList(t,e){for(var i=[],n=0;n<this._zlevelList.length;n++){var a=this._zlevelList[n];(s=this._layers[a]).__builtin__&&s!==this._hoverlayer&&(s.__dirty||e)&&i.push(s);}for(var o=!0,r=0;r<i.length;r++){var s,l=(s=i[r]).ctx,h={};l.save();var u=e?s.__startIndex:s.__drawIndex,c=!e&&s.incremental&&Date.now,d=c&&Date.now(),f=s.zlevel===this._zlevelList[0]?this._backgroundColor:null;if(s.__startIndex===s.__endIndex)s.clear(!1,f);else if(u===s.__startIndex){var p=t[u];p.incremental&&p.notClear&&!e||s.clear(!1,f);}-1===u&&(console.error("For some unknown reason. drawIndex is -1"),u=s.__startIndex);for(var g=u;g<s.__endIndex;g++){var m=t[g];if(this._doPaintEl(m,s,e,h),m.__dirty=!1,c)if(15<Date.now()-d)break;}s.__drawIndex=g,s.__drawIndex<s.__endIndex&&(o=!1),h.prevElClipPaths&&l.restore(),l.restore();}return v.wxa&&z(this._layers,function(t){t&&t.ctx&&t.ctx.draw&&t.ctx.draw();}),o;},_doPaintEl:function _doPaintEl(t,e,i,n){var a,o,r,s=e.ctx,l=t.transform;if((e.__dirty||i)&&!t.invisible&&0!==t.style.opacity&&(!l||l[0]||l[3])&&(!t.culling||(a=t,o=this._width,r=this._height,Sn.copy(a.getBoundingRect()),a.transform&&Sn.applyTransform(a.transform),Mn.width=o,Mn.height=r,Sn.intersect(Mn)))){var h=t.__clipPaths;n.prevElClipPaths&&!function(t,e){if(t==e)return!1;if(!t||!e||t.length!==e.length)return!0;for(var i=0;i<t.length;i++){if(t[i]!==e[i])return!0;}}(h,n.prevElClipPaths)||(n.prevElClipPaths&&(e.ctx.restore(),n.prevElClipPaths=null,n.prevEl=null),h&&(s.save(),function(t,e){for(var i=0;i<t.length;i++){var n=t[i];n.setTransform(e),e.beginPath(),n.buildPath(e,n.shape),e.clip(),n.restoreTransform(e);}}(h,s),n.prevElClipPaths=h)),t.beforeBrush&&t.beforeBrush(s),t.brush(s,n.prevEl||null),(n.prevEl=t).afterBrush&&t.afterBrush(s);}},getLayer:function getLayer(t,e){this._singleCanvas&&!this._needsManuallyCompositing&&(t=wn);var i=this._layers[t];return i||((i=new Ii("zr_"+t,this,this.dpr)).zlevel=t,i.__builtin__=!0,this._layerConfig[t]&&g(i,this._layerConfig[t],!0),e&&(i.virtual=e),this.insertLayer(t,i),i.initContext()),i;},insertLayer:function insertLayer(t,e){var i=this._layers,n=this._zlevelList,a=n.length,o=null,r=-1,s=this._domRoot;if(i[t])Ue("ZLevel "+t+" has been used already");else if((l=e)&&(l.__builtin__||"function"==typeof l.resize&&"function"==typeof l.refresh)){var l;if(0<a&&t>n[0]){for(r=0;r<a-1&&!(n[r]<t&&n[r+1]>t);r++){}o=i[n[r]];}if(n.splice(r+1,0,t),!(i[t]=e).virtual)if(o){var h=o.dom;h.nextSibling?s.insertBefore(e.dom,h.nextSibling):s.appendChild(e.dom);}else s.firstChild?s.insertBefore(e.dom,s.firstChild):s.appendChild(e.dom);}else Ue("Layer of zlevel "+t+" is not valid");},eachLayer:function eachLayer(t,e){var i,n,a=this._zlevelList;for(n=0;n<a.length;n++){i=a[n],t.call(e,this._layers[i],i);}},eachBuiltinLayer:function eachBuiltinLayer(t,e){var i,n,a,o=this._zlevelList;for(a=0;a<o.length;a++){n=o[a],(i=this._layers[n]).__builtin__&&t.call(e,i,n);}},eachOtherLayer:function eachOtherLayer(t,e){var i,n,a,o=this._zlevelList;for(a=0;a<o.length;a++){n=o[a],(i=this._layers[n]).__builtin__||t.call(e,i,n);}},getLayers:function getLayers(){return this._layers;},_updateLayerStatus:function _updateLayerStatus(t){function e(t){n&&(n.__endIndex!==t&&(n.__dirty=!0),n.__endIndex=t);}if(this.eachBuiltinLayer(function(t,e){t.__dirty=t.__used=!1;}),this._singleCanvas)for(var i=1;i<t.length;i++){if((o=t[i]).zlevel!==t[i-1].zlevel||o.incremental){this._needsManuallyCompositing=!0;break;}}var n=null,a=0;for(i=0;i<t.length;i++){var o,r,s=(o=t[i]).zlevel;o.incremental?((r=this.getLayer(s+.001,this._needsManuallyCompositing)).incremental=!0,a=1):r=this.getLayer(s+(0<a?.01:0),this._needsManuallyCompositing),r.__builtin__||Ue("ZLevel "+s+" has been used by unkown layer "+r.id),r!==n&&(r.__used=!0,r.__startIndex!==i&&(r.__dirty=!0),r.__startIndex=i,r.incremental?r.__drawIndex=-1:r.__drawIndex=i,e(i),n=r),o.__dirty&&(r.__dirty=!0,r.incremental&&r.__drawIndex<0&&(r.__drawIndex=i));}e(i),this.eachBuiltinLayer(function(t,e){!t.__used&&0<t.getElementCount()&&(t.__dirty=!0,t.__startIndex=t.__endIndex=t.__drawIndex=0),t.__dirty&&t.__drawIndex<0&&(t.__drawIndex=t.__startIndex);});},clear:function clear(){return this.eachBuiltinLayer(this._clearLayer),this;},_clearLayer:function _clearLayer(t){t.clear();},setBackgroundColor:function setBackgroundColor(t){this._backgroundColor=t;},configLayer:function configLayer(t,e){if(e){var i=this._layerConfig;i[t]?g(i[t],e,!0):i[t]=e;for(var n=0;n<this._zlevelList.length;n++){var a=this._zlevelList[n];if(a===t||a===t+.01)g(this._layers[a],i[t],!0);}}},delLayer:function delLayer(t){var e=this._layers,i=this._zlevelList,n=e[t];n&&(n.dom.parentNode.removeChild(n.dom),delete e[t],i.splice(L(i,t),1));},resize:function resize(e,i){if(this._domRoot.style){var t=this._domRoot;t.style.display="none";var n=this._opts;if(null!=e&&(n.width=e),null!=i&&(n.height=i),e=this._getSize(0),i=this._getSize(1),t.style.display="",this._width!=e||i!=this._height){for(var a in t.style.width=e+"px",t.style.height=i+"px",this._layers){this._layers.hasOwnProperty(a)&&this._layers[a].resize(e,i);}z(this._progressiveLayers,function(t){t.resize(e,i);}),this.refresh(!0);}this._width=e,this._height=i;}else{if(null==e||null==i)return;this._width=e,this._height=i,this.getLayer(wn).resize(e,i);}return this;},clearLayer:function clearLayer(t){var e=this._layers[t];e&&e.clear();},dispose:function dispose(){this.root.innerHTML="",this.root=this.storage=this._domRoot=this._layers=null;},getRenderedCanvas:function getRenderedCanvas(t){if(t=t||{},this._singleCanvas&&!this._compositeManually)return this._layers[wn].dom;var e=new Ii("image",this,t.pixelRatio||this.dpr);if(e.initContext(),e.clear(!1,t.backgroundColor||this._backgroundColor),t.pixelRatio<=this.dpr){this.refresh();var i=e.dom.width,n=e.dom.height,a=e.ctx;this.eachLayer(function(t){t.__builtin__?a.drawImage(t.dom,0,0,i,n):t.renderToCanvas&&(e.ctx.save(),t.renderToCanvas(e.ctx),e.ctx.restore());});}else for(var o={},r=this.storage.getDisplayList(!0),s=0;s<r.length;s++){var l=r[s];this._doPaintEl(l,e,!0,o);}return e.dom;},getWidth:function getWidth(){return this._width;},getHeight:function getHeight(){return this._height;},_getSize:function _getSize(t){var e=this._opts,i=["width","height"][t],n=["clientWidth","clientHeight"][t],a=["paddingLeft","paddingTop"][t],o=["paddingRight","paddingBottom"][t];if(null!=e[i]&&"auto"!==e[i])return parseFloat(e[i]);var r=this.root,s=document.defaultView.getComputedStyle(r);return(r[n]||bn(s[i])||bn(r.style[i]))-(bn(s[a])||0)-(bn(s[o])||0)|0;},pathToImage:function pathToImage(t,e){e=e||this.dpr;var i=document.createElement("canvas"),n=i.getContext("2d"),a=t.getBoundingRect(),o=t.style,r=o.shadowBlur*e,s=o.shadowOffsetX*e,l=o.shadowOffsetY*e,h=o.hasStroke()?o.lineWidth:0,u=Math.max(h/2,-s+r),c=Math.max(h/2,s+r),d=Math.max(h/2,-l+r),f=Math.max(h/2,l+r),p=a.width+u+c,g=a.height+d+f;i.width=p*e,i.height=g*e,n.scale(e,e),n.clearRect(0,0,p,g),n.dpr=e;var m={position:t.position,rotation:t.rotation,scale:t.scale};t.position=[u-a.x,d-a.y],t.rotation=0,t.scale=[1,1],t.updateTransform(),t&&t.brush(n);var v=new _n({style:{x:0,y:0,image:i}});return null!=m.position&&(v.position=t.position=m.position),null!=m.rotation&&(v.rotation=t.rotation=m.rotation),null!=m.scale&&(v.scale=t.scale=m.scale),v;}};var Tn="undefined"!=typeof window&&!!window.addEventListener,Dn=/^(?:mouse|pointer|contextmenu|drag|drop)|click/;function An(t,e,i,n){return i=i||{},n||!v.canvasSupported?Cn(t,e,i):v.browser.firefox&&null!=e.layerX&&e.layerX!==e.offsetX?(i.zrX=e.layerX,i.zrY=e.layerY):null!=e.offsetX?(i.zrX=e.offsetX,i.zrY=e.offsetY):Cn(t,e,i),i;}function Cn(t,e,i){var n,a=(n=t).getBoundingClientRect?n.getBoundingClientRect():{left:0,top:0};i.zrX=e.clientX-a.left,i.zrY=e.clientY-a.top;}function Ln(t,e,i){if(null!=(e=e||window.event).zrX)return e;var n=e.type;if(n&&0<=n.indexOf("touch")){var a="touchend"!=n?e.targetTouches[0]:e.changedTouches[0];a&&An(t,a,e,i);}else An(t,e,e,i),e.zrDelta=e.wheelDelta?e.wheelDelta/120:-(e.detail||0)/3;var o=e.button;return null==e.which&&void 0!==o&&Dn.test(e.type)&&(e.which=1&o?1:2&o?3:4&o?2:0),e;}function kn(t,e,i){Tn?t.addEventListener(e,i):t.attachEvent("on"+e,i);}var Pn=Tn?function(t){t.preventDefault(),t.stopPropagation(),t.cancelBubble=!0;}:function(t){t.returnValue=!1,t.cancelBubble=!0;};function Nn(t){return 1<t.which;}var On=function On(t){t=t||{},this.stage=t.stage||{},this.onframe=t.onframe||function(){},this._clips=[],this._running=!1,this._time,this._pausedTime,this._pauseStart,this._paused=!1,At.call(this);};On.prototype={constructor:On,addClip:function addClip(t){this._clips.push(t);},addAnimator:function addAnimator(t){t.animation=this;for(var e=t.getClips(),i=0;i<e.length;i++){this.addClip(e[i]);}},removeClip:function removeClip(t){var e=L(this._clips,t);0<=e&&this._clips.splice(e,1);},removeAnimator:function removeAnimator(t){for(var e=t.getClips(),i=0;i<e.length;i++){this.removeClip(e[i]);}t.animation=null;},_update:function _update(){for(var t=new Date().getTime()-this._pausedTime,e=t-this._time,i=this._clips,n=i.length,a=[],o=[],r=0;r<n;r++){var s=i[r],l=s.step(t,e);l&&(a.push(l),o.push(s));}for(r=0;r<n;){i[r]._needsRemove?(i[r]=i[n-1],i.pop(),n--):r++;}n=a.length;for(r=0;r<n;r++){o[r].fire(a[r]);}this._time=t,this.onframe(e),this.trigger("frame",e),this.stage.update&&this.stage.update();},_startLoop:function _startLoop(){var e=this;this._running=!0,Ti(function t(){e._running&&(Ti(t),!e._paused&&e._update());});},start:function start(){this._time=new Date().getTime(),this._pausedTime=0,this._startLoop();},stop:function stop(){this._running=!1;},pause:function pause(){this._paused||(this._pauseStart=new Date().getTime(),this._paused=!0);},resume:function resume(){this._paused&&(this._pausedTime+=new Date().getTime()-this._pauseStart,this._paused=!1);},clear:function clear(){this._clips=[];},isFinished:function isFinished(){return!this._clips.length;},animate:function animate(t,e){var i=new We(t,(e=e||{}).loop,e.getter,e.setter);return this.addAnimator(i),i;}},w(On,At);var En=function En(){this._track=[];};function Rn(t){var e=t[1][0]-t[0][0],i=t[1][1]-t[0][1];return Math.sqrt(e*e+i*i);}En.prototype={constructor:En,recognize:function recognize(t,e,i){return this._doTrack(t,e,i),this._recognize(t);},clear:function clear(){return this._track.length=0,this;},_doTrack:function _doTrack(t,e,i){var n=t.touches;if(n){for(var a={points:[],touches:[],target:e,event:t},o=0,r=n.length;o<r;o++){var s=n[o],l=An(i,s,{});a.points.push([l.zrX,l.zrY]),a.touches.push(s);}this._track.push(a);}},_recognize:function _recognize(t){for(var e in zn){if(zn.hasOwnProperty(e)){var i=zn[e](this._track,t);if(i)return i;}}}};var zn={pinch:function pinch(t,e){var i=t.length;if(i){var n,a=(t[i-1]||{}).points,o=(t[i-2]||{}).points||a;if(o&&1<o.length&&a&&1<a.length){var r=Rn(a)/Rn(o);!isFinite(r)&&(r=1),e.pinchScale=r;var s=[((n=a)[0][0]+n[1][0])/2,(n[0][1]+n[1][1])/2];return e.pinchX=s[0],e.pinchY=s[1],{type:"pinch",target:t[0].target,event:e};}}}},Bn=["click","dblclick","mousewheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],Vn=["touchstart","touchend","touchmove"],Gn={pointerdown:1,pointerup:1,pointermove:1,pointerout:1},Wn=P(Bn,function(t){var e=t.replace("mouse","pointer");return Gn[e]?e:t;});function Fn(t){return"mousewheel"===t&&v.browser.firefox?"DOMMouseScroll":t;}function Hn(t,e,i){var n=t._gestureMgr;"start"===i&&n.clear();var a=n.recognize(e,t.handler.findHover(e.zrX,e.zrY,null).target,t.dom);if("end"===i&&n.clear(),a){var o=a.type;e.gestureEvent=o,t.handler.dispatchToElement({target:a.target},o,a.event);}}function Zn(t){t._touching=!0,clearTimeout(t._touchTimer),t._touchTimer=setTimeout(function(){t._touching=!1;},700);}var Un={mousemove:function mousemove(t){t=Ln(this.dom,t),this.trigger("mousemove",t);},mouseout:function mouseout(t){var e=(t=Ln(this.dom,t)).toElement||t.relatedTarget;if(e!=this.dom)for(;e&&9!=e.nodeType;){if(e===this.dom)return;e=e.parentNode;}this.trigger("mouseout",t);},touchstart:function touchstart(t){(t=Ln(this.dom,t)).zrByTouch=!0,this._lastTouchMoment=new Date(),Hn(this,t,"start"),Un.mousemove.call(this,t),Un.mousedown.call(this,t),Zn(this);},touchmove:function touchmove(t){(t=Ln(this.dom,t)).zrByTouch=!0,Hn(this,t,"change"),Un.mousemove.call(this,t),Zn(this);},touchend:function touchend(t){(t=Ln(this.dom,t)).zrByTouch=!0,Hn(this,t,"end"),Un.mouseup.call(this,t),+new Date()-this._lastTouchMoment<300&&Un.click.call(this,t),Zn(this);},pointerdown:function pointerdown(t){Un.mousedown.call(this,t);},pointermove:function pointermove(t){jn(t)||Un.mousemove.call(this,t);},pointerup:function pointerup(t){Un.mouseup.call(this,t);},pointerout:function pointerout(t){jn(t)||Un.mouseout.call(this,t);}};function jn(t){var e=t.pointerType;return"pen"===e||"touch"===e;}function Xn(i){var n;function t(t,e){z(t,function(t){kn(i,Fn(t),e._handlers[t]);},e);}At.call(this),this.dom=i,this._touching=!1,this._touchTimer,this._gestureMgr=new En(),this._handlers={},n=this,z(Vn,function(t){n._handlers[t]=S(Un[t],n);}),z(Wn,function(t){n._handlers[t]=S(Un[t],n);}),z(Bn,function(t){var e,i;n._handlers[t]=(e=Un[t],i=n,function(){if(!i._touching)return e.apply(i,arguments);});}),v.pointerEventsSupported?t(Wn,this):(v.touchEventsSupported&&t(Vn,this),t(Bn,this));}z(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(e){Un[e]=function(t){t=Ln(this.dom,t),this.trigger(e,t);};});var Yn=Xn.prototype;Yn.dispose=function(){for(var t,e,i,n=Bn.concat(Vn),a=0;a<n.length;a++){var o=n[a];t=this.dom,e=Fn(o),i=this._handlers[o],Tn?t.removeEventListener(e,i):t.detachEvent("on"+e,i);}},Yn.setCursor=function(t){this.dom.style&&(this.dom.style.cursor=t||"default");},w(Xn,At);var qn=!v.canvasSupported,Kn={canvas:In},$n={};function Jn(t,e){var i=new ta(n(),t,e);return $n[i.id]=i;}function Qn(t,e){Kn[t]=e;}var ta=function ta(t,e,i){i=i||{},this.dom=e,this.id=t;var n=this,a=new di(),o=i.renderer;if(qn){if(!Kn.vml)throw new Error("You need to require 'zrender/vml/vml' to support IE8");o="vml";}else o&&Kn[o]||(o="canvas");var r=new Kn[o](e,a,i,t);this.storage=a,this.painter=r;var s=v.node||v.worker?null:new Xn(r.getViewportRoot());this.handler=new Pt(a,r,s,r.root),this.animation=new On({stage:{update:S(this.flush,this)}}),this.animation.start(),this._needsRefresh;var l=a.delFromStorage,h=a.addToStorage;a.delFromStorage=function(t){l.call(a,t),t&&t.removeSelfFromZr(n);},a.addToStorage=function(t){h.call(a,t),t.addSelfToZr(n);};};ta.prototype={constructor:ta,getId:function getId(){return this.id;},add:function add(t){this.storage.addRoot(t),this._needsRefresh=!0;},remove:function remove(t){this.storage.delRoot(t),this._needsRefresh=!0;},configLayer:function configLayer(t,e){this.painter.configLayer&&this.painter.configLayer(t,e),this._needsRefresh=!0;},setBackgroundColor:function setBackgroundColor(t){this.painter.setBackgroundColor&&this.painter.setBackgroundColor(t),this._needsRefresh=!0;},refreshImmediately:function refreshImmediately(){this._needsRefresh=!1,this.painter.refresh(),this._needsRefresh=!1;},refresh:function refresh(){this._needsRefresh=!0;},flush:function flush(){var t;this._needsRefresh&&(t=!0,this.refreshImmediately()),this._needsRefreshHover&&(t=!0,this.refreshHoverImmediately()),t&&this.trigger("rendered");},addHover:function addHover(t,e){this.painter.addHover&&(this.painter.addHover(t,e),this.refreshHover());},removeHover:function removeHover(t){this.painter.removeHover&&(this.painter.removeHover(t),this.refreshHover());},clearHover:function clearHover(){this.painter.clearHover&&(this.painter.clearHover(),this.refreshHover());},refreshHover:function refreshHover(){this._needsRefreshHover=!0;},refreshHoverImmediately:function refreshHoverImmediately(){this._needsRefreshHover=!1,this.painter.refreshHover&&this.painter.refreshHover();},resize:function resize(t){t=t||{},this.painter.resize(t.width,t.height),this.handler.resize();},clearAnimation:function clearAnimation(){this.animation.clear();},getWidth:function getWidth(){return this.painter.getWidth();},getHeight:function getHeight(){return this.painter.getHeight();},pathToImage:function pathToImage(t,e){return this.painter.pathToImage(t,e);},setCursorStyle:function setCursorStyle(t){this.handler.setCursorStyle(t);},findHover:function findHover(t,e){return this.handler.findHover(t,e);},on:function on(t,e,i){this.handler.on(t,e,i);},off:function off(t,e){this.handler.off(t,e);},trigger:function trigger(t,e){this.handler.trigger(t,e);},clear:function clear(){this.storage.delRoot(),this.painter.clear();},dispose:function dispose(){var t;this.animation.stop(),this.clear(),this.storage.dispose(),this.painter.dispose(),this.handler.dispose(),this.animation=this.storage=this.painter=this.handler=null,t=this.id,delete $n[t];}};var ea=(Object.freeze||Object)({version:"4.0.3",init:Jn,dispose:function dispose(t){if(t)t.dispose();else{for(var e in $n){$n.hasOwnProperty(e)&&$n[e].dispose();}$n={};}return this;},getInstance:function getInstance(t){return $n[t];},registerPainter:Qn}),ia=z,na=R,aa=E,oa="series\0";function ra(t){return t instanceof Array?t:null==t?[]:[t];}function sa(t,e,i){if(t){t[e]=t[e]||{},t.emphasis=t.emphasis||{},t.emphasis[e]=t.emphasis[e]||{};for(var n=0,a=i.length;n<a;n++){var o=i[n];!t.emphasis[e].hasOwnProperty(o)&&t[e].hasOwnProperty(o)&&(t.emphasis[e][o]=t[e][o]);}}}var la=["fontStyle","fontWeight","fontSize","fontFamily","rich","tag","color","textBorderColor","textBorderWidth","width","height","lineHeight","align","verticalAlign","baseline","shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY","textShadowColor","textShadowBlur","textShadowOffsetX","textShadowOffsetY","backgroundColor","borderColor","borderWidth","borderRadius","padding"];function ha(t){return!na(t)||aa(t)||t instanceof Date?t:t.value;}function ua(t,a){a=(a||[]).slice();var o=P(t||[],function(t,e){return{exist:t};});return ia(a,function(t,e){if(na(t)){for(var i=0;i<o.length;i++){if(!o[i].option&&null!=t.id&&o[i].exist.id===t.id+"")return o[i].option=t,void(a[e]=null);}for(i=0;i<o.length;i++){var n=o[i].exist;if(!(o[i].option||null!=n.id&&null!=t.id||null==t.name||fa(t)||fa(n)||n.name!==t.name+""))return o[i].option=t,void(a[e]=null);}}}),ia(a,function(t,e){if(na(t)){for(var i=0;i<o.length;i++){var n=o[i].exist;if(!o[i].option&&!fa(n)&&null==t.id){o[i].option=t;break;}}i>=o.length&&o.push({option:t});}}),o;}function ca(t){var r=J();ia(t,function(t,e){var i=t.exist;i&&r.set(i.id,t);}),ia(t,function(t,e){var i=t.option;j(!i||null==i.id||!r.get(i.id)||r.get(i.id)===t,"id duplicates: "+(i&&i.id)),i&&null!=i.id&&r.set(i.id,t),!t.keyInfo&&(t.keyInfo={});}),ia(t,function(t,e){var i=t.exist,n=t.option,a=t.keyInfo;if(na(n)){if(a.name=null!=n.name?n.name+"":i?i.name:oa+e,i)a.id=i.id;else if(null!=n.id)a.id=n.id+"";else for(var o=0;a.id="\0"+a.name+"\0"+o++,r.get(a.id);){}r.set(a.id,t);}});}function da(t){var e=t.name;return!(!e||!e.indexOf(oa));}function fa(t){return na(t)&&t.id&&0===(t.id+"").indexOf("\0_ec_\0");}function pa(e,t){return null!=t.dataIndexInside?t.dataIndexInside:null!=t.dataIndex?E(t.dataIndex)?P(t.dataIndex,function(t){return e.indexOfRawIndex(t);}):e.indexOfRawIndex(t.dataIndex):null!=t.name?E(t.name)?P(t.name,function(t){return e.indexOfName(t);}):e.indexOfName(t.name):void 0;}function ga(){var e="__\0ec_inner_"+ma++ +"_"+Math.random().toFixed(5);return function(t){return t[e]||(t[e]={});};}var ma=0;function va(s,l,h){if(D(l)){var t={};t[l+"Index"]=0,l=t;}var e=h&&h.defaultMainType;!e||ya(l,e+"Index")||ya(l,e+"Id")||ya(l,e+"Name")||(l[e+"Index"]=0);var u={};return ia(l,function(t,e){t=l[e];if("dataIndex"!==e&&"dataIndexInside"!==e){var i=e.match(/^(\w+)(Index|Id|Name)$/)||[],n=i[1],a=(i[2]||"").toLowerCase();if(!(!n||!a||null==t||"index"===a&&"none"===t||h&&h.includeMainTypes&&L(h.includeMainTypes,n)<0)){var o={mainType:n};"index"===a&&"all"===t||(o[a]=t);var r=s.queryComponents(o);u[n+"Models"]=r,u[n+"Model"]=r[0];}}else u[e]=t;}),u;}function ya(t,e){return t&&t.hasOwnProperty(e);}function xa(t,e,i){t.setAttribute?t.setAttribute(e,i):t[e]=i;}var _a=".",wa="___EC__COMPONENT__CONTAINER___";function ba(t){var e={main:"",sub:""};return t&&(t=t.split(_a),e.main=t[0]||"",e.sub=t[1]||""),e;}function Sa(t,e){(t.$constructor=t).extend=function(t){var e=this,i=function i(){t.$constructor?t.$constructor.apply(this,arguments):e.apply(this,arguments);};return k(i.prototype,t),i.extend=this.extend,i.superCall=Ta,i.superApply=Da,_(i,this),i.superClass=e,i;};}var Ma=0;function Ia(t){var e=["__\0is_clz",Ma++,Math.random().toFixed(3)].join("_");t.prototype[e]=!0,t.isInstance=function(t){return!(!t||!t[e]);};}function Ta(t,e){var i=Z(arguments,2);return this.superClass.prototype[e].apply(t,i);}function Da(t,e,i){return this.superClass.prototype[e].apply(t,i);}function Aa(i,t){t=t||{};var a={};if(i.registerClass=function(t,e){if(e)if(j(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(i=e),'componentType "'+i+'" illegal'),(e=ba(e)).sub){if(e.sub!==wa){(function(t){var e=a[t.main];e&&e[wa]||((e=a[t.main]={})[wa]=!0);return e;})(e)[e.sub]=t;}}else a[e.main]=t;var i;return t;},i.getClass=function(t,e,i){var n=a[t];if(n&&n[wa]&&(n=e?n[e]:null),i&&!n)throw new Error(e?"Component "+t+"."+(e||"")+" not exists. Load it first.":t+".type should be specified.");return n;},i.getClassesByMainType=function(t){t=ba(t);var i=[],e=a[t.main];return e&&e[wa]?z(e,function(t,e){e!==wa&&i.push(t);}):i.push(e),i;},i.hasClass=function(t){return t=ba(t),!!a[t.main];},i.getAllClassMainTypes=function(){var i=[];return z(a,function(t,e){i.push(e);}),i;},i.hasSubTypes=function(t){t=ba(t);var e=a[t.main];return e&&e[wa];},i.parseClassType=ba,t.registerWhenExtend){var n=i.extend;n&&(i.extend=function(t){var e=n.call(this,t);return i.registerClass(e,t.type);});}return i;}var Ca=function Ca(s){for(var t=0;t<s.length;t++){s[t][1]||(s[t][1]=s[t][0]);}return function(t,e,i){for(var n={},a=0;a<s.length;a++){var o=s[a][1];if(!(e&&0<=L(e,o)||i&&L(i,o)<0)){var r=t.getShallow(o);null!=r&&(n[s[a][0]]=r);}}return n;};},La=Ca([["lineWidth","width"],["stroke","color"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"]]),ka={getLineStyle:function getLineStyle(t){var e=La(this,t),i=this.getLineDash(e.lineWidth);return i&&(e.lineDash=i),e;},getLineDash:function getLineDash(t){null==t&&(t=1);var e=this.get("type"),i=Math.max(t,2),n=4*t;return"solid"===e||null==e?null:"dashed"===e?[n,n]:[i,i];}},Pa=Ca([["fill","color"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["opacity"],["shadowColor"]]),Na={getAreaStyle:function getAreaStyle(t,e){return Pa(this,t,e);}},Oa=Math.pow,Ea=Math.sqrt,Ra=1e-8,za=1e-4,Ba=Ea(3),Va=1/3,Ga=nt(),Wa=nt(),Fa=nt();function Ha(t){return-Ra<t&&t<Ra;}function Za(t){return Ra<t||t<-Ra;}function Ua(t,e,i,n,a){var o=1-a;return o*o*(o*t+3*a*e)+a*a*(a*n+3*o*i);}function ja(t,e,i,n,a){var o=1-a;return 3*(((e-t)*o+2*(i-e)*a)*o+(n-i)*a*a);}function Xa(t,e,i,n,a){var o=6*i-12*e+6*t,r=9*e+3*n-3*t-9*i,s=3*e-3*t,l=0;if(Ha(r)){if(Za(o))0<=(u=-s/o)&&u<=1&&(a[l++]=u);}else{var h=o*o-4*r*s;if(Ha(h))a[0]=-o/(2*r);else if(0<h){var u,c=Ea(h),d=(-o-c)/(2*r);0<=(u=(-o+c)/(2*r))&&u<=1&&(a[l++]=u),0<=d&&d<=1&&(a[l++]=d);}}return l;}function Ya(t,e,i,n,a,o){var r=(e-t)*a+t,s=(i-e)*a+e,l=(n-i)*a+i,h=(s-r)*a+r,u=(l-s)*a+s,c=(u-h)*a+h;o[0]=t,o[1]=r,o[2]=h,o[3]=c,o[4]=c,o[5]=u,o[6]=l,o[7]=n;}function qa(t,e,i,n){var a=1-n;return a*(a*t+2*n*e)+n*n*i;}function Ka(t,e,i,n){return 2*((1-n)*(e-t)+n*(i-e));}function $a(t,e,i){var n=t+i-2*e;return 0===n?.5:(t-e)/n;}function Ja(t,e,i,n,a){var o=(e-t)*n+t,r=(i-e)*n+e,s=(r-o)*n+o;a[0]=t,a[1]=o,a[2]=s,a[3]=s,a[4]=r,a[5]=i;}var Qa=Math.min,to=Math.max,eo=Math.sin,io=Math.cos,no=2*Math.PI,ao=nt(),oo=nt(),ro=nt();function so(t,e,i){if(0!==t.length){var n,a=t[0],o=a[0],r=a[0],s=a[1],l=a[1];for(n=1;n<t.length;n++){a=t[n],o=Qa(o,a[0]),r=to(r,a[0]),s=Qa(s,a[1]),l=to(l,a[1]);}e[0]=o,e[1]=s,i[0]=r,i[1]=l;}}function lo(t,e,i,n,a,o){a[0]=Qa(t,i),a[1]=Qa(e,n),o[0]=to(t,i),o[1]=to(e,n);}var ho=[],uo=[];function co(t,e,i,n,a,o,r,s,l,h){var u,c=Xa,d=Ua,f=c(t,i,a,r,ho);for(l[0]=1/0,l[1]=1/0,h[0]=-1/0,h[1]=-1/0,u=0;u<f;u++){var p=d(t,i,a,r,ho[u]);l[0]=Qa(p,l[0]),h[0]=to(p,h[0]);}for(f=c(e,n,o,s,uo),u=0;u<f;u++){var g=d(e,n,o,s,uo[u]);l[1]=Qa(g,l[1]),h[1]=to(g,h[1]);}l[0]=Qa(t,l[0]),h[0]=to(t,h[0]),l[0]=Qa(r,l[0]),h[0]=to(r,h[0]),l[1]=Qa(e,l[1]),h[1]=to(e,h[1]),l[1]=Qa(s,l[1]),h[1]=to(s,h[1]);}function fo(t,e,i,n,a,o,r,s,l){var h=bt,u=St,c=Math.abs(a-o);if(c%no<1e-4&&1e-4<c)return s[0]=t-i,s[1]=e-n,l[0]=t+i,void(l[1]=e+n);if(ao[0]=io(a)*i+t,ao[1]=eo(a)*n+e,oo[0]=io(o)*i+t,oo[1]=eo(o)*n+e,h(s,ao,oo),u(l,ao,oo),(a%=no)<0&&(a+=no),(o%=no)<0&&(o+=no),o<a&&!r?o+=no:a<o&&r&&(a+=no),r){var d=o;o=a,a=d;}for(var f=0;f<o;f+=Math.PI/2){a<f&&(ro[0]=io(f)*i+t,ro[1]=eo(f)*n+e,h(s,ro,s),u(l,ro,l));}}var po={M:1,L:2,C:3,Q:4,A:5,Z:6,R:7},go=[],mo=[],vo=[],yo=[],xo=Math.min,_o=Math.max,wo=Math.cos,bo=Math.sin,So=Math.sqrt,Mo=Math.abs,Io="undefined"!=typeof Float32Array,To=function To(t){this._saveData=!t,this._saveData&&(this.data=[]),this._ctx=null;};function Do(t,e,i,n,a,o,r){if(0===a)return!1;var s=a,l=0;if(e+s<r&&n+s<r||r<e-s&&r<n-s||t+s<o&&i+s<o||o<t-s&&o<i-s)return!1;if(t===i)return Math.abs(o-t)<=s/2;var h=(l=(e-n)/(t-i))*o-r+(t*n-i*e)/(t-i);return h*h/(l*l+1)<=s/2*s/2;}function Ao(t,e,i,n,a,o,r,s,l,h,u){if(0===l)return!1;var c=l;return!(e+c<u&&n+c<u&&o+c<u&&s+c<u||u<e-c&&u<n-c&&u<o-c&&u<s-c||t+c<h&&i+c<h&&a+c<h&&r+c<h||h<t-c&&h<i-c&&h<a-c&&h<r-c)&&function(t,e,i,n,a,o,r,s,l,h,u){var c,d,f,p,g,m=.005,v=1/0;Ga[0]=l,Ga[1]=h;for(var y=0;y<1;y+=.05){Wa[0]=Ua(t,i,a,r,y),Wa[1]=Ua(e,n,o,s,y),(p=xt(Ga,Wa))<v&&(c=y,v=p);}v=1/0;for(var x=0;x<32&&!(m<za);x++){d=c-m,f=c+m,Wa[0]=Ua(t,i,a,r,d),Wa[1]=Ua(e,n,o,s,d),p=xt(Wa,Ga),0<=d&&p<v?(c=d,v=p):(Fa[0]=Ua(t,i,a,r,f),Fa[1]=Ua(e,n,o,s,f),g=xt(Fa,Ga),f<=1&&g<v?(c=f,v=g):m*=.5);}return u&&(u[0]=Ua(t,i,a,r,c),u[1]=Ua(e,n,o,s,c)),Ea(v);}(t,e,i,n,a,o,r,s,h,u,null)<=c/2;}function Co(t,e,i,n,a,o,r,s,l){if(0===r)return!1;var h=r;return!(e+h<l&&n+h<l&&o+h<l||l<e-h&&l<n-h&&l<o-h||t+h<s&&i+h<s&&a+h<s||s<t-h&&s<i-h&&s<a-h)&&function(t,e,i,n,a,o,r,s,l){var h,u=.005,c=1/0;Ga[0]=r,Ga[1]=s;for(var d=0;d<1;d+=.05){Wa[0]=qa(t,i,a,d),Wa[1]=qa(e,n,o,d),(m=xt(Ga,Wa))<c&&(h=d,c=m);}c=1/0;for(var f=0;f<32&&!(u<za);f++){var p=h-u,g=h+u;Wa[0]=qa(t,i,a,p),Wa[1]=qa(e,n,o,p);var m=xt(Wa,Ga);if(0<=p&&m<c)h=p,c=m;else{Fa[0]=qa(t,i,a,g),Fa[1]=qa(e,n,o,g);var v=xt(Fa,Ga);g<=1&&v<c?(h=g,c=v):u*=.5;}}return l&&(l[0]=qa(t,i,a,h),l[1]=qa(e,n,o,h)),Ea(c);}(t,e,i,n,a,o,s,l,null)<=h/2;}To.prototype={constructor:To,_xi:0,_yi:0,_x0:0,_y0:0,_ux:0,_uy:0,_len:0,_lineDash:null,_dashOffset:0,_dashIdx:0,_dashSum:0,setScale:function setScale(t,e){this._ux=Mo(1/He/t)||0,this._uy=Mo(1/He/e)||0;},getContext:function getContext(){return this._ctx;},beginPath:function beginPath(t){return(this._ctx=t)&&t.beginPath(),t&&(this.dpr=t.dpr),this._saveData&&(this._len=0),this._lineDash&&(this._lineDash=null,this._dashOffset=0),this;},moveTo:function moveTo(t,e){return this.addData(po.M,t,e),this._ctx&&this._ctx.moveTo(t,e),this._x0=t,this._y0=e,this._xi=t,this._yi=e,this;},lineTo:function lineTo(t,e){var i=Mo(t-this._xi)>this._ux||Mo(e-this._yi)>this._uy||this._len<5;return this.addData(po.L,t,e),this._ctx&&i&&(this._needsDash()?this._dashedLineTo(t,e):this._ctx.lineTo(t,e)),i&&(this._xi=t,this._yi=e),this;},bezierCurveTo:function bezierCurveTo(t,e,i,n,a,o){return this.addData(po.C,t,e,i,n,a,o),this._ctx&&(this._needsDash()?this._dashedBezierTo(t,e,i,n,a,o):this._ctx.bezierCurveTo(t,e,i,n,a,o)),this._xi=a,this._yi=o,this;},quadraticCurveTo:function quadraticCurveTo(t,e,i,n){return this.addData(po.Q,t,e,i,n),this._ctx&&(this._needsDash()?this._dashedQuadraticTo(t,e,i,n):this._ctx.quadraticCurveTo(t,e,i,n)),this._xi=i,this._yi=n,this;},arc:function arc(t,e,i,n,a,o){return this.addData(po.A,t,e,i,i,n,a-n,0,o?0:1),this._ctx&&this._ctx.arc(t,e,i,n,a,o),this._xi=wo(a)*i+t,this._yi=bo(a)*i+t,this;},arcTo:function arcTo(t,e,i,n,a){return this._ctx&&this._ctx.arcTo(t,e,i,n,a),this;},rect:function rect(t,e,i,n){return this._ctx&&this._ctx.rect(t,e,i,n),this.addData(po.R,t,e,i,n),this;},closePath:function closePath(){this.addData(po.Z);var t=this._ctx,e=this._x0,i=this._y0;return t&&(this._needsDash()&&this._dashedLineTo(e,i),t.closePath()),this._xi=e,this._yi=i,this;},fill:function fill(t){t&&t.fill(),this.toStatic();},stroke:function stroke(t){t&&t.stroke(),this.toStatic();},setLineDash:function setLineDash(t){if(t instanceof Array){this._lineDash=t;for(var e=this._dashIdx=0,i=0;i<t.length;i++){e+=t[i];}this._dashSum=e;}return this;},setLineDashOffset:function setLineDashOffset(t){return this._dashOffset=t,this;},len:function len(){return this._len;},setData:function setData(t){var e=t.length;this.data&&this.data.length==e||!Io||(this.data=new Float32Array(e));for(var i=0;i<e;i++){this.data[i]=t[i];}this._len=e;},appendPath:function appendPath(t){t instanceof Array||(t=[t]);for(var e=t.length,i=0,n=this._len,a=0;a<e;a++){i+=t[a].len();}Io&&this.data instanceof Float32Array&&(this.data=new Float32Array(n+i));for(a=0;a<e;a++){for(var o=t[a].data,r=0;r<o.length;r++){this.data[n++]=o[r];}}this._len=n;},addData:function addData(t){if(this._saveData){var e=this.data;this._len+arguments.length>e.length&&(this._expandData(),e=this.data);for(var i=0;i<arguments.length;i++){e[this._len++]=arguments[i];}this._prevCmd=t;}},_expandData:function _expandData(){if(!(this.data instanceof Array)){for(var t=[],e=0;e<this._len;e++){t[e]=this.data[e];}this.data=t;}},_needsDash:function _needsDash(){return this._lineDash;},_dashedLineTo:function _dashedLineTo(t,e){var i,n,a=this._dashSum,o=this._dashOffset,r=this._lineDash,s=this._ctx,l=this._xi,h=this._yi,u=t-l,c=e-h,d=So(u*u+c*c),f=l,p=h,g=r.length;for(o<0&&(o=a+o),f-=(o%=a)*(u/=d),p-=o*(c/=d);0<u&&f<=t||u<0&&t<=f||0==u&&(0<c&&p<=e||c<0&&e<=p);){f+=u*(i=r[n=this._dashIdx]),p+=c*i,this._dashIdx=(n+1)%g,0<u&&f<l||u<0&&l<f||0<c&&p<h||c<0&&h<p||s[n%2?"moveTo":"lineTo"](0<=u?xo(f,t):_o(f,t),0<=c?xo(p,e):_o(p,e));}u=f-t,c=p-e,this._dashOffset=-So(u*u+c*c);},_dashedBezierTo:function _dashedBezierTo(t,e,i,n,a,o){var r,s,l,h,u,c=this._dashSum,d=this._dashOffset,f=this._lineDash,p=this._ctx,g=this._xi,m=this._yi,v=Ua,y=0,x=this._dashIdx,_=f.length,w=0;for(d<0&&(d=c+d),d%=c,r=0;r<1;r+=.1){s=v(g,t,i,a,r+.1)-v(g,t,i,a,r),l=v(m,e,n,o,r+.1)-v(m,e,n,o,r),y+=So(s*s+l*l);}for(;x<_&&!(d<(w+=f[x]));x++){}for(r=(w-d)/y;r<=1;){h=v(g,t,i,a,r),u=v(m,e,n,o,r),x%2?p.moveTo(h,u):p.lineTo(h,u),r+=f[x]/y,x=(x+1)%_;}x%2!=0&&p.lineTo(a,o),s=a-h,l=o-u,this._dashOffset=-So(s*s+l*l);},_dashedQuadraticTo:function _dashedQuadraticTo(t,e,i,n){var a=i,o=n;i=(i+2*t)/3,n=(n+2*e)/3,t=(this._xi+2*t)/3,e=(this._yi+2*e)/3,this._dashedBezierTo(t,e,i,n,a,o);},toStatic:function toStatic(){var t=this.data;t instanceof Array&&(t.length=this._len,Io&&(this.data=new Float32Array(t)));},getBoundingRect:function getBoundingRect(){go[0]=go[1]=vo[0]=vo[1]=Number.MAX_VALUE,mo[0]=mo[1]=yo[0]=yo[1]=-Number.MAX_VALUE;for(var t,e,i,n,a,o,r,s,l,h,u,c,d,f,p=this.data,g=0,m=0,v=0,y=0,x=0;x<p.length;){var _=p[x++];switch(1==x&&(v=g=p[x],y=m=p[x+1]),_){case po.M:g=v=p[x++],m=y=p[x++],vo[0]=v,vo[1]=y,yo[0]=v,yo[1]=y;break;case po.L:lo(g,m,p[x],p[x+1],vo,yo),g=p[x++],m=p[x++];break;case po.C:co(g,m,p[x++],p[x++],p[x++],p[x++],p[x],p[x+1],vo,yo),g=p[x++],m=p[x++];break;case po.Q:t=g,e=m,i=p[x++],n=p[x++],a=p[x],o=p[x+1],r=vo,s=yo,h=l=void 0,h=qa,u=to(Qa((l=$a)(t,i,a),1),0),c=to(Qa(l(e,n,o),1),0),d=h(t,i,a,u),f=h(e,n,o,c),r[0]=Qa(t,a,d),r[1]=Qa(e,o,f),s[0]=to(t,a,d),s[1]=to(e,o,f),g=p[x++],m=p[x++];break;case po.A:var w=p[x++],b=p[x++],S=p[x++],M=p[x++],I=p[x++],T=p[x++]+I,D=(p[x++],1-p[x++]);1==x&&(v=wo(I)*S+w,y=bo(I)*M+b),fo(w,b,S,M,I,T,D,vo,yo),g=wo(T)*S+w,m=bo(T)*M+b;break;case po.R:lo(v=g=p[x++],y=m=p[x++],v+p[x++],y+p[x++],vo,yo);break;case po.Z:g=v,m=y;}bt(go,go,vo),St(mo,mo,yo);}return 0===x&&(go[0]=go[1]=mo[0]=mo[1]=0),new ei(go[0],go[1],mo[0]-go[0],mo[1]-go[1]);},rebuildPath:function rebuildPath(t){for(var e,i,n,a,o,r,s=this.data,l=this._ux,h=this._uy,u=this._len,c=0;c<u;){var d=s[c++];switch(1==c&&(e=n=s[c],i=a=s[c+1]),d){case po.M:e=n=s[c++],i=a=s[c++],t.moveTo(n,a);break;case po.L:o=s[c++],r=s[c++],(Mo(o-n)>l||Mo(r-a)>h||c===u-1)&&(t.lineTo(o,r),n=o,a=r);break;case po.C:t.bezierCurveTo(s[c++],s[c++],s[c++],s[c++],s[c++],s[c++]),n=s[c-2],a=s[c-1];break;case po.Q:t.quadraticCurveTo(s[c++],s[c++],s[c++],s[c++]),n=s[c-2],a=s[c-1];break;case po.A:var f=s[c++],p=s[c++],g=s[c++],m=s[c++],v=s[c++],y=s[c++],x=s[c++],_=s[c++],w=m<g?g:m,b=m<g?1:g/m,S=m<g?m/g:1,M=v+y;.001<Math.abs(g-m)?(t.translate(f,p),t.rotate(x),t.scale(b,S),t.arc(0,0,w,v,M,1-_),t.scale(1/b,1/S),t.rotate(-x),t.translate(-f,-p)):t.arc(f,p,w,v,M,1-_),1==c&&(e=wo(v)*g+f,i=bo(v)*m+p),n=wo(M)*g+f,a=bo(M)*m+p;break;case po.R:e=n=s[c],i=a=s[c+1],t.rect(s[c++],s[c++],s[c++],s[c++]);break;case po.Z:t.closePath(),n=e,a=i;}}}},To.CMD=po;var Lo=2*Math.PI;function ko(t){return(t%=Lo)<0&&(t+=Lo),t;}var Po=2*Math.PI;function No(t,e,i,n,a,o,r,s,l){if(0===r)return!1;var h=r;s-=t,l-=e;var u=Math.sqrt(s*s+l*l);if(i<u-h||u+h<i)return!1;if(Math.abs(n-a)%Po<1e-4)return!0;if(o){var c=n;n=ko(a),a=ko(c);}else n=ko(n),a=ko(a);a<n&&(a+=Po);var d=Math.atan2(l,s);return d<0&&(d+=Po),n<=d&&d<=a||n<=d+Po&&d+Po<=a;}function Oo(t,e,i,n,a,o){if(e<o&&n<o||o<e&&o<n)return 0;if(n===e)return 0;var r=n<e?1:-1,s=(o-e)/(n-e);return 1!==s&&0!==s||(r=n<e?.5:-.5),a<s*(i-t)+t?r:0;}var Eo=To.CMD,Ro=2*Math.PI,zo=1e-4;var Bo=[-1,-1,-1],Vo=[-1,-1];function Go(t,e,i,n,a,o,r,s,l,h){if(e<h&&n<h&&o<h&&s<h||h<e&&h<n&&h<o&&h<s)return 0;var u,c=function(t,e,i,n,a,o){var r=n+3*(e-i)-t,s=3*(i-2*e+t),l=3*(e-t),h=t-a,u=s*s-3*r*l,c=s*l-9*r*h,d=l*l-3*s*h,f=0;if(Ha(u)&&Ha(c))Ha(s)?o[0]=0:0<=(M=-l/s)&&M<=1&&(o[f++]=M);else{var p=c*c-4*u*d;if(Ha(p)){var g=c/u,m=-g/2;0<=(M=-s/r+g)&&M<=1&&(o[f++]=M),0<=m&&m<=1&&(o[f++]=m);}else if(0<p){var v=Ea(p),y=u*s+1.5*r*(-c+v),x=u*s+1.5*r*(-c-v);0<=(M=(-s-((y=y<0?-Oa(-y,Va):Oa(y,Va))+(x=x<0?-Oa(-x,Va):Oa(x,Va))))/(3*r))&&M<=1&&(o[f++]=M);}else{var _=(2*u*s-3*r*c)/(2*Ea(u*u*u)),w=Math.acos(_)/3,b=Ea(u),S=Math.cos(w),M=(-s-2*b*S)/(3*r),I=(m=(-s+b*(S+Ba*Math.sin(w)))/(3*r),(-s+b*(S-Ba*Math.sin(w)))/(3*r));0<=M&&M<=1&&(o[f++]=M),0<=m&&m<=1&&(o[f++]=m),0<=I&&I<=1&&(o[f++]=I);}}return f;}(e,n,o,s,h,Bo);if(0===c)return 0;for(var d,f,p=0,g=-1,m=0;m<c;m++){var v=Bo[m],y=0===v||1===v?.5:1;Ua(t,i,a,r,v)<l||(g<0&&(g=Xa(e,n,o,s,Vo),Vo[1]<Vo[0]&&1<g&&(void 0,u=Vo[0],Vo[0]=Vo[1],Vo[1]=u),d=Ua(e,n,o,s,Vo[0]),1<g&&(f=Ua(e,n,o,s,Vo[1]))),2==g?v<Vo[0]?p+=d<e?y:-y:v<Vo[1]?p+=f<d?y:-y:p+=s<f?y:-y:v<Vo[0]?p+=d<e?y:-y:p+=s<d?y:-y);}return p;}function Wo(t,e,i,n,a,o,r,s){if(e<s&&n<s&&o<s||s<e&&s<n&&s<o)return 0;var l=function(t,e,i,n,a){var o=t-2*e+i,r=2*(e-t),s=t-n,l=0;if(Ha(o))Za(r)&&0<=(u=-s/r)&&u<=1&&(a[l++]=u);else{var h=r*r-4*o*s;if(Ha(h))0<=(u=-r/(2*o))&&u<=1&&(a[l++]=u);else if(0<h){var u,c=Ea(h),d=(-r-c)/(2*o);0<=(u=(-r+c)/(2*o))&&u<=1&&(a[l++]=u),0<=d&&d<=1&&(a[l++]=d);}}return l;}(e,n,o,s,Bo);if(0===l)return 0;var h=$a(e,n,o);if(0<=h&&h<=1){for(var u=0,c=qa(e,n,o,h),d=0;d<l;d++){var f=0===Bo[d]||1===Bo[d]?.5:1;qa(t,i,a,Bo[d])<r||(Bo[d]<h?u+=c<e?f:-f:u+=o<c?f:-f);}return u;}f=0===Bo[0]||1===Bo[0]?.5:1;return qa(t,i,a,Bo[0])<r?0:o<e?f:-f;}function Fo(t,e,i,n,a,o,r,s){if(i<(s-=e)||s<-i)return 0;var l=Math.sqrt(i*i-s*s);Bo[0]=-l,Bo[1]=l;var h=Math.abs(n-a);if(h<1e-4)return 0;if(h%Ro<1e-4){a=Ro;var u=o?1:-1;return r>=Bo[n=0]+t&&r<=Bo[1]+t?u:0;}if(o){l=n;n=ko(a),a=ko(l);}else n=ko(n),a=ko(a);a<n&&(a+=Ro);for(var c=0,d=0;d<2;d++){var f=Bo[d];if(r<f+t){var p=Math.atan2(s,f);u=o?1:-1;p<0&&(p=Ro+p),(n<=p&&p<=a||n<=p+Ro&&p+Ro<=a)&&(p>Math.PI/2&&p<1.5*Math.PI&&(u=-u),c+=u);}}return c;}function Ho(t,e,i,n,a){for(var o,r,s=0,l=0,h=0,u=0,c=0,d=0;d<t.length;){var f=t[d++];switch(f===Eo.M&&1<d&&(i||(s+=Oo(l,h,u,c,n,a))),1==d&&(u=l=t[d],c=h=t[d+1]),f){case Eo.M:l=u=t[d++],h=c=t[d++];break;case Eo.L:if(i){if(Do(l,h,t[d],t[d+1],e,n,a))return!0;}else s+=Oo(l,h,t[d],t[d+1],n,a)||0;l=t[d++],h=t[d++];break;case Eo.C:if(i){if(Ao(l,h,t[d++],t[d++],t[d++],t[d++],t[d],t[d+1],e,n,a))return!0;}else s+=Go(l,h,t[d++],t[d++],t[d++],t[d++],t[d],t[d+1],n,a)||0;l=t[d++],h=t[d++];break;case Eo.Q:if(i){if(Co(l,h,t[d++],t[d++],t[d],t[d+1],e,n,a))return!0;}else s+=Wo(l,h,t[d++],t[d++],t[d],t[d+1],n,a)||0;l=t[d++],h=t[d++];break;case Eo.A:var p=t[d++],g=t[d++],m=t[d++],v=t[d++],y=t[d++],x=t[d++],_=(t[d++],1-t[d++]),w=Math.cos(y)*m+p,b=Math.sin(y)*v+g;1<d?s+=Oo(l,h,w,b,n,a):(u=w,c=b);var S=(n-p)*v/m+p;if(i){if(No(p,g,v,y,y+x,_,e,S,a))return!0;}else s+=Fo(p,g,v,y,y+x,_,S,a);l=Math.cos(y+x)*m+p,h=Math.sin(y+x)*v+g;break;case Eo.R:u=l=t[d++],c=h=t[d++];w=u+t[d++],b=c+t[d++];if(i){if(Do(u,c,w,c,e,n,a)||Do(w,c,w,b,e,n,a)||Do(w,b,u,b,e,n,a)||Do(u,b,u,c,e,n,a))return!0;}else s+=Oo(w,c,w,b,n,a),s+=Oo(u,b,u,c,n,a);break;case Eo.Z:if(i){if(Do(l,h,u,c,e,n,a))return!0;}else s+=Oo(l,h,u,c,n,a);l=u,h=c;}}return i||(o=h,r=c,Math.abs(o-r)<zo)||(s+=Oo(l,h,u,c,n,a)||0),0!==s;}var Zo=bi.prototype.getCanvasPattern,Uo=Math.abs,jo=new To(!0);function Xo(t){xn.call(this,t),this.path=null;}Xo.prototype={constructor:Xo,type:"path",__dirtyPath:!0,strokeContainThreshold:5,brush:function brush(t,e){var i,n=this.style,a=this.path||jo,o=n.hasStroke(),r=n.hasFill(),s=n.fill,l=n.stroke,h=r&&!!s.colorStops,u=o&&!!l.colorStops,c=r&&!!s.image,d=o&&!!l.image;(n.bind(t,this,e),this.setTransform(t),this.__dirty)&&(h&&(i=i||this.getBoundingRect(),this._fillGradient=n.getGradient(t,s,i)),u&&(i=i||this.getBoundingRect(),this._strokeGradient=n.getGradient(t,l,i)));h?t.fillStyle=this._fillGradient:c&&(t.fillStyle=Zo.call(s,t)),u?t.strokeStyle=this._strokeGradient:d&&(t.strokeStyle=Zo.call(l,t));var f=n.lineDash,p=n.lineDashOffset,g=!!t.setLineDash,m=this.getGlobalScale();a.setScale(m[0],m[1]),this.__dirtyPath||f&&!g&&o?(a.beginPath(t),f&&!g&&(a.setLineDash(f),a.setLineDashOffset(p)),this.buildPath(a,this.shape,!1),this.path&&(this.__dirtyPath=!1)):(t.beginPath(),this.path.rebuildPath(t)),r&&a.fill(t),f&&g&&(t.setLineDash(f),t.lineDashOffset=p),o&&a.stroke(t),f&&g&&t.setLineDash([]),null!=n.text&&(this.restoreTransform(t),this.drawRectText(t,this.getBoundingRect()));},buildPath:function buildPath(t,e,i){},createPathProxy:function createPathProxy(){this.path=new To();},getBoundingRect:function getBoundingRect(){var t=this._rect,e=this.style,i=!t;if(i){var n=this.path;n||(n=this.path=new To()),this.__dirtyPath&&(n.beginPath(),this.buildPath(n,this.shape,!1)),t=n.getBoundingRect();}if(this._rect=t,e.hasStroke()){var a=this._rectWithStroke||(this._rectWithStroke=t.clone());if(this.__dirty||i){a.copy(t);var o=e.lineWidth,r=e.strokeNoScale?this.getLineScale():1;e.hasFill()||(o=Math.max(o,this.strokeContainThreshold||4)),1e-10<r&&(a.width+=o/r,a.height+=o/r,a.x-=o/r/2,a.y-=o/r/2);}return a;}return t;},contain:function contain(t,e){var i=this.transformCoordToLocal(t,e),n=this.getBoundingRect(),a=this.style;if(t=i[0],e=i[1],n.contain(t,e)){var o=this.path.data;if(a.hasStroke()){var r=a.lineWidth,s=a.strokeNoScale?this.getLineScale():1;if(1e-10<s&&(a.hasFill()||(r=Math.max(r,this.strokeContainThreshold)),Ho(o,r/s,!0,t,e)))return!0;}if(a.hasFill())return Ho(o,0,!1,t,e);}return!1;},dirty:function dirty(t){null==t&&(t=!0),t&&(this.__dirtyPath=t,this._rect=null),this.__dirty=!0,this.__zr&&this.__zr.refresh(),this.__clipTarget&&this.__clipTarget.dirty();},animateShape:function animateShape(t){return this.animate("shape",t);},attrKV:function attrKV(t,e){"shape"===t?(this.setShape(e),this.__dirtyPath=!0,this._rect=null):xn.prototype.attrKV.call(this,t,e);},setShape:function setShape(t,e){var i=this.shape;if(i){if(R(t))for(var n in t){t.hasOwnProperty(n)&&(i[n]=t[n]);}else i[t]=e;this.dirty(!0);}return this;},getLineScale:function getLineScale(){var t=this.transform;return t&&1e-10<Uo(t[0]-1)&&1e-10<Uo(t[3]-1)?Math.sqrt(Uo(t[0]*t[3]-t[2]*t[1])):1;}},Xo.extend=function(a){var t=function t(_t2){Xo.call(this,_t2),a.style&&this.style.extendFrom(a.style,!1);var e=a.shape;if(e){this.shape=this.shape||{};var i=this.shape;for(var n in e){!i.hasOwnProperty(n)&&e.hasOwnProperty(n)&&(i[n]=e[n]);}}a.init&&a.init.call(this,_t2);};for(var e in _(t,Xo),a){"style"!==e&&"shape"!==e&&(t.prototype[e]=a[e]);}return t;},_(Xo,xn);var Yo=To.CMD,qo=[[],[],[]],Ko=Math.sqrt,$o=Math.atan2,Jo=function Jo(t,e){var i,n,a,o,r,s=t.data,l=Yo.M,h=Yo.C,u=Yo.L,c=Yo.R,d=Yo.A,f=Yo.Q;for(o=a=0;a<s.length;){switch(i=s[a++],o=a,n=0,i){case l:case u:n=1;break;case h:n=3;break;case f:n=2;break;case d:var p=e[4],g=e[5],m=Ko(e[0]*e[0]+e[1]*e[1]),v=Ko(e[2]*e[2]+e[3]*e[3]),y=$o(-e[1]/v,e[0]/m);s[a]*=m,s[a++]+=p,s[a]*=v,s[a++]+=g,s[a++]*=m,s[a++]*=v,s[a++]+=y,s[a++]+=y,o=a+=2;break;case c:x[0]=s[a++],x[1]=s[a++],wt(x,x,e),s[o++]=x[0],s[o++]=x[1],x[0]+=s[a++],x[1]+=s[a++],wt(x,x,e),s[o++]=x[0],s[o++]=x[1];}for(r=0;r<n;r++){var x;(x=qo[r])[0]=s[a++],x[1]=s[a++],wt(x,x,e),s[o++]=x[0],s[o++]=x[1];}}},Qo=["m","M","l","L","v","V","h","H","z","Z","c","C","q","Q","t","T","s","S","a","A"],tr=Math.sqrt,er=Math.sin,ir=Math.cos,nr=Math.PI,ar=function ar(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]);},or=function or(t,e){return(t[0]*e[0]+t[1]*e[1])/(ar(t)*ar(e));},rr=function rr(t,e){return(t[0]*e[1]<t[1]*e[0]?-1:1)*Math.acos(or(t,e));};function sr(t,e,i,n,a,o,r,s,l,h,u){var c=l*(nr/180),d=ir(c)*(t-i)/2+er(c)*(e-n)/2,f=-1*er(c)*(t-i)/2+ir(c)*(e-n)/2,p=d*d/(r*r)+f*f/(s*s);1<p&&(r*=tr(p),s*=tr(p));var g=(a===o?-1:1)*tr((r*r*(s*s)-r*r*(f*f)-s*s*(d*d))/(r*r*(f*f)+s*s*(d*d)))||0,m=g*r*f/s,v=g*-s*d/r,y=(t+i)/2+ir(c)*m-er(c)*v,x=(e+n)/2+er(c)*m+ir(c)*v,_=rr([1,0],[(d-m)/r,(f-v)/s]),w=[(d-m)/r,(f-v)/s],b=[(-1*d-m)/r,(-1*f-v)/s],S=rr(w,b);or(w,b)<=-1&&(S=nr),1<=or(w,b)&&(S=0),0===o&&0<S&&(S-=2*nr),1===o&&S<0&&(S+=2*nr),u.addData(h,y,x,r,s,_,S,c,o);}function lr(t,e){var i=function(t){if(!t)return[];var e,i=t.replace(/-/g," -").replace(/  /g," ").replace(/ /g,",").replace(/,,/g,",");for(e=0;e<Qo.length;e++){i=i.replace(new RegExp(Qo[e],"g"),"|"+Qo[e]);}var n,a=i.split("|"),o=0,r=0,s=new To(),l=To.CMD;for(e=1;e<a.length;e++){var h,u=a[e],c=u.charAt(0),d=0,f=u.slice(1).replace(/e,-/g,"e-").split(",");0<f.length&&""===f[0]&&f.shift();for(var p=0;p<f.length;p++){f[p]=parseFloat(f[p]);}for(;d<f.length&&!isNaN(f[d])&&!isNaN(f[0]);){var g,m,v,y,x,_,w,b=o,S=r;switch(c){case"l":o+=f[d++],r+=f[d++],h=l.L,s.addData(h,o,r);break;case"L":o=f[d++],r=f[d++],h=l.L,s.addData(h,o,r);break;case"m":o+=f[d++],r+=f[d++],h=l.M,s.addData(h,o,r),c="l";break;case"M":o=f[d++],r=f[d++],h=l.M,s.addData(h,o,r),c="L";break;case"h":o+=f[d++],h=l.L,s.addData(h,o,r);break;case"H":o=f[d++],h=l.L,s.addData(h,o,r);break;case"v":r+=f[d++],h=l.L,s.addData(h,o,r);break;case"V":r=f[d++],h=l.L,s.addData(h,o,r);break;case"C":h=l.C,s.addData(h,f[d++],f[d++],f[d++],f[d++],f[d++],f[d++]),o=f[d-2],r=f[d-1];break;case"c":h=l.C,s.addData(h,f[d++]+o,f[d++]+r,f[d++]+o,f[d++]+r,f[d++]+o,f[d++]+r),o+=f[d-2],r+=f[d-1];break;case"S":g=o,m=r;var M=s.len(),I=s.data;n===l.C&&(g+=o-I[M-4],m+=r-I[M-3]),h=l.C,b=f[d++],S=f[d++],o=f[d++],r=f[d++],s.addData(h,g,m,b,S,o,r);break;case"s":g=o,m=r,M=s.len(),I=s.data,n===l.C&&(g+=o-I[M-4],m+=r-I[M-3]),h=l.C,b=o+f[d++],S=r+f[d++],o+=f[d++],r+=f[d++],s.addData(h,g,m,b,S,o,r);break;case"Q":b=f[d++],S=f[d++],o=f[d++],r=f[d++],h=l.Q,s.addData(h,b,S,o,r);break;case"q":b=f[d++]+o,S=f[d++]+r,o+=f[d++],r+=f[d++],h=l.Q,s.addData(h,b,S,o,r);break;case"T":g=o,m=r,M=s.len(),I=s.data,n===l.Q&&(g+=o-I[M-4],m+=r-I[M-3]),o=f[d++],r=f[d++],h=l.Q,s.addData(h,g,m,o,r);break;case"t":g=o,m=r,M=s.len(),I=s.data,n===l.Q&&(g+=o-I[M-4],m+=r-I[M-3]),o+=f[d++],r+=f[d++],h=l.Q,s.addData(h,g,m,o,r);break;case"A":v=f[d++],y=f[d++],x=f[d++],_=f[d++],w=f[d++],sr(b=o,S=r,o=f[d++],r=f[d++],_,w,v,y,x,h=l.A,s);break;case"a":v=f[d++],y=f[d++],x=f[d++],_=f[d++],w=f[d++],sr(b=o,S=r,o+=f[d++],r+=f[d++],_,w,v,y,x,h=l.A,s);}}"z"!==c&&"Z"!==c||(h=l.Z,s.addData(h)),n=h;}return s.toStatic(),s;}(t);return(e=e||{}).buildPath=function(t){if(t.setData){t.setData(i.data),(e=t.getContext())&&t.rebuildPath(e);}else{var e=t;i.rebuildPath(e);}},e.applyTransform=function(t){Jo(i,t),this.dirty(!0);},e;}var hr=function hr(t){xn.call(this,t);};hr.prototype={constructor:hr,type:"text",brush:function brush(t,e){var i=this.style;this.__dirty&&en(i),i.fill=i.stroke=i.shadowBlur=i.shadowColor=i.shadowOffsetX=i.shadowOffsetY=null;var n=i.text;null!=n&&(n+=""),i.bind(t,this,e),mn(n,i)&&(this.setTransform(t),an(this,t,n,i),this.restoreTransform(t));},getBoundingRect:function getBoundingRect(){var t=this.style;if(this.__dirty&&en(t),!this._rect){var e=t.text;null!=e?e+="":e="";var i=Vi(t.text+"",t.font,t.textAlign,t.textVerticalAlign,t.textPadding,t.rich);if(i.x+=t.x||0,i.y+=t.y||0,dn(t.textStroke,t.textStrokeWidth)){var n=t.textStrokeWidth;i.x-=n/2,i.y-=n/2,i.width+=n,i.height+=n;}this._rect=i;}return this._rect;}},_(hr,xn);var ur=Xo.extend({type:"circle",shape:{cx:0,cy:0,r:0},buildPath:function buildPath(t,e,i){i&&t.moveTo(e.cx+e.r,e.cy),t.arc(e.cx,e.cy,e.r,0,2*Math.PI,!0);}}),cr=[["shadowBlur",0],["shadowColor","#000"],["shadowOffsetX",0],["shadowOffsetY",0]],dr=function dr(l){return v.browser.ie&&11<=v.browser.version?function(){var t,e=this.__clipPaths,i=this.style;if(e)for(var n=0;n<e.length;n++){var a=e[n],o=a&&a.shape,r=a&&a.type;if(o&&("sector"===r&&o.startAngle===o.endAngle||"rect"===r&&(!o.width||!o.height))){for(var s=0;s<cr.length;s++){cr[s][2]=i[cr[s][0]],i[cr[s][0]]=cr[s][1];}t=!0;break;}}if(l.apply(this,arguments),t)for(s=0;s<cr.length;s++){i[cr[s][0]]=cr[s][2];}}:l;},fr=Xo.extend({type:"sector",shape:{cx:0,cy:0,r0:0,r:0,startAngle:0,endAngle:2*Math.PI,clockwise:!0},brush:dr(Xo.prototype.brush),buildPath:function buildPath(t,e){var i=e.cx,n=e.cy,a=Math.max(e.r0||0,0),o=Math.max(e.r,0),r=e.startAngle,s=e.endAngle,l=e.clockwise,h=Math.cos(r),u=Math.sin(r);t.moveTo(h*a+i,u*a+n),t.lineTo(h*o+i,u*o+n),t.arc(i,n,o,r,s,!l),t.lineTo(Math.cos(s)*a+i,Math.sin(s)*a+n),0!==a&&t.arc(i,n,a,s,r,l),t.closePath();}}),pr=Xo.extend({type:"ring",shape:{cx:0,cy:0,r:0,r0:0},buildPath:function buildPath(t,e){var i=e.cx,n=e.cy,a=2*Math.PI;t.moveTo(i+e.r,n),t.arc(i,n,e.r,0,a,!1),t.moveTo(i+e.r0,n),t.arc(i,n,e.r0,0,a,!0);}});function gr(t,e,i,n,a,o,r){var s=.5*(i-t),l=.5*(n-e);return(2*(e-i)+s+l)*r+(-3*(e-i)-2*s-l)*o+s*a+e;}var mr=function mr(t,e){for(var i=t.length,n=[],a=0,o=1;o<i;o++){a+=mt(t[o-1],t[o]);}var r=a/2;r=r<i?i:r;for(o=0;o<r;o++){var s,l,h,u=o/(r-1)*(e?i:i-1),c=Math.floor(u),d=u-c,f=t[c%i];e?(s=t[(c-1+i)%i],l=t[(c+1)%i],h=t[(c+2)%i]):(s=t[0===c?c:c-1],l=t[i-2<c?i-1:c+1],h=t[i-3<c?i-1:c+2]);var p=d*d,g=d*p;n.push([gr(s[0],f[0],l[0],h[0],d,p,g),gr(s[1],f[1],l[1],h[1],d,p,g)]);}return n;},vr=function vr(t,e,i,n){var a,o,r,s,l=[],h=[],u=[],c=[];if(n){r=[1/0,1/0],s=[-1/0,-1/0];for(var d=0,f=t.length;d<f;d++){bt(r,r,t[d]),St(s,s,t[d]);}bt(r,r,n[0]),St(s,s,n[1]);}for(d=0,f=t.length;d<f;d++){var p=t[d];if(i)a=t[d?d-1:f-1],o=t[(d+1)%f];else{if(0===d||d===f-1){l.push(ot(t[d]));continue;}a=t[d-1],o=t[d+1];}ht(h,o,a),pt(h,h,e);var g=mt(p,a),m=mt(p,o),v=g+m;0!==v&&(g/=v,m/=v),pt(u,h,-g),pt(c,h,m);var y=st([],p,u),x=st([],p,c);n&&(St(y,y,r),bt(y,y,s),St(x,x,r),bt(x,x,s)),l.push(y),l.push(x);}return i&&l.push(l.shift()),l;};function yr(t,e,i){var n=e.points,a=e.smooth;if(n&&2<=n.length){if(a&&"spline"!==a){var o=vr(n,a,i,e.smoothConstraint);t.moveTo(n[0][0],n[0][1]);for(var r=n.length,s=0;s<(i?r:r-1);s++){var l=o[2*s],h=o[2*s+1],u=n[(s+1)%r];t.bezierCurveTo(l[0],l[1],h[0],h[1],u[0],u[1]);}}else{"spline"===a&&(n=mr(n,i)),t.moveTo(n[0][0],n[0][1]);s=1;for(var c=n.length;s<c;s++){t.lineTo(n[s][0],n[s][1]);}}i&&t.closePath();}}var xr=Xo.extend({type:"polygon",shape:{points:null,smooth:!1,smoothConstraint:null},buildPath:function buildPath(t,e){yr(t,e,!0);}}),_r=Xo.extend({type:"polyline",shape:{points:null,smooth:!1,smoothConstraint:null},style:{stroke:"#000",fill:null},buildPath:function buildPath(t,e){yr(t,e,!1);}}),wr=Xo.extend({type:"rect",shape:{r:0,x:0,y:0,width:0,height:0},buildPath:function buildPath(t,e){var i=e.x,n=e.y,a=e.width,o=e.height;e.r?Ji(t,e):t.rect(i,n,a,o),t.closePath();}}),br=Xo.extend({type:"line",shape:{x1:0,y1:0,x2:0,y2:0,percent:1},style:{stroke:"#000",fill:null},buildPath:function buildPath(t,e){var i=e.x1,n=e.y1,a=e.x2,o=e.y2,r=e.percent;0!==r&&(t.moveTo(i,n),r<1&&(a=i*(1-r)+a*r,o=n*(1-r)+o*r),t.lineTo(a,o));},pointAt:function pointAt(t){var e=this.shape;return[e.x1*(1-t)+e.x2*t,e.y1*(1-t)+e.y2*t];}}),Sr=[];function Mr(t,e,i){var n=t.cpx2,a=t.cpy2;return null===n||null===a?[(i?ja:Ua)(t.x1,t.cpx1,t.cpx2,t.x2,e),(i?ja:Ua)(t.y1,t.cpy1,t.cpy2,t.y2,e)]:[(i?Ka:qa)(t.x1,t.cpx1,t.x2,e),(i?Ka:qa)(t.y1,t.cpy1,t.y2,e)];}var Ir=Xo.extend({type:"bezier-curve",shape:{x1:0,y1:0,x2:0,y2:0,cpx1:0,cpy1:0,percent:1},style:{stroke:"#000",fill:null},buildPath:function buildPath(t,e){var i=e.x1,n=e.y1,a=e.x2,o=e.y2,r=e.cpx1,s=e.cpy1,l=e.cpx2,h=e.cpy2,u=e.percent;0!==u&&(t.moveTo(i,n),null==l||null==h?(u<1&&(Ja(i,r,a,u,Sr),r=Sr[1],a=Sr[2],Ja(n,s,o,u,Sr),s=Sr[1],o=Sr[2]),t.quadraticCurveTo(r,s,a,o)):(u<1&&(Ya(i,r,l,a,u,Sr),r=Sr[1],l=Sr[2],a=Sr[3],Ya(n,s,h,o,u,Sr),s=Sr[1],h=Sr[2],o=Sr[3]),t.bezierCurveTo(r,s,l,h,a,o)));},pointAt:function pointAt(t){return Mr(this.shape,t,!1);},tangentAt:function tangentAt(t){var e=Mr(this.shape,t,!0);return gt(e,e);}}),Tr=Xo.extend({type:"arc",shape:{cx:0,cy:0,r:0,startAngle:0,endAngle:2*Math.PI,clockwise:!0},style:{stroke:"#000",fill:null},buildPath:function buildPath(t,e){var i=e.cx,n=e.cy,a=Math.max(e.r,0),o=e.startAngle,r=e.endAngle,s=e.clockwise,l=Math.cos(o),h=Math.sin(o);t.moveTo(l*a+i,h*a+n),t.arc(i,n,a,o,r,!s);}}),Dr=Xo.extend({type:"compound",shape:{paths:null},_updatePathDirty:function _updatePathDirty(){for(var t=this.__dirtyPath,e=this.shape.paths,i=0;i<e.length;i++){t=t||e[i].__dirtyPath;}this.__dirtyPath=t,this.__dirty=this.__dirty||t;},beforeBrush:function beforeBrush(){this._updatePathDirty();for(var t=this.shape.paths||[],e=this.getGlobalScale(),i=0;i<t.length;i++){t[i].path||t[i].createPathProxy(),t[i].path.setScale(e[0],e[1]);}},buildPath:function buildPath(t,e){for(var i=e.paths||[],n=0;n<i.length;n++){i[n].buildPath(t,i[n].shape,!0);}},afterBrush:function afterBrush(){for(var t=this.shape.paths||[],e=0;e<t.length;e++){t[e].__dirtyPath=!1;}},getBoundingRect:function getBoundingRect(){return this._updatePathDirty(),Xo.prototype.getBoundingRect.call(this);}}),Ar=function Ar(t){this.colorStops=t||[];};Ar.prototype={constructor:Ar,addColorStop:function addColorStop(t,e){this.colorStops.push({offset:t,color:e});}};var Cr=function Cr(t,e,i,n,a,o){this.x=null==t?0:t,this.y=null==e?0:e,this.x2=null==i?1:i,this.y2=null==n?0:n,this.type="linear",this.global=o||!1,Ar.call(this,a);};Cr.prototype={constructor:Cr},_(Cr,Ar);var Lr=function Lr(t,e,i,n,a){this.x=null==t?.5:t,this.y=null==e?.5:e,this.r=null==i?.5:i,this.type="radial",this.global=a||!1,Ar.call(this,n);};function kr(t){xn.call(this,t),this._displayables=[],this._temporaryDisplayables=[],this._cursor=0,this.notClear=!0;}Lr.prototype={constructor:Lr},_(Lr,Ar),kr.prototype.incremental=!0,kr.prototype.clearDisplaybles=function(){this._displayables=[],this._temporaryDisplayables=[],this._cursor=0,this.dirty(),this.notClear=!1;},kr.prototype.addDisplayable=function(t,e){e?this._temporaryDisplayables.push(t):this._displayables.push(t),this.dirty();},kr.prototype.addDisplayables=function(t,e){e=e||!1;for(var i=0;i<t.length;i++){this.addDisplayable(t[i],e);}},kr.prototype.eachPendingDisplayable=function(t){for(var e=this._cursor;e<this._displayables.length;e++){t&&t(this._displayables[e]);}for(e=0;e<this._temporaryDisplayables.length;e++){t&&t(this._temporaryDisplayables[e]);}},kr.prototype.update=function(){this.updateTransform();for(var t=this._cursor;t<this._displayables.length;t++){(e=this._displayables[t]).parent=this,e.update(),e.parent=null;}for(t=0;t<this._temporaryDisplayables.length;t++){var e;(e=this._temporaryDisplayables[t]).parent=this,e.update(),e.parent=null;}},kr.prototype.brush=function(t,e){for(var i=this._cursor;i<this._displayables.length;i++){(n=this._temporaryDisplayables[i]).beforeBrush&&n.beforeBrush(t),n.brush(t,i===this._cursor?null:this._displayables[i-1]),n.afterBrush&&n.afterBrush(t);}this._cursor=i;for(i=0;i<this._temporaryDisplayables.length;i++){var n;(n=this._temporaryDisplayables[i]).beforeBrush&&n.beforeBrush(t),n.brush(t,0===i?null:this._temporaryDisplayables[i-1]),n.afterBrush&&n.afterBrush(t);}this._temporaryDisplayables=[],this.notClear=!0;};var Pr=[];kr.prototype.getBoundingRect=function(){if(!this._rect){for(var t=new ei(1/0,1/0,-1/0,-1/0),e=0;e<this._displayables.length;e++){var i=this._displayables[e],n=i.getBoundingRect().clone();i.needLocalTransform()&&n.applyTransform(i.getLocalTransform(Pr)),t.union(n);}this._rect=t;}return this._rect;},kr.prototype.contain=function(t,e){var i=this.transformCoordToLocal(t,e);if(this.getBoundingRect().contain(i[0],i[1]))for(var n=0;n<this._displayables.length;n++){if(this._displayables[n].contain(t,e))return!0;}return!1;},_(kr,xn);var Nr=Math.round,Or=Math.max,Er=Math.min,Rr={};function zr(t){return Xo.extend(t);}function Br(t,e,i,n){var a=new Xo(lr(t,e)),o=a.getBoundingRect();return i&&("center"===n&&(i=Gr(i,o)),Fr(a,i)),a;}function Vr(t,i,n){var a=new _n({style:{image:t,x:i.x,y:i.y,width:i.width,height:i.height},onload:function onload(t){if("center"===n){var e={width:t.width,height:t.height};a.setStyle(Gr(i,e));}}});return a;}function Gr(t,e){var i,n=e.width/e.height,a=t.height*n;return i=a<=t.width?t.height:(a=t.width)/n,{x:t.x+t.width/2-a/2,y:t.y+t.height/2-i/2,width:a,height:i};}var Wr=function Wr(t,e){for(var i=[],n=t.length,a=0;a<n;a++){var o=t[a];o.path||o.createPathProxy(),o.__dirtyPath&&o.buildPath(o.path,o.shape,!0),i.push(o.path);}var r=new Xo(e);return r.createPathProxy(),r.buildPath=function(t){t.appendPath(i);var e=t.getContext();e&&t.rebuildPath(e);},r;};function Fr(t,e){if(t.applyTransform){var i=t.getBoundingRect().calculateTransform(e);t.applyTransform(i);}}function Hr(t){var e=t.shape,i=t.style.lineWidth;return Nr(2*e.x1)===Nr(2*e.x2)&&(e.x1=e.x2=Ur(e.x1,i,!0)),Nr(2*e.y1)===Nr(2*e.y2)&&(e.y1=e.y2=Ur(e.y1,i,!0)),t;}function Zr(t){var e=t.shape,i=t.style.lineWidth,n=e.x,a=e.y,o=e.width,r=e.height;return e.x=Ur(e.x,i,!0),e.y=Ur(e.y,i,!0),e.width=Math.max(Ur(n+o,i,!1)-e.x,0===o?0:1),e.height=Math.max(Ur(a+r,i,!1)-e.y,0===r?0:1),t;}function Ur(t,e,i){var n=Nr(2*t);return(n+Nr(e))%2==0?n/2:(n+(i?1:-1))/2;}function jr(t){return null!=t&&"none"!=t;}function Xr(t){return"string"==typeof t?ye(t,-.1):t;}function Yr(t){if(t.__hoverStlDirty){var e=t.style.stroke,i=t.style.fill,n=t.__hoverStl;n.fill=n.fill||(jr(i)?Xr(i):null),n.stroke=n.stroke||(jr(e)?Xr(e):null);var a={};for(var o in n){null!=n[o]&&(a[o]=t.style[o]);}t.__normalStl=a,t.__hoverStlDirty=!1;}}function qr(t){if(!t.__isHover){if(Yr(t),t.useHoverLayer)t.__zr&&t.__zr.addHover(t,t.__hoverStl);else{var e=t.style,i=e.insideRollbackOpt;i&&(a=(n=e).insideRollback)&&(n.textFill=a.textFill,n.textStroke=a.textStroke,n.textStrokeWidth=a.textStrokeWidth),e.extendFrom(t.__hoverStl),i&&(us(e,e.insideOriginalTextPosition,i),null==e.textFill&&(e.textFill=i.autoColor)),t.dirty(!1),t.z2+=1;}var n,a;t.__isHover=!0;}}function Kr(t){if(t.__isHover){var e=t.__normalStl;t.useHoverLayer?t.__zr&&t.__zr.removeHover(t):(e&&t.setStyle(e),t.z2-=1),t.__isHover=!1;}}function $r(t){"group"===t.type?t.traverse(function(t){"group"!==t.type&&qr(t);}):qr(t);}function Jr(t){"group"===t.type?t.traverse(function(t){"group"!==t.type&&Kr(t);}):Kr(t);}function Qr(t,e){t.__hoverStl=t.hoverStyle||e||{},t.__hoverStlDirty=!0,t.__isHover&&Yr(t);}function ts(t){this.__hoverSilentOnTouch&&t.zrByTouch||!this.__isEmphasis&&$r(this);}function es(t){this.__hoverSilentOnTouch&&t.zrByTouch||!this.__isEmphasis&&Jr(this);}function is(){this.__isEmphasis=!0,$r(this);}function ns(){this.__isEmphasis=!1,Jr(this);}function as(t,e,i){t.__hoverSilentOnTouch=i&&i.hoverSilentOnTouch,"group"===t.type?t.traverse(function(t){"group"!==t.type&&Qr(t,e);}):Qr(t,e),t.on("mouseover",ts).on("mouseout",es),t.on("emphasis",is).on("normal",ns);}function os(t,e,i,n,a,o,r){var s,l=(a=a||Rr).labelFetcher,h=a.labelDataIndex,u=a.labelDimIndex,c=i.getShallow("show"),d=n.getShallow("show");(c||d)&&(l&&(s=l.getFormattedLabel(h,"normal",null,u)),null==s&&(s=M(a.defaultText)?a.defaultText(h,a):a.defaultText));var f=c?s:null,p=d?F(l?l.getFormattedLabel(h,"emphasis",null,u):null,s):null;null==f&&null==p||(rs(t,i,o,a),rs(e,n,r,a,!0)),t.text=f,e.text=p;}function rs(t,e,i,n,a){return ss(t,e,n,a),i&&k(t,i),t.host&&t.host.dirty&&t.host.dirty(!1),t;}function ss(t,e,i,n){if((i=i||Rr).isRectText){var a=e.getShallow("position")||(n?null:"inside");"outside"===a&&(a="top"),t.textPosition=a,t.textOffset=e.getShallow("offset");var o=e.getShallow("rotate");null!=o&&(o*=Math.PI/180),t.textRotation=o,t.textDistance=F(e.getShallow("distance"),n?null:5);}var r,s=e.ecModel,l=s&&s.option.textStyle,h=function(t){var e;for(;t&&t!==t.ecModel;){var i=(t.option||Rr).rich;if(i)for(var n in e=e||{},i){i.hasOwnProperty(n)&&(e[n]=1);}t=t.parentModel;}return e;}(e);if(h)for(var u in r={},h){if(h.hasOwnProperty(u)){var c=e.getModel(["rich",u]);ls(r[u]={},c,l,i,n);}}return t.rich=r,ls(t,e,l,i,n,!0),i.forceRich&&!i.textStyle&&(i.textStyle={}),t;}function ls(t,e,i,n,a,o){if(i=!a&&i||Rr,t.textFill=hs(e.getShallow("color"),n)||i.color,t.textStroke=hs(e.getShallow("textBorderColor"),n)||i.textBorderColor,t.textStrokeWidth=F(e.getShallow("textBorderWidth"),i.textBorderWidth),!a){if(o){var r=t.textPosition;t.insideRollback=us(t,r,n),t.insideOriginalTextPosition=r,t.insideRollbackOpt=n;}null==t.textFill&&(t.textFill=n.autoColor);}t.fontStyle=e.getShallow("fontStyle")||i.fontStyle,t.fontWeight=e.getShallow("fontWeight")||i.fontWeight,t.fontSize=e.getShallow("fontSize")||i.fontSize,t.fontFamily=e.getShallow("fontFamily")||i.fontFamily,t.textAlign=e.getShallow("align"),t.textVerticalAlign=e.getShallow("verticalAlign")||e.getShallow("baseline"),t.textLineHeight=e.getShallow("lineHeight"),t.textWidth=e.getShallow("width"),t.textHeight=e.getShallow("height"),t.textTag=e.getShallow("tag"),o&&n.disableBox||(t.textBackgroundColor=hs(e.getShallow("backgroundColor"),n),t.textPadding=e.getShallow("padding"),t.textBorderColor=hs(e.getShallow("borderColor"),n),t.textBorderWidth=e.getShallow("borderWidth"),t.textBorderRadius=e.getShallow("borderRadius"),t.textBoxShadowColor=e.getShallow("shadowColor"),t.textBoxShadowBlur=e.getShallow("shadowBlur"),t.textBoxShadowOffsetX=e.getShallow("shadowOffsetX"),t.textBoxShadowOffsetY=e.getShallow("shadowOffsetY")),t.textShadowColor=e.getShallow("textShadowColor")||i.textShadowColor,t.textShadowBlur=e.getShallow("textShadowBlur")||i.textShadowBlur,t.textShadowOffsetX=e.getShallow("textShadowOffsetX")||i.textShadowOffsetX,t.textShadowOffsetY=e.getShallow("textShadowOffsetY")||i.textShadowOffsetY;}function hs(t,e){return"auto"!==t?t:e&&e.autoColor?e.autoColor:null;}function us(t,e,i){var n,a=i.useInsideStyle;return null==t.textFill&&!1!==a&&(!0===a||i.isRectText&&e&&"string"==typeof e&&0<=e.indexOf("inside"))&&(n={textFill:null,textStroke:t.textStroke,textStrokeWidth:t.textStrokeWidth},t.textFill="#fff",null==t.textStroke&&(t.textStroke=i.autoColor,null==t.textStrokeWidth&&(t.textStrokeWidth=2))),n;}function cs(t,e){var i=e||e.getModel("textStyle");return X([t.fontStyle||i&&i.getShallow("fontStyle")||"",t.fontWeight||i&&i.getShallow("fontWeight")||"",(t.fontSize||i&&i.getShallow("fontSize")||12)+"px",t.fontFamily||i&&i.getShallow("fontFamily")||"sans-serif"].join(" "));}function ds(t,e,i,n,a,o){if("function"==typeof a&&(o=a,a=null),n&&n.isAnimationEnabled()){var r=t?"Update":"",s=n.getShallow("animationDuration"+r),l=n.getShallow("animationEasing"+r),h=n.getShallow("animationDelay"+r);"function"==typeof h&&(h=h(a,n.getAnimationDelayParams?n.getAnimationDelayParams(e,a):null)),"function"==typeof s&&(s=s(a)),0<s?e.animateTo(i,s,h||0,l,o,!!o):(e.stopAnimation(),e.attr(i),o&&o());}else e.stopAnimation(),e.attr(i),o&&o();}function fs(t,e,i,n,a){ds(!0,t,e,i,n,a);}function ps(t,e,i,n,a){ds(!1,t,e,i,n,a);}function gs(t,e){for(var i=Rt([]);t&&t!==e;){Bt(i,t.getLocalTransform(),i),t=t.parent;}return i;}function ms(t,e,i){return e&&!O(e)&&(e=Yt.getLocalTransform(e)),i&&(e=Ft([],e)),wt([],t,e);}function vs(t,e,i){var n=0===e[4]||0===e[5]||0===e[0]?1:Math.abs(2*e[4]/e[0]),a=0===e[4]||0===e[5]||0===e[2]?1:Math.abs(2*e[4]/e[2]),o=["left"===t?-n:"right"===t?n:0,"top"===t?-a:"bottom"===t?a:0];return o=ms(o,e,i),Math.abs(o[0])>Math.abs(o[1])?0<o[0]?"right":"left":0<o[1]?"bottom":"top";}function ys(t,e,n,i){if(t&&e){var a,o=(a={},t.traverse(function(t){!t.isGroup&&t.anid&&(a[t.anid]=t);}),a);e.traverse(function(t){if(!t.isGroup&&t.anid){var e=o[t.anid];if(e){var i=r(t);t.attr(r(e)),fs(t,i,n,t.dataIndex);}}});}function r(t){var e={position:ot(t.position),rotation:t.rotation};return t.shape&&(e.shape=k({},t.shape)),e;}}function xs(t,n){return P(t,function(t){var e=t[0];e=Or(e,n.x),e=Er(e,n.x+n.width);var i=t[1];return i=Or(i,n.y),[e,i=Er(i,n.y+n.height)];});}function _s(t,e,i){var n=(e=k({rectHover:!0},e)).style={strokeNoScale:!0};if(i=i||{x:-1,y:-1,width:2,height:2},t)return 0===t.indexOf("image://")?(n.image=t.slice(8),C(n,i),new _n(e)):Br(t.replace("path://",""),e,i,"center");}var ws=(Object.freeze||Object)({extendShape:zr,extendPath:function extendPath(t,e){return Xo.extend(lr(t,e));},makePath:Br,makeImage:Vr,mergePath:Wr,resizePath:Fr,subPixelOptimizeLine:Hr,subPixelOptimizeRect:Zr,subPixelOptimize:Ur,setHoverStyle:as,setLabelStyle:os,setTextStyle:rs,setText:function setText(t,e,i){var n,a={isRectText:!0};!1===i?n=!0:a.autoColor=i,ss(t,e,a,n),t.host&&t.host.dirty&&t.host.dirty(!1);},getFont:cs,updateProps:fs,initProps:ps,getTransform:gs,applyTransform:ms,transformDirection:vs,groupTransition:ys,clipPointsByRect:xs,clipRectByRect:function clipRectByRect(t,e){var i=Or(t.x,e.x),n=Er(t.x+t.width,e.x+e.width),a=Or(t.y,e.y),o=Er(t.y+t.height,e.y+e.height);if(i<=n&&a<=o)return{x:i,y:a,width:n-i,height:o-a};},createIcon:_s,Group:ii,Image:_n,Text:hr,Circle:ur,Sector:fr,Ring:pr,Polygon:xr,Polyline:_r,Rect:wr,Line:br,BezierCurve:Ir,Arc:Tr,IncrementalDisplayable:kr,CompoundPath:Dr,LinearGradient:Cr,RadialGradient:Lr,BoundingRect:ei}),bs=["textStyle","color"],Ss={getTextColor:function getTextColor(t){var e=this.ecModel;return this.getShallow("color")||(!t&&e?e.get(bs):null);},getFont:function getFont(){return cs({fontStyle:this.getShallow("fontStyle"),fontWeight:this.getShallow("fontWeight"),fontSize:this.getShallow("fontSize"),fontFamily:this.getShallow("fontFamily")},this.ecModel);},getTextRect:function getTextRect(t){return Vi(t,this.getFont(),this.getShallow("align"),this.getShallow("verticalAlign")||this.getShallow("baseline"),this.getShallow("padding"),this.getShallow("rich"),this.getShallow("truncateText"));}},Ms=Ca([["fill","color"],["stroke","borderColor"],["lineWidth","borderWidth"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"],["textPosition"],["textAlign"]]),Is={getItemStyle:function getItemStyle(t,e){var i=Ms(this,t,e),n=this.getBorderLineDash();return n&&(i.lineDash=n),i;},getBorderLineDash:function getBorderLineDash(){var t=this.get("borderType");return"solid"===t||null==t?null:"dashed"===t?[5,5]:[1,1];}},Ts=w,Ds=ga();function As(t,e,i){this.parentModel=e,this.ecModel=i,this.option=t;}function Cs(t,e,i){for(var n=0;n<e.length&&(!e[n]||null!=(t=t&&"object"==(typeof t==="undefined"?"undefined":_typeof(t))?t[e[n]]:null));n++){}return null==t&&i&&(t=i.get(e)),t;}function Ls(t,e){var i=Ds(t).getParent;return i?i.call(t,e):t.parentModel;}As.prototype={constructor:As,init:null,mergeOption:function mergeOption(t){g(this.option,t,!0);},get:function get(t,e){return null==t?this.option:Cs(this.option,this.parsePath(t),!e&&Ls(this,t));},getShallow:function getShallow(t,e){var i=this.option,n=null==i?i:i[t],a=!e&&Ls(this,t);return null==n&&a&&(n=a.getShallow(t)),n;},getModel:function getModel(t,e){var i;return new As(null==t?this.option:Cs(this.option,t=this.parsePath(t)),e=e||(i=Ls(this,t))&&i.getModel(t),this.ecModel);},isEmpty:function isEmpty(){return null==this.option;},restoreData:function restoreData(){},clone:function clone(){return new(0,this.constructor)(A(this.option));},setReadOnly:function setReadOnly(t){},parsePath:function parsePath(t){return"string"==typeof t&&(t=t.split(".")),t;},customizeGetParent:function customizeGetParent(t){Ds(this).getParent=t;},isAnimationEnabled:function isAnimationEnabled(){if(!v.node){if(null!=this.option.animation)return!!this.option.animation;if(this.parentModel)return this.parentModel.isAnimationEnabled();}}},Sa(As),Ia(As),Ts(As,ka),Ts(As,Na),Ts(As,Ss),Ts(As,Is);var ks=0;function Ps(t){return[t||"",ks++,Math.random().toFixed(5)].join("_");}var Ns=1e-4;function Os(t,e,i,n){var a=e[1]-e[0],o=i[1]-i[0];if(0===a)return 0===o?i[0]:(i[0]+i[1])/2;if(n){if(0<a){if(t<=e[0])return i[0];if(t>=e[1])return i[1];}else{if(t>=e[0])return i[0];if(t<=e[1])return i[1];}}else{if(t===e[0])return i[0];if(t===e[1])return i[1];}return(t-e[0])/a*o+i[0];}function Es(t,e){switch(t){case"center":case"middle":t="50%";break;case"left":case"top":t="0%";break;case"right":case"bottom":t="100%";}return"string"==typeof t?(i=t,i.replace(/^\s+/,"").replace(/\s+$/,"")).match(/%$/)?parseFloat(t)/100*e:parseFloat(t):null==t?NaN:+t;var i;}function Rs(t,e,i){return null==e&&(e=10),e=Math.min(Math.max(0,e),20),t=(+t).toFixed(e),i?t:+t;}function zs(t){return t.sort(function(t,e){return t-e;}),t;}function Bs(t){if(t=+t,isNaN(t))return 0;for(var e=1,i=0;Math.round(t*e)/e!==t;){e*=10,i++;}return i;}function Vs(t){var e=t.toString(),i=e.indexOf("e");if(0<i){var n=+e.slice(i+1);return n<0?-n:0;}var a=e.indexOf(".");return a<0?0:e.length-1-a;}function Gs(t,e){var i=Math.log,n=Math.LN10,a=Math.floor(i(t[1]-t[0])/n),o=Math.round(i(Math.abs(e[1]-e[0]))/n),r=Math.min(Math.max(-a+o,0),20);return isFinite(r)?r:20;}function Ws(t,e,i){if(!t[e])return 0;var n=b(t,function(t,e){return t+(isNaN(e)?0:e);},0);if(0===n)return 0;for(var a=Math.pow(10,i),o=P(t,function(t){return(isNaN(t)?0:t)/n*a*100;}),r=100*a,s=P(o,function(t){return Math.floor(t);}),l=b(s,function(t,e){return t+e;},0),h=P(o,function(t,e){return t-s[e];});l<r;){for(var u=Number.NEGATIVE_INFINITY,c=null,d=0,f=h.length;d<f;++d){h[d]>u&&(u=h[d],c=d);}++s[c],h[c]=0,++l;}return s[e]/a;}var Fs=9007199254740991;function Hs(t){var e=2*Math.PI;return(t%e+e)%e;}function Zs(t){return-Ns<t&&t<Ns;}var Us=/^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d\d)(?::(\d\d)(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;function js(t){if(t instanceof Date)return t;if("string"==typeof t){var e=Us.exec(t);if(!e)return new Date(NaN);if(e[8]){var i=+e[4]||0;return"Z"!==e[8].toUpperCase()&&(i-=e[8].slice(0,3)),new Date(Date.UTC(+e[1],+(e[2]||1)-1,+e[3]||1,i,+(e[5]||0),+e[6]||0,+e[7]||0));}return new Date(+e[1],+(e[2]||1)-1,+e[3]||1,+e[4]||0,+(e[5]||0),+e[6]||0,+e[7]||0);}return null==t?new Date(NaN):new Date(Math.round(t));}function Xs(t){return Math.pow(10,Ys(t));}function Ys(t){return Math.floor(Math.log(t)/Math.LN10);}function qs(t,e){var i=Ys(t),n=Math.pow(10,i),a=t/n;return t=(e?a<1.5?1:a<2.5?2:a<4?3:a<7?5:10:a<1?1:a<2?2:a<3?3:a<5?5:10)*n,-20<=i?+t.toFixed(i<0?-i:0):t;}function Ks(t){t.sort(function(t,e){return function t(e,i,n){return e.interval[n]<i.interval[n]||e.interval[n]===i.interval[n]&&(e.close[n]-i.close[n]==(n?-1:1)||!n&&t(e,i,1));}(t,e,0)?-1:1;});for(var e=-1/0,i=1,n=0;n<t.length;){for(var a=t[n].interval,o=t[n].close,r=0;r<2;r++){a[r]<=e&&(a[r]=e,o[r]=r?1:1-i),e=a[r],i=o[r];}a[0]===a[1]&&o[0]*o[1]!=1?t.splice(n,1):n++;}return t;}function $s(t){return 0<=t-parseFloat(t);}var Js=(Object.freeze||Object)({linearMap:Os,parsePercent:Es,round:Rs,asc:zs,getPrecision:Bs,getPrecisionSafe:Vs,getPixelPrecision:Gs,getPercentWithPrecision:Ws,MAX_SAFE_INTEGER:Fs,remRadian:Hs,isRadianAroundZero:Zs,parseDate:js,quantity:Xs,nice:qs,reformIntervals:Ks,isNumeric:$s});function Qs(t){return isNaN(t)?"-":(t=(t+"").split("."))[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,"$1,")+(1<t.length?"."+t[1]:"");}function tl(t,e){return t=(t||"").toLowerCase().replace(/-(.)/g,function(t,e){return e.toUpperCase();}),e&&t&&(t=t.charAt(0).toUpperCase()+t.slice(1)),t;}var el=U,il=/([&<>"'])/g,nl={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function al(t){return null==t?"":(t+"").replace(il,function(t,e){return nl[e];});}var ol=["a","b","c","d","e","f","g"],rl=function rl(t,e){return"{"+t+(null==e?"":e)+"}";};function sl(t,e,i){E(e)||(e=[e]);var n=e.length;if(!n)return"";for(var a=e[0].$vars||[],o=0;o<a.length;o++){var r=ol[o];t=t.replace(rl(r),rl(r,0));}for(var s=0;s<n;s++){for(var l=0;l<a.length;l++){var h=e[s][a[l]];t=t.replace(rl(ol[l],s),i?al(h):h);}}return t;}function ll(i,t,n){return z(t,function(t,e){i=i.replace("{"+e+"}",n?al(t):t);}),i;}function hl(t,e){var i=(t=D(t)?{color:t,extraCssText:e}:t||{}).color,n=t.type;e=t.extraCssText;return i?"subItem"===n?'<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:'+al(i)+";"+(e||"")+'"></span>':'<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+al(i)+";"+(e||"")+'"></span>':"";}function ul(t,e){return"0000".substr(0,e-(t+="").length)+t;}function cl(t,e,i){"week"!==t&&"month"!==t&&"quarter"!==t&&"half-year"!==t&&"year"!==t||(t="MM-dd\nyyyy");var n=js(e),a=i?"UTC":"",o=n["get"+a+"FullYear"](),r=n["get"+a+"Month"]()+1,s=n["get"+a+"Date"](),l=n["get"+a+"Hours"](),h=n["get"+a+"Minutes"](),u=n["get"+a+"Seconds"](),c=n["get"+a+"Milliseconds"]();return t=t.replace("MM",ul(r,2)).replace("M",r).replace("yyyy",o).replace("yy",o%100).replace("dd",ul(s,2)).replace("d",s).replace("hh",ul(l,2)).replace("h",l).replace("mm",ul(h,2)).replace("m",h).replace("ss",ul(u,2)).replace("s",u).replace("SSS",ul(c,3));}function dl(t){return t?t.charAt(0).toUpperCase()+t.substr(1):t;}var fl=Hi,pl=Vi,gl=(Object.freeze||Object)({addCommas:Qs,toCamelCase:tl,normalizeCssArray:el,encodeHTML:al,formatTpl:sl,formatTplSimple:ll,getTooltipMarker:hl,formatTime:cl,capitalFirst:dl,truncateText:fl,getTextRect:pl}),ml=z,vl=["left","right","top","bottom","width","height"],yl=[["width","left","right"],["height","top","bottom"]];function xl(u,c,d,f,p){var g=0,m=0;null==f&&(f=1/0),null==p&&(p=1/0);var v=0;c.eachChild(function(t,e){var i,n,a=t.position,o=t.getBoundingRect(),r=c.childAt(e+1),s=r&&r.getBoundingRect();if("horizontal"===u){var l=o.width+(s?-s.x+o.x:0);f<(i=g+l)||t.newline?(g=0,i=l,m+=v+d,v=o.height):v=Math.max(v,o.height);}else{var h=o.height+(s?-s.y+o.y:0);p<(n=m+h)||t.newline?(g+=v+d,m=0,n=h,v=o.width):v=Math.max(v,o.width);}t.newline||(a[0]=g,a[1]=m,"horizontal"===u?g=i+d:m=n+d);});}var _l=xl;N(xl,"vertical"),N(xl,"horizontal");function wl(t,e,i){i=el(i||0);var n=e.width,a=e.height,o=Es(t.left,n),r=Es(t.top,a),s=Es(t.right,n),l=Es(t.bottom,a),h=Es(t.width,n),u=Es(t.height,a),c=i[2]+i[0],d=i[1]+i[3],f=t.aspect;switch(isNaN(h)&&(h=n-s-d-o),isNaN(u)&&(u=a-l-c-r),null!=f&&(isNaN(h)&&isNaN(u)&&(n/a<f?h=.8*n:u=.8*a),isNaN(h)&&(h=f*u),isNaN(u)&&(u=h/f)),isNaN(o)&&(o=n-s-h-d),isNaN(r)&&(r=a-l-u-c),t.left||t.right){case"center":o=n/2-h/2-i[3];break;case"right":o=n-h-d;}switch(t.top||t.bottom){case"middle":case"center":r=a/2-u/2-i[0];break;case"bottom":r=a-u-c;}o=o||0,r=r||0,isNaN(h)&&(h=n-d-o-(s||0)),isNaN(u)&&(u=a-c-r-(l||0));var p=new ei(o+i[3],r+i[0],h,u);return p.margin=i,p;}function bl(t,e,i,n,a){var o=!a||!a.hv||a.hv[0],r=!a||!a.hv||a.hv[1],s=a&&a.boundingMode||"all";if(o||r){var l;if("raw"===s)l="group"===t.type?new ei(0,0,+e.width||0,+e.height||0):t.getBoundingRect();else if(l=t.getBoundingRect(),t.needLocalTransform()){var h=t.getLocalTransform();(l=l.clone()).applyTransform(h);}e=wl(C({width:l.width,height:l.height},e),i,n);var u=t.position,c=o?e.x-l.x:0,d=r?e.y-l.y:0;t.attr("position","raw"===s?[c,d]:[u[0]+c,u[1]+d]);}}function Sl(l,h,t){!R(t)&&(t={});var u=t.ignoreSize;!E(u)&&(u=[u,u]);var e=n(yl[0],0),i=n(yl[1],1);function n(t,e){var i={},n=0,a={},o=0;if(ml(t,function(t){a[t]=l[t];}),ml(t,function(t){c(h,t)&&(i[t]=a[t]=h[t]),d(i,t)&&n++,d(a,t)&&o++;}),u[e])return d(h,t[1])?a[t[2]]=null:d(h,t[2])&&(a[t[1]]=null),a;if(2!==o&&n){if(2<=n)return i;for(var r=0;r<t.length;r++){var s=t[r];if(!c(i,s)&&c(l,s)){i[s]=l[s];break;}}return i;}return a;}function c(t,e){return t.hasOwnProperty(e);}function d(t,e){return null!=t[e]&&"auto"!==t[e];}function a(t,e,i){ml(t,function(t){e[t]=i[t];});}a(yl[0],l,e),a(yl[1],l,i);}function Ml(t){return Il({},t);}function Il(e,i){return i&&e&&ml(vl,function(t){i.hasOwnProperty(t)&&(e[t]=i[t]);}),e;}var Tl,Dl,Al=ga(),Cl=As.extend({type:"component",id:"",name:"",mainType:"",subType:"",componentIndex:0,defaultOption:null,ecModel:null,dependentModels:[],uid:null,layoutMode:null,$constructor:function $constructor(t,e,i,n){As.call(this,t,e,i,n),this.uid=Ps("ec_cpt_model");},init:function init(t,e,i,n){this.mergeDefaultAndTheme(t,i);},mergeDefaultAndTheme:function mergeDefaultAndTheme(t,e){var i=this.layoutMode,n=i?Ml(t):{};g(t,e.getTheme().get(this.mainType)),g(t,this.getDefaultOption()),i&&Sl(t,n,i);},mergeOption:function mergeOption(t,e){g(this.option,t,!0);var i=this.layoutMode;i&&Sl(this.option,t,i);},optionUpdated:function optionUpdated(t,e){},getDefaultOption:function getDefaultOption(){var t=Al(this);if(!t.defaultOption){for(var e=[],i=this.constructor;i;){var n=i.prototype.defaultOption;n&&e.push(n),i=i.superClass;}for(var a={},o=e.length-1;0<=o;o--){a=g(a,e[o],!0);}t.defaultOption=a;}return t.defaultOption;},getReferringComponents:function getReferringComponents(t){return this.ecModel.queryComponents({mainType:t,index:this.get(t+"Index",!0),id:this.get(t+"Id",!0)});}});Aa(Cl,{registerWhenExtend:!0}),Dl={},(Tl=Cl).registerSubTypeDefaulter=function(t,e){t=ba(t),Dl[t.main]=e;},Tl.determineSubType=function(t,e){var i=e.type;if(!i){var n=ba(t).main;Tl.hasSubTypes(t)&&Dl[n]&&(i=Dl[n](e));}return i;},function(t,m){function v(t,e){return t[e]||(t[e]={predecessor:[],successor:[]}),t[e];}t.topologicalTravel=function(t,e,i,n){if(t.length){var r,s,l,a=(s={},l=[],z(r=e,function(i){var e,n,a=v(s,i),t=a.originalDeps=m(i),o=(e=r,n=[],z(t,function(t){0<=L(e,t)&&n.push(t);}),n);a.entryCount=o.length,0===a.entryCount&&l.push(i),z(o,function(t){L(a.predecessor,t)<0&&a.predecessor.push(t);var e=v(s,t);L(e.successor,t)<0&&e.successor.push(i);});}),{graph:s,noEntryList:l}),o=a.graph,h=a.noEntryList,u={};for(z(t,function(t){u[t]=!0;});h.length;){var c=h.pop(),d=o[c],f=!!u[c];f&&(i.call(n,c,d.originalDeps.slice()),delete u[c]),z(d.successor,f?g:p);}z(u,function(){throw new Error("Circle dependency may exists");});}function p(t){o[t].entryCount--,0===o[t].entryCount&&h.push(t);}function g(t){u[t]=!0,p(t);}};}(Cl,function(t){var e=[];z(Cl.getClassesByMainType(t),function(t){e=e.concat(t.prototype.dependencies||[]);}),e=P(e,function(t){return ba(t).main;}),"dataset"!==t&&L(e,"dataset")<=0&&e.unshift("dataset");return e;}),w(Cl,{getBoxLayoutParams:function getBoxLayoutParams(){return{left:this.get("left"),top:this.get("top"),right:this.get("right"),bottom:this.get("bottom"),width:this.get("width"),height:this.get("height")};}});var Ll="";"undefined"!=typeof navigator&&(Ll=navigator.platform||"");var kl={color:["#c23531","#2f4554","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a","#6e7074","#546570","#c4ccd3"],gradientColor:["#f6efa6","#d88273","#bf444c"],textStyle:{fontFamily:Ll.match(/^Win/)?"Microsoft YaHei":"sans-serif",fontSize:12,fontStyle:"normal",fontWeight:"normal"},blendMode:null,animation:"auto",animationDuration:1e3,animationDurationUpdate:300,animationEasing:"exponentialOut",animationEasingUpdate:"cubicOut",animationThreshold:2e3,progressiveThreshold:3e3,progressive:400,hoverLayerThreshold:3e3,useUTC:!1},Pl=ga();var Nl={clearColorPalette:function clearColorPalette(){Pl(this).colorIdx=0,Pl(this).colorNameMap={};},getColorFromPalette:function getColorFromPalette(t,e,i){var n=Pl(e=e||this),a=n.colorIdx||0,o=n.colorNameMap=n.colorNameMap||{};if(o.hasOwnProperty(t))return o[t];var r=ra(this.get("color",!0)),s=this.get("colorLayer",!0),l=null!=i&&s?function(t,e){for(var i=t.length,n=0;n<i;n++){if(t[n].length>e)return t[n];}return t[i-1];}(s,i):r;if((l=l||r)&&l.length){var h=l[a];return t&&(o[t]=h),n.colorIdx=(a+1)%l.length,h;}}};function Ol(t){var e=t.get("coordinateSystem"),i={coordSysName:e,coordSysDims:[],axisMap:J(),categoryAxisMap:J()},n=El[e];if(n)return n(t,i,i.axisMap,i.categoryAxisMap),i;}var El={cartesian2d:function cartesian2d(t,e,i,n){var a=t.getReferringComponents("xAxis")[0],o=t.getReferringComponents("yAxis")[0];e.coordSysDims=["x","y"],i.set("x",a),i.set("y",o),Rl(a)&&(n.set("x",a),e.firstCategoryDimIndex=0),Rl(o)&&(n.set("y",o),e.firstCategoryDimIndex=1);},singleAxis:function singleAxis(t,e,i,n){var a=t.getReferringComponents("singleAxis")[0];e.coordSysDims=["single"],i.set("single",a),Rl(a)&&(n.set("single",a),e.firstCategoryDimIndex=0);},polar:function polar(t,e,i,n){var a=t.getReferringComponents("polar")[0],o=a.findAxisModel("radiusAxis"),r=a.findAxisModel("angleAxis");e.coordSysDims=["radius","angle"],i.set("radius",o),i.set("angle",r),Rl(o)&&(n.set("radius",o),e.firstCategoryDimIndex=0),Rl(r)&&(n.set("angle",r),e.firstCategoryDimIndex=1);},geo:function geo(t,e,i,n){e.coordSysDims=["lng","lat"];},parallel:function parallel(t,a,o,r){var s=t.ecModel,e=s.getComponent("parallel",t.get("parallelIndex")),l=a.coordSysDims=e.dimensions.slice();z(e.parallelAxisIndex,function(t,e){var i=s.getComponent("parallelAxis",t),n=l[e];o.set(n,i),Rl(i)&&null==a.firstCategoryDimIndex&&(r.set(n,i),a.firstCategoryDimIndex=e);});}};function Rl(t){return"category"===t.get("type");}var zl="original",Bl="arrayRows",Vl="objectRows",Gl="keyedColumns",Wl="unknown",Fl="typedArray",Hl="column",Zl="row";function Ul(t){this.fromDataset=t.fromDataset,this.data=t.data||(t.sourceFormat===Gl?{}:[]),this.sourceFormat=t.sourceFormat||Wl,this.seriesLayoutBy=t.seriesLayoutBy||Hl,this.dimensionsDefine=t.dimensionsDefine,this.encodeDefine=t.encodeDefine&&J(t.encodeDefine),this.startIndex=t.startIndex||0,this.dimensionsDetectCount=t.dimensionsDetectCount;}Ul.seriesDataToSource=function(t){return new Ul({data:t,sourceFormat:B(t)?Fl:zl,fromDataset:!1});},Ia(Ul);var jl=ga();function Xl(t){var e=t.option,i=e.data,n=B(i)?Fl:zl,a=!1,o=e.seriesLayoutBy,r=e.sourceHeader,s=e.dimensions,l=function(t){var e=t.option;if(!e.data)return t.ecModel.getComponent("dataset",e.datasetIndex||0);}(t);if(l){var h=l.option;i=h.source,n=jl(l).sourceFormat,a=!0,o=o||h.seriesLayoutBy,null==r&&(r=h.sourceHeader),s=s||h.dimensions;}var u=function(t,e,i,n,a){if(!t)return{dimensionsDefine:Yl(a)};var o,r,s,l;if(e===Bl)"auto"===n||null==n?ql(function(t){null!=t&&"-"!==t&&(D(t)?null==r&&(r=1):r=0);},i,t,10):r=n?1:0,a||1!==r||(a=[],ql(function(t,e){a[e]=null!=t?t:"";},i,t)),o=a?a.length:i===Zl?t.length:t[0]?t[0].length:null;else if(e===Vl)a||(a=function(t){var e,i=0;for(;i<t.length&&!(e=t[i++]);){}if(e){var n=[];return z(e,function(t,e){n.push(e);}),n;}}(t),s=!0);else if(e===Gl)a||(a=[],s=!0,z(t,function(t,e){a.push(e);}));else if(e===zl){var h=ha(t[0]);o=E(h)&&h.length||1;}s&&z(a,function(t,e){"name"===(R(t)?t.name:t)&&(l=e);});return{startIndex:r,dimensionsDefine:Yl(a),dimensionsDetectCount:o,potentialNameDimIndex:l};}(i,n,o,r,s),c=e.encode;!c&&l&&(c=function(t,e,i,n,a,o){var r=Ol(t),s={},l=[],h=[],u=t.subType,c=J(["pie","map","funnel"]),d=J(["line","bar","pictorialBar","scatter","effectScatter","candlestick","boxplot"]);if(r&&null!=d.get(u)){var f=t.ecModel,p=jl(f).datasetMap,g=e.uid+"_"+a,m=p.get(g)||p.set(g,{categoryWayDim:1,valueWayDim:0});z(r.coordSysDims,function(t){if(null==r.firstCategoryDimIndex){var e=m.valueWayDim++;s[t]=e,h.push(e);}else if(r.categoryAxisMap.get(t))s[t]=0,l.push(0);else{var e=m.categoryWayDim++;s[t]=e,h.push(e);}});}else if(null!=c.get(u)){for(var v,y=0;y<5&&null==v;y++){Kl(i,n,a,o.dimensionsDefine,o.startIndex,y)||(v=y);}if(null!=v){s.value=v;var x=o.potentialNameDimIndex||Math.max(v-1,0);h.push(x),l.push(x);}}return l.length&&(s.itemName=l),h.length&&(s.seriesName=h),s;}(t,l,i,n,o,u)),jl(t).source=new Ul({data:i,fromDataset:a,seriesLayoutBy:o,sourceFormat:n,dimensionsDefine:u.dimensionsDefine,startIndex:u.startIndex,dimensionsDetectCount:u.dimensionsDetectCount,encodeDefine:c});}function Yl(t){if(t){var n=J();return P(t,function(t,e){if(null==(t=k({},R(t)?t:{name:t})).name)return t;t.name+="",null==t.displayName&&(t.displayName=t.name);var i=n.get(t.name);return i?t.name+="-"+i.count++:n.set(t.name,{count:1}),t;});}}function ql(t,e,i,n){if(null==n&&(n=1/0),e===Zl)for(var a=0;a<i.length&&a<n;a++){t(i[a]?i[a][0]:null,a);}else{var o=i[0]||[];for(a=0;a<o.length&&a<n;a++){t(o[a],a);}}}function Kl(t,e,i,n,a,o){var r,s;if(B(t))return!1;if(n&&(s=R(s=n[o])?s.name:s),e===Bl){if(i===Zl){for(var l=t[o],h=0;h<(l||[]).length&&h<5;h++){if(null!=(r=f(l[a+h])))return r;}}else for(h=0;h<t.length&&h<5;h++){var u=t[a+h];if(u&&null!=(r=f(u[o])))return r;}}else if(e===Vl){if(!s)return;for(h=0;h<t.length&&h<5;h++){if((c=t[h])&&null!=(r=f(c[s])))return r;}}else if(e===Gl){if(!s)return;if(!(l=t[s])||B(l))return!1;for(h=0;h<l.length&&h<5;h++){if(null!=(r=f(l[h])))return r;}}else if(e===zl)for(h=0;h<t.length&&h<5;h++){var c,d=ha(c=t[h]);if(!E(d))return!1;if(null!=(r=f(d[o])))return r;}function f(t){return(null==t||!isFinite(t)||""===t)&&(!(!D(t)||"-"===t)||void 0);}return!1;}var $l="\0_ec_inner",Jl=As.extend({init:function init(t,e,i,n){i=i||{},this.option=null,this._theme=new As(i),this._optionManager=n;},setOption:function setOption(t,e){j(!($l in t),"please use chart.getOption()"),this._optionManager.setOption(t,e),this.resetOption(null);},resetOption:function resetOption(t){var e=!1,i=this._optionManager;if(!t||"recreate"===t){var n=i.mountOption("recreate"===t);this.option&&"recreate"!==t?(this.restoreData(),this.mergeOption(n)):function(t){t=t,this.option={},this.option[$l]=1,this._componentsMap=J({series:[]}),this._seriesIndices,this._seriesIndicesMap,i=t,e=this._theme.option,n=i.color&&!i.colorLayer,z(e,function(t,e){"colorLayer"===e&&n||Cl.hasClass(e)||("object"==(typeof t==="undefined"?"undefined":_typeof(t))?i[e]=i[e]?g(i[e],t,!1):A(t):null==i[e]&&(i[e]=t));}),g(t,kl,!1),this.mergeOption(t);var i,e,n;}.call(this,n),e=!0;}if("timeline"!==t&&"media"!==t||this.restoreData(),!t||"recreate"===t||"timeline"===t){var a=i.getTimelineOption(this);a&&(this.mergeOption(a),e=!0);}if(!t||"recreate"===t||"media"===t){var o=i.getMediaOption(this,this._api);o.length&&z(o,function(t){this.mergeOption(t,e=!0);},this);}return e;},mergeOption:function mergeOption(n){var l=this.option,h=this._componentsMap,i=[];jl(this).datasetMap=J(),z(n,function(t,e){null!=t&&(Cl.hasClass(e)?e&&i.push(e):l[e]=null==l[e]?A(t):g(l[e],t,!0));}),Cl.topologicalTravel(i,Cl.getAllClassMainTypes(),function(r,t){var e=ra(n[r]),i=ua(h.get(r),e);ca(i),z(i,function(t,e){var i,n,a,o=t.option;R(o)&&(t.keyInfo.mainType=r,t.keyInfo.subType=(i=r,n=o,a=t.exist,n.type?n.type:a?a.subType:Cl.determineSubType(i,n)));});var s=function(e,t){E(t)||(t=t?[t]:[]);var i={};return z(t,function(t){i[t]=(e.get(t)||[]).slice();}),i;}(h,t);l[r]=[],h.set(r,[]),z(i,function(t,e){var i=t.exist,n=t.option;if(j(R(n)||i,"Empty component definition"),n){var a=Cl.getClass(r,t.keyInfo.subType,!0);if(i&&i instanceof a)i.name=t.keyInfo.name,i.mergeOption(n,this),i.optionUpdated(n,!1);else{var o=k({dependentModels:s,componentIndex:e},t.keyInfo);k(i=new a(n,this,this,o),o),i.init(n,this,this,o),i.optionUpdated(null,!0);}}else i.mergeOption({},this),i.optionUpdated({},!1);h.get(r)[e]=i,l[r][e]=i.option;},this),"series"===r&&Ql(this,h.get("series"));},this),this._seriesIndicesMap=J(this._seriesIndices=this._seriesIndices||[]);},getOption:function getOption(){var n=A(this.option);return z(n,function(t,e){if(Cl.hasClass(e)){for(var i=(t=ra(t)).length-1;0<=i;i--){fa(t[i])&&t.splice(i,1);}n[e]=t;}}),delete n[$l],n;},getTheme:function getTheme(){return this._theme;},getComponent:function getComponent(t,e){var i=this._componentsMap.get(t);if(i)return i[e||0];},queryComponents:function queryComponents(t){var e=t.mainType;if(!e)return[];var i,n=t.index,a=t.id,o=t.name,r=this._componentsMap.get(e);if(!r||!r.length)return[];if(null!=n)E(n)||(n=[n]),i=T(P(n,function(t){return r[t];}),function(t){return!!t;});else if(null!=a){var s=E(a);i=T(r,function(t){return s&&0<=L(a,t.id)||!s&&t.id===a;});}else if(null!=o){var l=E(o);i=T(r,function(t){return l&&0<=L(o,t.name)||!l&&t.name===o;});}else i=r.slice();return th(i,t);},findComponents:function findComponents(t){var e,i,n,a,o,r=t.query,s=t.mainType,l=(i=s+"Index",n=s+"Id",a=s+"Name",!(e=r)||null==e[i]&&null==e[n]&&null==e[a]?null:{mainType:s,index:e[i],id:e[n],name:e[a]}),h=l?this.queryComponents(l):this._componentsMap.get(s);return o=th(h,t),t.filter?T(o,t.filter):o;},eachComponent:function eachComponent(t,n,a){var e=this._componentsMap;if("function"==typeof t)a=n,n=t,e.each(function(t,i){z(t,function(t,e){n.call(a,i,t,e);});});else if(D(t))z(e.get(t),n,a);else if(R(t)){z(this.findComponents(t),n,a);}},getSeriesByName:function getSeriesByName(e){return T(this._componentsMap.get("series"),function(t){return t.name===e;});},getSeriesByIndex:function getSeriesByIndex(t){return this._componentsMap.get("series")[t];},getSeriesByType:function getSeriesByType(e){return T(this._componentsMap.get("series"),function(t){return t.subType===e;});},getSeries:function getSeries(){return this._componentsMap.get("series").slice();},getSeriesCount:function getSeriesCount(){return this._componentsMap.get("series").length;},eachSeries:function eachSeries(i,n){z(this._seriesIndices,function(t){var e=this._componentsMap.get("series")[t];i.call(n,e,t);},this);},eachRawSeries:function eachRawSeries(t,e){z(this._componentsMap.get("series"),t,e);},eachSeriesByType:function eachSeriesByType(i,n,a){z(this._seriesIndices,function(t){var e=this._componentsMap.get("series")[t];e.subType===i&&n.call(a,e,t);},this);},eachRawSeriesByType:function eachRawSeriesByType(t,e,i){return z(this.getSeriesByType(t),e,i);},isSeriesFiltered:function isSeriesFiltered(t){return null==this._seriesIndicesMap.get(t.componentIndex);},getCurrentSeriesIndices:function getCurrentSeriesIndices(){return(this._seriesIndices||[]).slice();},filterSeries:function filterSeries(t,e){Ql(this,T(this._componentsMap.get("series"),t,e));},restoreData:function restoreData(i){var n=this._componentsMap;Ql(this,n.get("series"));var a=[];n.each(function(t,e){a.push(e);}),Cl.topologicalTravel(a,Cl.getAllClassMainTypes(),function(e,t){z(n.get(e),function(t){("series"!==e||!function(t,e){if(e){var i=e.seiresIndex,n=e.seriesId,a=e.seriesName;return null!=i&&t.componentIndex!==i||null!=n&&t.id!==n||null!=a&&t.name!==a;}}(t,i))&&t.restoreData();});});}});function Ql(t,e){t._seriesIndicesMap=J(t._seriesIndices=P(e,function(t){return t.componentIndex;})||[]);}function th(t,e){return e.hasOwnProperty("subType")?T(t,function(t){return t.subType===e.subType;}):t;}w(Jl,Nl);var eh=["getDom","getZr","getWidth","getHeight","getDevicePixelRatio","dispatchAction","isDisposed","on","off","getDataURL","getConnectedDataURL","getModel","getOption","getViewOfComponentModel","getViewOfSeriesModel"];function ih(e){z(eh,function(t){this[t]=S(e[t],e);},this);}var nh={};function ah(){this._coordinateSystems=[];}ah.prototype={constructor:ah,create:function create(n,a){var o=[];z(nh,function(t,e){var i=t.create(n,a);o=o.concat(i||[]);}),this._coordinateSystems=o;},update:function update(e,i){z(this._coordinateSystems,function(t){t.update&&t.update(e,i);});},getCoordinateSystems:function getCoordinateSystems(){return this._coordinateSystems.slice();}},ah.register=function(t,e){nh[t]=e;},ah.get=function(t){return nh[t];};var oh=z,rh=A,sh=P,lh=g,hh=/^(min|max)?(.+)$/;function uh(t){this._api=t,this._timelineOptions=[],this._mediaList=[],this._mediaDefault,this._currentMediaIndices=[],this._optionBackup,this._newBaseOption;}function ch(t,e,i){var l={width:e,height:i,aspectratio:e/i},h=!0;return z(t,function(t,e){var i=e.match(hh);if(i&&i[1]&&i[2]){var n,a,o,r=i[1],s=i[2].toLowerCase();n=l[s],a=t,("min"===(o=r)?a<=n:"max"===o?n<=a:n===a)||(h=!1);}}),h;}uh.prototype={constructor:uh,setOption:function setOption(t,e){t&&z(ra(t.series),function(t){t&&t.data&&B(t.data)&&q(t.data);}),t=rh(t,!0);var a,i,n=this._optionBackup,o=function(t,i,n){var e,a,o=[],r=[],s=t.timeline;t.baseOption&&(a=t.baseOption);(s||t.options)&&(a=a||{},o=(t.options||[]).slice());if(t.media){a=a||{};var l=t.media;oh(l,function(t){t&&t.option&&(t.query?r.push(t):e||(e=t));});}a||(a=t);a.timeline||(a.timeline=s);return oh([a].concat(o).concat(P(r,function(t){return t.option;})),function(e){oh(i,function(t){t(e,n);});}),{baseOption:a,timelineOptions:o,mediaDefault:e,mediaList:r};}.call(this,t,e,!n);this._newBaseOption=o.baseOption,n?(a=n.baseOption,i=o.baseOption,oh(i=i||{},function(t,e){if(null!=t){var i=a[e];if(Cl.hasClass(e)){t=ra(t);var n=ua(i=ra(i),t);a[e]=sh(n,function(t){return t.option&&t.exist?lh(t.exist,t.option,!0):t.exist||t.option;});}else a[e]=lh(i,t,!0);}}),o.timelineOptions.length&&(n.timelineOptions=o.timelineOptions),o.mediaList.length&&(n.mediaList=o.mediaList),o.mediaDefault&&(n.mediaDefault=o.mediaDefault)):this._optionBackup=o;},mountOption:function mountOption(t){var e=this._optionBackup;return this._timelineOptions=sh(e.timelineOptions,rh),this._mediaList=sh(e.mediaList,rh),this._mediaDefault=rh(e.mediaDefault),this._currentMediaIndices=[],rh(t?e.baseOption:this._newBaseOption);},getTimelineOption:function getTimelineOption(t){var e,i=this._timelineOptions;if(i.length){var n=t.getComponent("timeline");n&&(e=rh(i[n.getCurrentIndex()],!0));}return e;},getMediaOption:function getMediaOption(t){var e,i,n=this._api.getWidth(),a=this._api.getHeight(),o=this._mediaList,r=this._mediaDefault,s=[],l=[];if(!o.length&&!r)return l;for(var h=0,u=o.length;h<u;h++){ch(o[h].query,n,a)&&s.push(h);}return!s.length&&r&&(s=[-1]),s.length&&(e=s,i=this._currentMediaIndices,e.join(",")!==i.join(","))&&(l=sh(s,function(t){return rh(-1===t?r.option:o[t].option);})),this._currentMediaIndices=s,l;}};var dh=z,fh=R,ph=["areaStyle","lineStyle","nodeStyle","linkStyle","chordStyle","label","labelLine"];function gh(t){var e=t&&t.itemStyle;if(e)for(var i=0,n=ph.length;i<n;i++){var a=ph[i],o=e.normal,r=e.emphasis;o&&o[a]&&(t[a]=t[a]||{},t[a].normal?g(t[a].normal,o[a]):t[a].normal=o[a],o[a]=null),r&&r[a]&&(t[a]=t[a]||{},t[a].emphasis?g(t[a].emphasis,r[a]):t[a].emphasis=r[a],r[a]=null);}}function mh(t,e,i){if(t&&t[e]&&(t[e].normal||t[e].emphasis)){var n=t[e].normal,a=t[e].emphasis;n&&(i?(t[e].normal=t[e].emphasis=null,C(t[e],n)):t[e]=n),a&&(t.emphasis=t.emphasis||{},t.emphasis[e]=a);}}function vh(t){mh(t,"itemStyle"),mh(t,"lineStyle"),mh(t,"areaStyle"),mh(t,"label"),mh(t,"labelLine"),mh(t,"upperLabel"),mh(t,"edgeLabel");}function yh(t,e){var i=fh(t)&&t[e],n=fh(i)&&i.textStyle;if(n)for(var a=0,o=la.length;a<o;a++){e=la[a];n.hasOwnProperty(e)&&(i[e]=n[e]);}}function xh(t){t&&(vh(t),yh(t,"label"),t.emphasis&&yh(t.emphasis,"label"));}function _h(t){return E(t)?t:t?[t]:[];}function wh(t){return(E(t)?t[0]:t)||{};}var bh=function bh(e,t){dh(_h(e.series),function(t){fh(t)&&function(t){if(fh(t)){gh(t),vh(t),yh(t,"label"),yh(t,"upperLabel"),yh(t,"edgeLabel"),t.emphasis&&(yh(t.emphasis,"label"),yh(t.emphasis,"upperLabel"),yh(t.emphasis,"edgeLabel")),(i=t.markPoint)&&(gh(i),xh(i)),(n=t.markLine)&&(gh(n),xh(n));var e=t.markArea;e&&xh(e);var i,n,a=t.data;if("graph"===t.type){a=a||t.nodes;var o=t.links||t.edges;if(o&&!B(o))for(var r=0;r<o.length;r++){xh(o[r]);}z(t.categories,function(t){vh(t);});}if(a&&!B(a))for(r=0;r<a.length;r++){xh(a[r]);}if((i=t.markPoint)&&i.data){var s=i.data;for(r=0;r<s.length;r++){xh(s[r]);}}if((n=t.markLine)&&n.data){var l=n.data;for(r=0;r<l.length;r++){E(l[r])?(xh(l[r][0]),xh(l[r][1])):xh(l[r]);}}"gauge"===t.type?(yh(t,"axisLabel"),yh(t,"title"),yh(t,"detail")):"treemap"===t.type?(mh(t.breadcrumb,"itemStyle"),z(t.levels,function(t){vh(t);})):"tree"===t.type&&vh(t.leaves);}}(t);});var i=["xAxis","yAxis","radiusAxis","angleAxis","singleAxis","parallelAxis","radar"];t&&i.push("valueAxis","categoryAxis","logAxis","timeAxis"),dh(i,function(t){dh(_h(e[t]),function(t){t&&(yh(t,"axisLabel"),yh(t.axisPointer,"label"));});}),dh(_h(e.parallel),function(t){var e=t&&t.parallelAxisDefault;yh(e,"axisLabel"),yh(e&&e.axisPointer,"label");}),dh(_h(e.calendar),function(t){mh(t,"itemStyle"),yh(t,"dayLabel"),yh(t,"monthLabel"),yh(t,"yearLabel");}),dh(_h(e.radar),function(t){yh(t,"name");}),dh(_h(e.geo),function(t){fh(t)&&(xh(t),dh(_h(t.regions),function(t){xh(t);}));}),dh(_h(e.timeline),function(t){xh(t),mh(t,"label"),mh(t,"itemStyle"),mh(t,"controlStyle",!0);var e=t.data;E(e)&&z(e,function(t){R(t)&&(mh(t,"label"),mh(t,"itemStyle"));});}),dh(_h(e.toolbox),function(t){mh(t,"iconStyle"),dh(t.feature,function(t){mh(t,"iconStyle");});}),yh(wh(e.axisPointer),"label"),yh(wh(e.tooltip).axisPointer,"label");};function Sh(e){z(Mh,function(t){t[0]in e&&!(t[1]in e)&&(e[t[1]]=e[t[0]]);});}var Mh=[["x","left"],["y","top"],["x2","right"],["y2","bottom"]],Ih=["grid","geo","parallel","legend","toolbox","title","visualMap","dataZoom","timeline"],Th=function Th(i,t){bh(i,t),i.series=ra(i.series),z(i.series,function(t){if(R(t)){var e=t.type;if("pie"!==e&&"gauge"!==e||null!=t.clockWise&&(t.clockwise=t.clockWise),"gauge"===e){var i=function(t,e){e=e.split(",");for(var i=t,n=0;n<e.length&&null!=(i=i&&i[e[n]]);n++){}return i;}(t,"pointer.color");null!=i&&function(t,e,i,n){e=e.split(",");for(var a,o=t,r=0;r<e.length-1;r++){null==o[a=e[r]]&&(o[a]={}),o=o[a];}(n||null==o[e[r]])&&(o[e[r]]=i);}(t,"itemStyle.normal.color",i);}Sh(t);}}),i.dataRange&&(i.visualMap=i.dataRange),z(Ih,function(t){var e=i[t];e&&(E(e)||(e=[e]),z(e,function(t){Sh(t);}));});};function Dh(m){z(m,function(u,c){var d=[],f=[NaN,NaN],t=[u.stackResultDimension,u.stackedOverDimension],p=u.data,g=u.isStackedByIndex,e=p.map(t,function(t,e,i){var n,a,o=p.get(u.stackedDimension,i);if(isNaN(o))return f;g?a=p.getRawIndex(i):n=p.get(u.stackedByDimension,i);for(var r=NaN,s=c-1;0<=s;s--){var l=m[s];if(g||(a=l.data.rawIndexOf(l.stackedByDimension,n)),0<=a){var h=l.data.getByRawIndex(l.stackResultDimension,a);if(0<=o&&0<h||o<=0&&h<0){o+=h,r=h;break;}}}return d[0]=o,d[1]=r,d;});p.hostModel.setData(e),u.data=e;});}function Ah(t,e){Ul.isInstance(t)||(t=Ul.seriesDataToSource(t)),this._source=t;var i=this._data=t.data,n=t.sourceFormat;n===Fl&&(this._offset=0,this._dimSize=e,this._data=i),k(this,Lh[n===Bl?n+"_"+t.seriesLayoutBy:n]);}var Ch=Ah.prototype;Ch.pure=!1;var Lh={arrayRows_column:{pure:Ch.persistent=!0,count:function count(){return Math.max(0,this._data.length-this._source.startIndex);},getItem:function getItem(t){return this._data[t+this._source.startIndex];},appendData:Nh},arrayRows_row:{pure:!0,count:function count(){var t=this._data[0];return t?Math.max(0,t.length-this._source.startIndex):0;},getItem:function getItem(t){t+=this._source.startIndex;for(var e=[],i=this._data,n=0;n<i.length;n++){var a=i[n];e.push(a?a[t]:null);}return e;},appendData:function appendData(){throw new Error('Do not support appendData when set seriesLayoutBy: "row".');}},objectRows:{pure:!0,count:kh,getItem:Ph,appendData:Nh},keyedColumns:{pure:!0,count:function count(){var t=this._source.dimensionsDefine[0].name,e=this._data[t];return e?e.length:0;},getItem:function getItem(t){for(var e=[],i=this._source.dimensionsDefine,n=0;n<i.length;n++){var a=this._data[i[n].name];e.push(a?a[t]:null);}return e;},appendData:function appendData(t){var a=this._data;z(t,function(t,e){for(var i=a[e]||(a[e]=[]),n=0;n<(t||[]).length;n++){i.push(t[n]);}});}},original:{count:kh,getItem:Ph,appendData:Nh},typedArray:{persistent:!(Ch.getSource=function(){return this._source;}),pure:!0,count:function count(){return this._data?this._data.length/this._dimSize:0;},getItem:function getItem(t,e){t-=this._offset,e=e||[];for(var i=this._dimSize*t,n=0;n<this._dimSize;n++){e[n]=this._data[i+n];}return e;},appendData:function appendData(t){this._data=t;},clean:function clean(){this._offset+=this.count(),this._data=null;}}};function kh(){return this._data.length;}function Ph(t){return this._data[t];}function Nh(t){for(var e=0;e<t.length;e++){this._data.push(t[e]);}}var Oh={arrayRows:Eh,objectRows:function objectRows(t,e,i,n){return null!=i?t[n]:t;},keyedColumns:Eh,original:function original(t,e,i,n){var a=ha(t);return null!=i&&a instanceof Array?a[i]:a;},typedArray:Eh};function Eh(t,e,i,n){return null!=i?t[i]:t;}var Rh={arrayRows:zh,objectRows:function objectRows(t,e,i,n){return Bh(t[e],this._dimensionInfos[e]);},keyedColumns:zh,original:function original(t,e,i,n){var a,o=t&&(null==t.value?t:t.value);return this._rawData.pure||!na(a=t)||a instanceof Array||(this.hasItemOption=!0),Bh(o instanceof Array?o[n]:o,this._dimensionInfos[e]);},typedArray:function typedArray(t,e,i,n){return t[n];}};function zh(t,e,i,n){return Bh(t[n],this._dimensionInfos[e]);}function Bh(t,e){var i=e&&e.type;if("ordinal"===i){var n=e&&e.ordinalMeta;return n?n.parseAndCollect(t):t;}return"time"===i&&"number"!=typeof t&&null!=t&&"-"!==t&&(t=+js(t)),null==t||""===t?NaN:+t;}function Vh(t,e,i){if(t){var n=t.getRawDataItem(e);if(null!=n){var a,o,r=t.getProvider().getSource().sourceFormat,s=t.getDimensionInfo(i);return s&&(a=s.name,o=s.index),Oh[r](n,e,o,a);}}}function Gh(t,e,i){if(t){var n=t.getProvider().getSource().sourceFormat;if(n===zl||n===Vl){var a=t.getRawDataItem(e);return n!==zl||R(a)||(a=null),a?a[i]:void 0;}}}var Wh=/\{@(.+?)\}/g,Fh={getDataParams:function getDataParams(t,e){var i=this.getData(e),n=this.getRawValue(t,e),a=i.getRawIndex(t),o=i.getName(t),r=i.getRawDataItem(t),s=i.getItemVisual(t,"color");return{componentType:this.mainType,componentSubType:this.subType,seriesType:"series"===this.mainType?this.subType:null,seriesIndex:this.seriesIndex,seriesId:this.id,seriesName:this.name,name:o,dataIndex:a,data:r,dataType:e,value:n,color:s,marker:hl(s),$vars:["seriesName","name","value"]};},getFormattedLabel:function getFormattedLabel(n,t,e,i,a){t=t||"normal";var o=this.getData(e),r=o.getItemModel(n),s=this.getDataParams(n,e);null!=i&&s.value instanceof Array&&(s.value=s.value[i]);var l=r.get("normal"===t?[a||"label","formatter"]:[t,a||"label","formatter"]);return"function"==typeof l?(s.status=t,l(s)):"string"==typeof l?sl(l,s).replace(Wh,function(t,e){var i=e.length;return"["===e.charAt(0)&&"]"===e.charAt(i-1)&&(e=+e.slice(1,i-1)),Vh(o,n,e);}):void 0;},getRawValue:function getRawValue(t,e){return Vh(this.getData(e),t);},formatTooltip:function formatTooltip(){}};function Hh(t){return new Zh(t);}function Zh(t){t=t||{},this._reset=t.reset,this._plan=t.plan,this._count=t.count,this._onDirty=t.onDirty,this._dirty=!0,this.context;}var Uh=Zh.prototype;Uh.perform=function(t){var e,i,n=this._upstream,a=t&&t.skip;if(this._dirty&&n){var o=this.context;o.data=o.outputData=n.context.outputData;}this.__pipeline&&(this.__pipeline.currentTask=this),this._plan&&!a&&(e=this._plan(this.context)),(this._dirty||"reset"===e)&&(this._dirty=!1,i=function(t,e){var i,n;t._dueIndex=t._outputDueEnd=t._dueEnd=0,t._settedOutputEnd=null,!e&&t._reset&&(i=t._reset(t.context))&&i.progress&&(n=i.forceFirstProgress,i=i.progress);t._progress=i;var a=t._downstream;return a&&a.dirty(),n;}(this,a));var r=t&&t.step;if(this._dueEnd=n?n._outputDueEnd:this._count?this._count(this.context):1/0,this._progress){var s=this._dueIndex,l=Math.min(null!=r?this._dueIndex+r:1/0,this._dueEnd);!a&&(i||s<l)&&this._progress({start:s,end:l},this.context),this._dueIndex=l;var h=null!=this._settedOutputEnd?this._settedOutputEnd:l;this._outputDueEnd=h;}else this._dueIndex=this._outputDueEnd=null!=this._settedOutputEnd?this._settedOutputEnd:this._dueEnd;return this.unfinished();},Uh.dirty=function(){this._dirty=!0,this._onDirty&&this._onDirty(this.context);},Uh.unfinished=function(){return this._progress&&this._dueIndex<this._dueEnd;},Uh.pipe=function(t){(this._downstream!==t||this._dirty)&&((this._downstream=t)._upstream=this,t.dirty());},Uh.dispose=function(){this._disposed||(this._upstream&&(this._upstream._downstream=null),this._downstream&&(this._downstream._upstream=null),this._dirty=!1,this._disposed=!0);},Uh.getUpstream=function(){return this._upstream;},Uh.getDownstream=function(){return this._downstream;},Uh.setOutputEnd=function(t){this._outputDueEnd=this._settedOutputEnd=t;};var jh=ga(),Xh=Cl.extend({type:"series.__base__",seriesIndex:0,coordinateSystem:null,defaultOption:null,legendDataProvider:null,visualColorAccessPath:"itemStyle.color",layoutMode:null,init:function init(t,e,i,n){this.seriesIndex=this.componentIndex,this.dataTask=Hh({count:qh,reset:Kh}),this.dataTask.context={model:this},this.mergeDefaultAndTheme(t,i),Xl(this);var a=this.getInitialData(t,i);Jh(a,this),this.dataTask.context.data=a,jh(this).dataBeforeProcessed=a,Yh(this);},mergeDefaultAndTheme:function mergeDefaultAndTheme(t,e){var i=this.layoutMode,n=i?Ml(t):{},a=this.subType;Cl.hasClass(a)&&(a+="Series"),g(t,e.getTheme().get(this.subType)),g(t,this.getDefaultOption()),sa(t,"label",["show"]),this.fillDataTextStyle(t.data),i&&Sl(t,n,i);},mergeOption:function mergeOption(t,e){t=g(this.option,t,!0),this.fillDataTextStyle(t.data);var i=this.layoutMode;i&&Sl(this.option,t,i),Xl(this);var n=this.getInitialData(t,e);Jh(n,this),this.dataTask.dirty(),this.dataTask.context.data=n,jh(this).dataBeforeProcessed=n,Yh(this);},fillDataTextStyle:function fillDataTextStyle(t){if(t&&!B(t))for(var e=["show"],i=0;i<t.length;i++){t[i]&&t[i].label&&sa(t[i],"label",e);}},getInitialData:function getInitialData(){},appendData:function appendData(t){this.getRawData().appendData(t.data);},getData:function getData(t){var e=tu(this);if(e){var i=e.context.data;return null==t?i:i.getLinkedData(t);}return jh(this).data;},setData:function setData(t){var e=tu(this);if(e){var i=e.context;i.data!==t&&e.modifyOutputEnd&&e.setOutputEnd(t.count()),i.outputData=t,e!==this.dataTask&&(i.data=t);}jh(this).data=t;},getSource:function getSource(){return jl(this).source;},getRawData:function getRawData(){return jh(this).dataBeforeProcessed;},getBaseAxis:function getBaseAxis(){var t=this.coordinateSystem;return t&&t.getBaseAxis&&t.getBaseAxis();},formatTooltip:function formatTooltip(i,l,t){function e(t){return al(Qs(t));}var h=this.getData(),n=h.mapDimension("defaultedTooltip",!0),a=n.length,o=this.getRawValue(i),r=E(o),u=h.getItemVisual(i,"color");R(u)&&u.colorStops&&(u=(u.colorStops[0]||{}).color),u=u||"transparent";var s=1<a||r&&!a?function(t){var r=b(t,function(t,e,i){var n=h.getDimensionInfo(i);return t|(n&&!1!==n.tooltip&&null!=n.displayName);},0),s=[];function e(t,e){var i=h.getDimensionInfo(e);if(i&&!1!==i.otherDims.tooltip){var n=i.type,a=hl({color:u,type:"subItem"}),o=(r?a+al(i.displayName||"-")+": ":"")+al("ordinal"===n?t+"":"time"===n?l?"":cl("yyyy/MM/dd hh:mm:ss",t):Qs(t));o&&s.push(o);}}return n.length?z(n,function(t){e(Vh(h,i,t),t);}):z(t,e),(r?"<br/>":"")+s.join(r?"<br/>":", ");}(o):e(a?Vh(h,i,n[0]):r?o[0]:o),c=hl(u),d=h.getName(i),f=this.name;return da(this)||(f=""),f=f?al(f)+(l?": ":"<br/>"):"",l?c+f+s:f+c+(d?al(d)+": "+s:s);},isAnimationEnabled:function isAnimationEnabled(){if(v.node)return!1;var t=this.getShallow("animation");return t&&this.getData().count()>this.getShallow("animationThreshold")&&(t=!1),t;},restoreData:function restoreData(){this.dataTask.dirty();},getColorFromPalette:function getColorFromPalette(t,e,i){var n=this.ecModel,a=Nl.getColorFromPalette.call(this,t,e,i);return a||(a=n.getColorFromPalette(t,e,i)),a;},coordDimToDataDim:function coordDimToDataDim(t){return this.getRawData().mapDimension(t,!0);},getProgressive:function getProgressive(){return this.get("progressive");},getProgressiveThreshold:function getProgressiveThreshold(){return this.get("progressiveThreshold");},getAxisTooltipData:null,getTooltipPosition:null,pipeTask:null,preventIncremental:null,pipelineContext:null});function Yh(t){var i,e,n,a=t.name;da(t)||(t.name=(i=t.getRawData(),e=i.mapDimension("seriesName",!0),n=[],z(e,function(t){var e=i.getDimensionInfo(t);e.displayName&&n.push(e.displayName);}),n.join(" ")||a));}function qh(t){return t.model.getRawData().count();}function Kh(t){var e=t.model;return e.setData(e.getRawData().cloneShallow()),$h;}function $h(t,e){t.end>e.outputData.count()&&e.model.getRawData().cloneShallow(e.outputData);}function Jh(e,i){z(e.CHANGABLE_METHODS,function(t){e.wrapMethod(t,N(Qh,i));});}function Qh(t){var e=tu(t);e&&e.setOutputEnd(this.count());}function tu(t){var e=(t.ecModel||{}).scheduler,i=e&&e.getPipeline(t.uid);if(i){var n=i.currentTask;if(n){var a=n.agentStubMap;a&&(n=a.get(t.uid));}return n;}}w(Xh,Fh),w(Xh,Nl);var eu=function eu(){this.group=new ii(),this.uid=Ps("viewComponent");};eu.prototype={constructor:eu,init:function init(t,e){},render:function render(t,e,i,n){},dispose:function dispose(){}};var iu=eu.prototype;iu.updateView=iu.updateLayout=iu.updateVisual=function(t,e,i,n){},Sa(eu),Aa(eu,{registerWhenExtend:!0});var nu=function nu(){var s=ga();return function(t){var e=s(t),i=t.pipelineContext,n=e.large,a=e.canProgressiveRender,o=e.large=i.large,r=e.canProgressiveRender=i.canProgressiveRender;return!!(n^o||a^r)&&"reset";};},au=ga(),ou=nu();function ru(){this.group=new ii(),this.uid=Ps("viewChart"),this.renderTask=Hh({plan:uu,reset:cu}),this.renderTask.context={view:this};}var su=ru.prototype={type:"chart",init:function init(t,e){},render:function render(t,e,i,n){},highlight:function highlight(t,e,i,n){hu(t.getData(),n,"emphasis");},downplay:function downplay(t,e,i,n){hu(t.getData(),n,"normal");},remove:function remove(t,e){this.group.removeAll();},dispose:function dispose(){},incrementalPrepareRender:null,incrementalRender:null,updateTransform:null};function lu(t,e){if(t&&(t.trigger(e),"group"===t.type))for(var i=0;i<t.childCount();i++){lu(t.childAt(i),e);}}function hu(e,t,i){var n=pa(e,t);null!=n?z(ra(n),function(t){lu(e.getItemGraphicEl(t),i);}):e.eachItemGraphicEl(function(t){lu(t,i);});}function uu(t){return ou(t.model);}function cu(t){var e=t.model,i=t.ecModel,n=t.api,a=t.payload,o=e.pipelineContext.canProgressiveRender,r=t.view,s=a&&au(a).updateMethod,l=o?"incrementalPrepareRender":s&&r[s]?s:"render";return"render"!==l&&r[l](e,i,n,a),du[l];}su.updateView=su.updateLayout=su.updateVisual=function(t,e,i,n){this.render(t,e,i,n);},Sa(ru),Aa(ru,{registerWhenExtend:!0}),ru.markUpdateMethod=function(t,e){au(t).updateMethod=e;};var du={incrementalPrepareRender:{progress:function progress(t,e){e.view.incrementalRender(t,e.model,e.ecModel,e.api,e.payload);}},render:{forceFirstProgress:!0,progress:function progress(t,e){e.view.render(e.model,e.ecModel,e.api,e.payload);}}},fu="\0__throttleOriginMethod",pu="\0__throttleRate",gu="\0__throttleType";function mu(t,i,n){var a,o,r,s,l,h=0,u=0,c=null;function d(){u=new Date().getTime(),c=null,t.apply(r,s||[]);}i=i||0;var e=function e(){a=new Date().getTime(),r=this,s=arguments;var t=l||i,e=l||n;l=null,o=a-(e?h:u)-t,clearTimeout(c),e?c=setTimeout(d,t):0<=o?d():c=setTimeout(d,-o),h=a;};return e.clear=function(){c&&(clearTimeout(c),c=null);},e.debounceNextCall=function(t){l=t;},e;}function vu(t,e,i,n){var a=t[e];if(a){var o=a[fu]||a,r=a[gu];if(a[pu]!==i||r!==n){if(null==i||!n)return t[e]=o;(a=t[e]=mu(o,i,"debounce"===n))[fu]=o,a[gu]=n,a[pu]=i;}return a;}}function yu(t,e){var i=t[e];i&&i[fu]&&(t[e]=i[fu]);}var xu={createOnAllSeries:!0,performRawSeries:!0,reset:function reset(e,t){var i=e.getData(),n=(e.visualColorAccessPath||"itemStyle.color").split("."),a=e.get(n)||e.getColorFromPalette(e.name,null,t.getSeriesCount());if(i.setVisual("color",a),!t.isSeriesFiltered(e)){"function"!=typeof a||a instanceof Ar||i.each(function(t){i.setItemVisual(t,"color",a(e.getDataParams(t)));});return{dataEach:i.hasItemOption?function(t,e){var i=t.getItemModel(e).get(n,!0);null!=i&&t.setItemVisual(e,"color",i);}:null};}}},_u={toolbox:{brush:{title:{rect:"鐭╁舰閫夋嫨",polygon:"鍦堥��",lineX:"妯悜閫夋嫨",lineY:"绾靛悜閫夋嫨",keep:"淇濇寔閫夋嫨",clear:"娓呴櫎閫夋嫨"}},dataView:{title:"鏁版嵁瑙嗗浘",lang:["鏁版嵁瑙嗗浘","鍏抽棴","鍒锋柊"]},dataZoom:{title:{zoom:"鍖哄煙缂╂斁",back:"鍖哄煙缂╂斁杩樺師"}},magicType:{title:{line:"鍒囨崲涓烘姌绾垮浘",bar:"鍒囨崲涓烘煴鐘跺浘",stack:"鍒囨崲涓哄爢鍙�",tiled:"鍒囨崲涓哄钩閾�"}},restore:{title:"杩樺師"},saveAsImage:{title:"淇濆瓨涓哄浘鐗�",lang:["鍙抽敭鍙﹀瓨涓哄浘鐗�"]}},series:{typeNames:{pie:"楗煎浘",bar:"鏌辩姸鍥�",line:"鎶樼嚎鍥�",scatter:"鏁ｇ偣鍥�",effectScatter:"娑熸吉鏁ｇ偣鍥�",radar:"闆疯揪鍥�",tree:"鏍戝浘",treemap:"鐭╁舰鏍戝浘",boxplot:"绠卞瀷鍥�",candlestick:"K绾垮浘",k:"K绾垮浘",heatmap:"鐑姏鍥�",map:"鍦板浘",parallel:"骞宠鍧愭爣鍥�",lines:"绾垮浘",graph:"鍏崇郴鍥�",sankey:"妗戝熀鍥�",funnel:"婕忔枟鍥�",gauge:"浠〃鐩樺浘",pictorialBar:"璞″舰鏌卞浘",themeRiver:"涓婚娌虫祦鍥�",sunburst:"鏃棩鍥�"}},aria:{general:{withTitle:"杩欐槸涓�涓叧浜庘�渰title}鈥濈殑鍥捐〃銆�",withoutTitle:"杩欐槸涓�涓浘琛紝"},series:{single:{prefix:"",withName:"鍥捐〃绫诲瀷鏄瘂seriesType}锛岃〃绀簕seriesName}銆�",withoutName:"鍥捐〃绫诲瀷鏄瘂seriesType}銆�"},multiple:{prefix:"瀹冪敱{seriesCount}涓浘琛ㄧ郴鍒楃粍鎴愩��",withName:"绗瑊seriesId}涓郴鍒楁槸涓�涓〃绀簕seriesName}鐨剓seriesType}锛�",withoutName:"绗瑊seriesId}涓郴鍒楁槸涓�涓獅seriesType}锛�",separator:{middle:"锛�",end:"銆�"}}},data:{allData:"鍏舵暟鎹槸鈥斺��",partialData:"鍏朵腑锛屽墠{displayCnt}椤规槸鈥斺��",withName:"{name}鐨勬暟鎹槸{value}",withoutName:"{value}",separator:{middle:"锛�",end:""}}}},wu=function wu(t,e){var o=e.getModel("aria");if(o.get("show"))if(o.get("description"))t.setAttribute("aria-label",o.get("description"));else{var c=0;e.eachSeries(function(t,e){++c;},this);var i,d=o.get("data.maxCount")||10,n=o.get("series.maxCount")||10,f=Math.min(c,n);if(!(c<1)){var a=function(){var t=e.getModel("title").option;t&&t.length&&(t=t[0]);return t&&t.text;}();i=a?g(m("general.withTitle"),{title:a}):m("general.withoutTitle");var p=[];i+=g(m(1<c?"series.multiple.prefix":"series.single.prefix"),{seriesCount:c}),e.eachSeries(function(t,e){if(e<f){var i,n=t.get("name"),a="series."+(1<c?"multiple":"single")+".";i=g(i=m(n?a+"withName":a+"withoutName"),{seriesId:t.seriesIndex,seriesName:t.get("name"),seriesType:(u=t.subType,_u.series.typeNames[u]||"鑷畾涔夊浘")});var o=t.getData();(window.data=o).count()>d?i+=g(m("data.partialData"),{displayCnt:d}):i+=m("data.allData");for(var r=[],s=0;s<o.count();s++){if(s<d){var l=o.getName(s),h=Vh(o,s);r.push(g(m(l?"data.withName":"data.withoutName"),{name:l,value:h}));}}i+=r.join(m("data.separator.middle"))+m("data.separator.end"),p.push(i);}var u;}),i+=p.join(m("series.multiple.separator.middle"))+m("series.multiple.separator.end"),t.setAttribute("aria-label",i);}}function g(t,e){if("string"!=typeof t)return t;var i=t;return z(e,function(t,e){i=i.replace(new RegExp("\\{\\s*"+e+"\\s*\\}","g"),t);}),i;}function m(t){var e=o.get(t);if(null==e){for(var i=t.split("."),n=_u.aria,a=0;a<i.length;++a){n=n[i[a]];}return n;}return e;}},bu=Math.PI;function Su(t,e,i,n){this.ecInstance=t,this.api=e,this.unfinished;i=this._dataProcessorHandlers=i.slice(),n=this._visualHandlers=n.slice();this._allHandlers=i.concat(n),this._stageTaskMap=J();}var Mu=Su.prototype;function Iu(l,t,h,u,c){var d;function f(t,e){return t.setDirty&&(!t.dirtyMap||t.dirtyMap.get(e.__pipeline.id));}c=c||{},z(t,function(n,t){if(!c.visualType||c.visualType===n.visualType){var e=l._stageTaskMap.get(n.uid),i=e.seriesTaskMap,a=e.overallTask;if(a){var o,r=a.agentStubMap;r.each(function(t){f(c,t)&&(t.dirty(),o=!0);}),o&&a.dirty(),Tu(a,u);var s=l.getPerformArgs(a,c.block);r.each(function(t){t.perform(s);}),d|=a.perform(s);}else i&&i.each(function(t,e){f(c,t)&&t.dirty();var i=l.getPerformArgs(t,c.block);i.skip=!n.performRawSeries&&h.isSeriesFiltered(t.context.model),Tu(t,u),d|=t.perform(i);});}}),l.unfinished|=d;}Mu.restoreData=function(t,e){t.restoreData(e),this._stageTaskMap.each(function(t){var e=t.overallTask;e&&e.dirty();});},Mu.getPerformArgs=function(t,e){if(t.__pipeline){var i=this._pipelineMap.get(t.__pipeline.id),n=i.context;return{step:!e&&i.progressiveEnabled&&(!n||n.canProgressiveRender)&&t.__idxInPipeline>i.bockIndex?i.step:null};}},Mu.getPipeline=function(t){return this._pipelineMap.get(t);},Mu.updateStreamModes=function(t,e){var i=this._pipelineMap.get(t.uid),n=t.getData().count(),a=i.progressiveEnabled&&e.incrementalPrepareRender&&n>=i.threshold,o=t.get("large")&&n>=t.get("largeThreshold");t.pipelineContext=i.context={canProgressiveRender:a,large:o};},Mu.restorePipelines=function(t){var n=this,a=n._pipelineMap=J();t.eachSeries(function(t){var e=t.getProgressive(),i=t.uid;a.set(i,{id:i,head:null,tail:null,threshold:t.getProgressiveThreshold(),progressiveEnabled:e&&!(t.preventIncremental&&t.preventIncremental()),bockIndex:-1,step:e||700,count:0}),Eu(n,t,t.dataTask);});},Mu.prepareStageTasks=function(){var i=this._stageTaskMap,n=this.ecInstance.getModel(),a=this.api;z(this._allHandlers,function(t){var e=i.get(t.uid)||i.set(t.uid,[]);t.reset&&function(n,a,t,o,r){var s=t.seriesTaskMap||(t.seriesTaskMap=J()),e=a.seriesType,i=a.getTargetSeries;a.createOnAllSeries?o.eachRawSeries(l):e?o.eachRawSeriesByType(e,l):i&&i(o,r).each(l);function l(t){var e=t.uid,i=s.get(e)||s.set(e,Hh({plan:ku,reset:Pu,count:Ou}));i.context={model:t,ecModel:o,api:r,useClearVisual:a.isVisual&&!a.isLayout,plan:a.plan,reset:a.reset,scheduler:n},Eu(n,t,i);}var h=n._pipelineMap;s.each(function(t,e){h.get(e)||(t.dispose(),s.removeKey(e));});}(this,t,e,n,a),t.overallReset&&function(n,t,e,i,a){var o=e.overallTask=e.overallTask||Hh({reset:Du});o.context={ecModel:i,api:a,overallReset:t.overallReset,scheduler:n};var r=o.agentStubMap=o.agentStubMap||J(),s=t.seriesType,l=t.getTargetSeries,h=!0,u=t.modifyOutputEnd;s?i.eachRawSeriesByType(s,c):l?l(i,a).each(c):(h=!1,z(i.getSeries(),c));function c(t){var e=t.uid,i=r.get(e);i||(i=r.set(e,Hh({reset:Au,onDirty:Lu})),o.dirty()),i.context={model:t,overallProgress:h,modifyOutputEnd:u},i.agent=o,i.__block=h,Eu(n,t,i);}var d=n._pipelineMap;r.each(function(t,e){d.get(e)||(t.dispose(),o.dirty(),r.removeKey(e));});}(this,t,e,n,a);},this);},Mu.prepareView=function(t,e,i,n){var a=t.renderTask,o=a.context;o.model=e,o.ecModel=i,o.api=n,a.__block=!t.incrementalPrepareRender,Eu(this,e,a);},Mu.performDataProcessorTasks=function(t,e){Iu(this,this._dataProcessorHandlers,t,e,{block:!0});},Mu.performVisualTasks=function(t,e,i){Iu(this,this._visualHandlers,t,e,i);},Mu.performSeriesTasks=function(t){var e;t.eachSeries(function(t){e|=t.dataTask.perform();}),this.unfinished|=e;},Mu.plan=function(){this._pipelineMap.each(function(t){var e=t.tail;do{if(e.__block){t.bockIndex=e.__idxInPipeline;break;}e=e.getUpstream();}while(e);});};var Tu=Mu.updatePayload=function(t,e){"remain"!==e&&(t.context.payload=e);};function Du(t){t.overallReset(t.ecModel,t.api,t.payload);}function Au(t,e){return t.overallProgress&&Cu;}function Cu(){this.agent.dirty(),this.getDownstream().dirty();}function Lu(){this.agent&&this.agent.dirty();}function ku(t){return t.plan&&t.plan(t.model,t.ecModel,t.api,t.payload);}function Pu(t){if(t.useClearVisual&&t.data.clearAllVisual(),(t.resetDefines=ra(t.reset(t.model,t.ecModel,t.api,t.payload))).length)return Nu;}function Nu(t,e){for(var i=e.data,n=e.resetDefines,a=0;a<n.length;a++){var o=n[a];if(o&&o.dataEach)for(var r=t.start;r<t.end;r++){o.dataEach(i,r);}else o&&o.progress&&o.progress(t,i);}}function Ou(t){return t.data.count();}function Eu(t,e,i){var n=e.uid,a=t._pipelineMap.get(n);!a.head&&(a.head=i),a.tail&&a.tail.pipe(i),(a.tail=i).__idxInPipeline=a.count++,i.__pipeline=a;}Su.wrapStageHandler=function(t,e){return M(t)&&(t={overallReset:t,seriesType:function(t){Ru=null;try{t(zu,Bu);}catch(t){}return Ru;}(t)}),t.uid=Ps("stageHandler"),e&&(t.visualType=e),t;};var Ru,zu={},Bu={};function Vu(t,e){for(var i in e.prototype){t[i]=tt;}}Vu(zu,Jl),Vu(Bu,ih),zu.eachSeriesByType=zu.eachRawSeriesByType=function(t){Ru=t;},zu.eachComponent=function(t){"series"===t.mainType&&t.subType&&(Ru=t.subType);};var Gu=["#37A2DA","#32C5E9","#67E0E3","#9FE6B8","#FFDB5C","#ff9f7f","#fb7293","#E062AE","#E690D1","#e7bcf3","#9d96f5","#8378EA","#96BFFF"],Wu={color:Gu,colorLayer:[["#37A2DA","#ffd85c","#fd7b5f"],["#37A2DA","#67E0E3","#FFDB5C","#ff9f7f","#E062AE","#9d96f5"],["#37A2DA","#32C5E9","#9FE6B8","#FFDB5C","#ff9f7f","#fb7293","#e7bcf3","#8378EA","#96BFFF"],Gu]},Fu="#eee",Hu=function Hu(){return{axisLine:{lineStyle:{color:Fu}},axisTick:{lineStyle:{color:Fu}},axisLabel:{textStyle:{color:Fu}},splitLine:{lineStyle:{type:"dashed",color:"#aaa"}},splitArea:{areaStyle:{color:Fu}}};},Zu=["#dd6b66","#759aa0","#e69d87","#8dc1a9","#ea7e53","#eedd78","#73a373","#73b9bc","#7289ab","#91ca8c","#f49f42"],Uu={color:Zu,backgroundColor:"#333",tooltip:{axisPointer:{lineStyle:{color:Fu},crossStyle:{color:Fu}}},legend:{textStyle:{color:Fu}},textStyle:{color:Fu},title:{textStyle:{color:Fu}},toolbox:{iconStyle:{normal:{borderColor:Fu}}},dataZoom:{textStyle:{color:Fu}},visualMap:{textStyle:{color:Fu}},timeline:{lineStyle:{color:Fu},itemStyle:{normal:{color:Zu[1]}},label:{normal:{textStyle:{color:Fu}}},controlStyle:{normal:{color:Fu,borderColor:Fu}}},timeAxis:Hu(),logAxis:Hu(),valueAxis:Hu(),categoryAxis:Hu(),line:{symbol:"circle"},graph:{color:Zu},gauge:{title:{textStyle:{color:Fu}}},candlestick:{itemStyle:{normal:{color:"#FD1050",color0:"#0CF49B",borderColor:"#FD1050",borderColor0:"#0CF49B"}}}};Uu.categoryAxis.splitLine.show=!1,Cl.extend({type:"dataset",defaultOption:{seriesLayoutBy:Hl,sourceHeader:null,dimensions:null,source:null},optionUpdated:function optionUpdated(){!function(t){var e=t.option.source,i=Wl;if(B(e))i=Fl;else if(E(e))for(var n=0,a=e.length;n<a;n++){var o=e[n];if(null!=o){if(E(o)){i=Bl;break;}if(R(o)){i=Vl;break;}}}else if(R(e)){for(var r in e){if(e.hasOwnProperty(r)&&O(e[r])){i=Gl;break;}}}else if(null!=e)throw new Error("Invalid data");jl(t).sourceFormat=i;}(this);}}),eu.extend({type:"dataset"});var ju=j,Xu=z,Yu=M,qu=R,Ku=Cl.parseClassType,$u=1e3,Ju=1e3,Qu=3e3,tc={PROCESSOR:{FILTER:$u,STATISTIC:5e3},VISUAL:{LAYOUT:Ju,GLOBAL:2e3,CHART:Qu,COMPONENT:4e3,BRUSH:5e3}},ec="__flagInMainProcess",ic="__optionUpdated",nc=/^[a-zA-Z0-9_]+$/;function ac(n){return function(t,e,i){t=t&&t.toLowerCase(),At.prototype[n].call(this,t,e,i);};}function oc(){At.call(this);}function rc(t,e,i){i=i||{},"string"==typeof e&&(e=Cc[e]),this.id,this.group,this._dom=t;var n=this._zr=Jn(t,{renderer:i.renderer||"canvas",devicePixelRatio:i.devicePixelRatio,width:i.width,height:i.height});this._throttledZrFlush=mu(S(n.flush,n),17),(e=A(e))&&Th(e,!0),this._theme=e,this._chartsViews=[],this._chartsMap={},this._componentsViews=[],this._componentsMap={},this._coordSysMgr=new ah();var a,o,r,s,l=this._api=(o=(a=this)._coordSysMgr,k(new ih(a),{getCoordinateSystems:S(o.getCoordinateSystems,o),getComponentByElement:function getComponentByElement(t){for(;t;){var e=t.__ecComponentInfo;if(null!=e)return a._model.getComponent(e.mainType,e.index);t=t.parent;}}}));function h(t,e){return t.__prio-e.__prio;}ui(Ac,h),ui(Ic,h),this._scheduler=new Su(this,l,Ic,Ac),At.call(this),this._messageCenter=new oc(),this._initEvents(),this.resize=S(this.resize,this),this._pendingActions=[],n.animation.on("frame",this._onframe,this),s=this,(r=n).on("rendered",function(){s.trigger("rendered"),!r.animation.isFinished()||s[ic]||s._scheduler.unfinished||s._pendingActions.length||s.trigger("finished");}),q(this);}oc.prototype.on=ac("on"),oc.prototype.off=ac("off"),oc.prototype.one=ac("one"),w(oc,At);var sc=rc.prototype;function lc(t,e,i){var n,a=this._model,o=this._coordSysMgr.getCoordinateSystems();e=va(a,e);for(var r=0;r<o.length;r++){var s=o[r];if(s[t]&&null!=(n=s[t](a,e,i)))return n;}}sc._onframe=function(){if(!this._disposed){var t=this._scheduler;if(this[ic]){var e=this[ic].silent;this[ec]=!0,uc(this),hc.update.call(this),this[ec]=!1,this[ic]=!1,pc.call(this,e),gc.call(this,e);}else if(t.unfinished){var i=1,n=this._model,a=this._api;t.unfinished=!1;do{var o=+new Date();t.performSeriesTasks(n),t.performDataProcessorTasks(n),dc(this,n),t.performVisualTasks(n),xc(this,this._model,a,"remain"),i-=+new Date()-o;}while(0<i&&t.unfinished);t.unfinished||this._zr.flush();}}},sc.getDom=function(){return this._dom;},sc.getZr=function(){return this._zr;},sc.setOption=function(t,e,i){var n;if(qu(e)&&(i=e.lazyUpdate,n=e.silent,e=e.notMerge),this[ec]=!0,!this._model||e){var a=new uh(this._api),o=this._theme,r=this._model=new Jl(null,null,o,a);r.scheduler=this._scheduler,r.init(null,null,o,a);}this._model.setOption(t,Tc),i?(this[ic]={silent:n},this[ec]=!1):(uc(this),hc.update.call(this),this._zr.flush(),this[ic]=!1,this[ec]=!1,pc.call(this,n),gc.call(this,n));},sc.setTheme=function(){console.log("ECharts#setTheme() is DEPRECATED in ECharts 3.0");},sc.getModel=function(){return this._model;},sc.getOption=function(){return this._model&&this._model.getOption();},sc.getWidth=function(){return this._zr.getWidth();},sc.getHeight=function(){return this._zr.getHeight();},sc.getDevicePixelRatio=function(){return this._zr.painter.dpr||window.devicePixelRatio||1;},sc.getRenderedCanvas=function(t){if(v.canvasSupported)return(t=t||{}).pixelRatio=t.pixelRatio||1,t.backgroundColor=t.backgroundColor||this._model.get("backgroundColor"),this._zr.painter.getRenderedCanvas(t);},sc.getSvgDataUrl=function(){if(v.svgSupported){var t=this._zr;return z(t.storage.getDisplayList(),function(t){t.stopAnimation(!0);}),t.painter.pathToDataUrl();}},sc.getDataURL=function(t){var e=(t=t||{}).excludeComponents,i=this._model,n=[],a=this;Xu(e,function(t){i.eachComponent({mainType:t},function(t){var e=a._componentsMap[t.__viewId];e.group.ignore||(n.push(e),e.group.ignore=!0);});});var o="svg"===this._zr.painter.getType()?this.getSvgDataUrl():this.getRenderedCanvas(t).toDataURL("image/"+(t&&t.type||"png"));return Xu(n,function(t){t.group.ignore=!1;}),o;},sc.getConnectedDataURL=function(a){if(v.canvasSupported){var o=this.group,r=Math.min,s=Math.max;if(Pc[o]){var l=1/0,h=1/0,u=-1/0,c=-1/0,d=[],i=a&&a.pixelRatio||1;z(kc,function(t,e){if(t.group===o){var i=t.getRenderedCanvas(A(a)),n=t.getDom().getBoundingClientRect();l=r(n.left,l),h=r(n.top,h),u=s(n.right,u),c=s(n.bottom,c),d.push({dom:i,left:n.left,top:n.top});}});var t=(u*=i)-(l*=i),e=(c*=i)-(h*=i),n=y();n.width=t,n.height=e;var f=Jn(n);return Xu(d,function(t){var e=new _n({style:{x:t.left*i-l,y:t.top*i-h,image:t.dom}});f.add(e);}),f.refreshImmediately(),n.toDataURL("image/"+(a&&a.type||"png"));}return this.getDataURL(a);}},sc.convertToPixel=N(lc,"convertToPixel"),sc.convertFromPixel=N(lc,"convertFromPixel"),sc.containPixel=function(t,a){var o;return z(t=va(this._model,t),function(t,n){0<=n.indexOf("Models")&&z(t,function(t){var e=t.coordinateSystem;if(e&&e.containPoint)o|=!!e.containPoint(a);else if("seriesModels"===n){var i=this._chartsMap[t.__viewId];i&&i.containPoint&&(o|=i.containPoint(a,t));}},this);},this),!!o;},sc.getVisual=function(t,e){var i=(t=va(this._model,t,{defaultMainType:"series"})).seriesModel.getData(),n=t.hasOwnProperty("dataIndexInside")?t.dataIndexInside:t.hasOwnProperty("dataIndex")?i.indexOfRawIndex(t.dataIndex):null;return null!=n?i.getItemVisual(n,e):i.getVisual(e);},sc.getViewOfComponentModel=function(t){return this._componentsMap[t.__viewId];},sc.getViewOfSeriesModel=function(t){return this._chartsMap[t.__viewId];};var hc={prepareAndUpdate:function prepareAndUpdate(t){uc(this),hc.update.call(this,t);},update:function update(t){var e=this._model,i=this._api,n=this._zr,a=this._coordSysMgr,o=this._scheduler;if(e){o.restoreData(e,t),o.performSeriesTasks(e),a.create(e,i),o.performDataProcessorTasks(e,t),a.update(e,i),dc(this,e),vc(e),o.performVisualTasks(e,t),yc(this,e,i,t);var r=e.get("backgroundColor")||"transparent";if(v.canvasSupported)n.setBackgroundColor(r);else{var s=me(r);r=Te(s,"rgb"),0===s[3]&&(r="transparent");}_c(e,i);}},updateTransform:function updateTransform(a){var o=this._model,r=this,s=this._api;if(o){var l=[];o.eachComponent(function(t,e){var i=r.getViewOfComponentModel(e);if(i&&i.__alive)if(i.updateTransform){var n=i.updateTransform(e,o,s,a);n&&n.update&&l.push(i);}else l.push(i);});var n=J();o.eachSeries(function(t){var e=r._chartsMap[t.__viewId];if(e.updateTransform){var i=e.updateTransform(t,o,s,a);i&&i.update&&n.set(t.uid,1);}else n.set(t.uid,1);}),vc(o),this._scheduler.performVisualTasks(o,a,{setDirty:!0,dirtyMap:n}),xc(r,o,s,a,n),_c(o,this._api);}},updateView:function updateView(t){var e=this._model;e&&(ru.markUpdateMethod(t,"updateView"),vc(e),this._scheduler.performVisualTasks(e,t,{setDirty:!0}),yc(this,this._model,this._api,t),_c(e,this._api));},updateVisual:function updateVisual(t){hc.update.call(this,t);},updateLayout:function updateLayout(t){hc.update.call(this,t);}};function uc(t){var e=t._model,i=t._scheduler;i.restorePipelines(e),i.prepareStageTasks(),mc(t,"component",e,i),mc(t,"chart",e,i),i.plan();}function cc(e,i,n,a,t){var o=e._model;if(a){var r={};r[a+"Id"]=n[a+"Id"],r[a+"Index"]=n[a+"Index"],r[a+"Name"]=n[a+"Name"];var s={mainType:a,query:r};t&&(s.subType=t);var l=n.excludeSeriesId;null!=l&&(l=J(ra(l))),o&&o.eachComponent(s,function(t){l&&null!=l.get(t.id)||h(e["series"===a?"_chartsMap":"_componentsMap"][t.__viewId]);},e);}else Xu(e._componentsViews.concat(e._chartsViews),h);function h(t){t&&t.__alive&&t[i]&&t[i](t.__model,o,e._api,n);}}function dc(t,e){var i=t._chartsMap,n=t._scheduler;e.eachSeries(function(t){n.updateStreamModes(t,i[t.__viewId]);});}function fc(e,t){var i=e.type,n=e.escapeConnect,a=Sc[i],o=a.actionInfo,r=(o.update||"update").split(":"),s=r.pop();r=null!=r[0]&&Ku(r[0]),this[ec]=!0;var l=[e],h=!1;e.batch&&(h=!0,l=P(e.batch,function(t){return(t=C(k({},t),e)).batch=null,t;}));var u,c=[],d="highlight"===i||"downplay"===i;Xu(l,function(t){(u=(u=a.action(t,this._model,this._api))||k({},t)).type=o.event||u.type,c.push(u),d?cc(this,s,t,"series"):r&&cc(this,s,t,r.main,r.sub);},this),"none"===s||d||r||(this[ic]?(uc(this),hc.update.call(this,e),this[ic]=!1):hc[s].call(this,e)),u=h?{type:o.event||i,escapeConnect:n,batch:c}:c[0],this[ec]=!1,!t&&this._messageCenter.trigger(u.type,u);}function pc(t){for(var e=this._pendingActions;e.length;){var i=e.shift();fc.call(this,i,t);}}function gc(t){!t&&this.trigger("updated");}function mc(t,e,a,o){for(var r="component"===e,s=r?t._componentsViews:t._chartsViews,l=r?t._componentsMap:t._chartsMap,h=t._zr,u=t._api,i=0;i<s.length;i++){s[i].__alive=!1;}function n(t){var e="_ec_"+t.id+"_"+t.type,i=l[e];if(!i){var n=Ku(t.type);(i=new(r?eu.getClass(n.main,n.sub):ru.getClass(n.sub))()).init(a,u),l[e]=i,s.push(i),h.add(i.group);}t.__viewId=i.__id=e,i.__alive=!0,i.__model=t,i.group.__ecComponentInfo={mainType:t.mainType,index:t.componentIndex},!r&&o.prepareView(i,t,a,u);}r?a.eachComponent(function(t,e){"series"!==t&&n(e);}):a.eachSeries(n);for(i=0;i<s.length;){var c=s[i];c.__alive?i++:(!r&&c.renderTask.dispose(),h.remove(c.group),c.dispose(a,u),s.splice(i,1),delete l[c.__id],c.__id=c.group.__ecComponentInfo=null);}}function vc(t){t.clearColorPalette(),t.eachSeries(function(t){t.clearColorPalette();});}function yc(t,e,i,n){var a,o,r,s,l;a=t,o=e,r=i,s=n,Xu(l||a._componentsViews,function(t){var e=t.__model;t.render(e,o,r,s),bc(e,t);}),Xu(t._chartsViews,function(t){t.__alive=!1;}),xc(t,e,i,n),Xu(t._chartsViews,function(t){t.__alive||t.remove(e,i);});}function xc(o,t,e,r,s){var l,i,n,a,h,u=o._scheduler;t.eachSeries(function(t){var e=o._chartsMap[t.__viewId];e.__alive=!0;var i,n,a=e.renderTask;u.updatePayload(a,r),s&&s.get(t.uid)&&a.dirty(),l|=a.perform(u.getPerformArgs(a)),e.group.silent=!!t.get("silent"),bc(t,e),i=e,n=t.get("blendMode")||null,i.group.traverse(function(t){t.isGroup||t.style.blend!==n&&t.setStyle("blend",n),t.eachPendingDisplayable&&t.eachPendingDisplayable(function(t){t.setStyle("blend",n);});});}),u.unfinished|=l,i=o._zr,n=t,a=i.storage,h=0,a.traverse(function(t){t.isGroup||h++;}),h>n.get("hoverLayerThreshold")&&!v.node&&a.traverse(function(t){t.isGroup||(t.useHoverLayer=!0);}),wu(o._zr.dom,t);}function _c(e,i){Xu(Dc,function(t){t(e,i);});}sc.resize=function(t){this._zr.resize(t);var e=this._model;if(this._loadingFX&&this._loadingFX.resize(),e){var i=e.resetOption("media"),n=t&&t.silent;this[ec]=!0,i&&uc(this),hc.update.call(this),this[ec]=!1,pc.call(this,n),gc.call(this,n);}},sc.showLoading=function(t,e){if(qu(t)&&(e=t,t=""),t=t||"default",this.hideLoading(),Lc[t]){var i=Lc[t](this._api,e),n=this._zr;this._loadingFX=i,n.add(i);}},sc.hideLoading=function(){this._loadingFX&&this._zr.remove(this._loadingFX),this._loadingFX=null;},sc.makeActionFromEvent=function(t){var e=k({},t);return e.type=Mc[t.type],e;},sc.dispatchAction=function(t,e){qu(e)||(e={silent:!!e}),Sc[t.type]&&this._model&&(this[ec]?this._pendingActions.push(t):(fc.call(this,t,e.silent),e.flush?this._zr.flush(!0):!1!==e.flush&&v.browser.weChat&&this._throttledZrFlush(),pc.call(this,e.silent),gc.call(this,e.silent)));},sc.appendData=function(t){var e=t.seriesIndex;this.getModel().getSeriesByIndex(e).appendData(t),this._scheduler.unfinished=!0;},sc.on=ac("on"),sc.off=ac("off"),sc.one=ac("one");var wc=["click","dblclick","mouseover","mouseout","mousemove","mousedown","mouseup","globalout","contextmenu"];function bc(t,e){var i=t.get("z"),n=t.get("zlevel");e.group.traverse(function(t){"group"!==t.type&&(null!=i&&(t.z=i),null!=n&&(t.zlevel=n));});}sc._initEvents=function(){Xu(wc,function(o){this._zr.on(o,function(t){var e,i=this.getModel(),n=t.target;if("globalout"===o)e={};else if(n&&null!=n.dataIndex){var a=n.dataModel||i.getSeriesByIndex(n.seriesIndex);e=a&&a.getDataParams(n.dataIndex,n.dataType)||{};}else n&&n.eventData&&(e=k({},n.eventData));e&&(e.event=t,e.type=o,this.trigger(o,e));},this);},this),Xu(Mc,function(t,e){this._messageCenter.on(e,function(t){this.trigger(e,t);},this);},this);},sc.isDisposed=function(){return this._disposed;},sc.clear=function(){this.setOption({series:[]},!0);},sc.dispose=function(){if(!this._disposed){this._disposed=!0,xa(this.getDom(),Ec,"");var e=this._api,i=this._model;Xu(this._componentsViews,function(t){t.dispose(i,e);}),Xu(this._chartsViews,function(t){t.dispose(i,e);}),this._zr.dispose(),delete kc[this.id];}},w(rc,At);var Sc={},Mc={},Ic=[],Tc=[],Dc=[],Ac=[],Cc={},Lc={},kc={},Pc={},Nc=new Date()-0,Oc=new Date()-0,Ec="_echarts_instance_",Rc={};function zc(t){Pc[t]=!1;}var Bc=zc;function Vc(t){return kc[(e=t,i=Ec,e.getAttribute?e.getAttribute(i):e[i])];var e,i;}function Gc(t,e){Cc[t]=e;}function Wc(t){Tc.push(t);}function Fc(t,e){Xc(Ic,t,e,$u);}function Hc(t,e,i){"function"==typeof e&&(i=e,e="");var n=qu(t)?t.type:[t,t={event:e}][0];t.event=(t.event||n).toLowerCase(),e=t.event,ju(nc.test(n)&&nc.test(e)),Sc[n]||(Sc[n]={action:i,actionInfo:t}),Mc[e]=n;}function Zc(t,e){ah.register(t,e);}function Uc(t,e){Xc(Ac,t,e,Ju,"layout");}function jc(t,e){Xc(Ac,t,e,Qu,"visual");}function Xc(t,e,i,n,a){(Yu(e)||qu(e))&&(i=e,e=n);var o=Su.wrapStageHandler(i,a);return o.__prio=e,o.__raw=i,t.push(o),o;}function Yc(t,e){Lc[t]=e;}function qc(t){return Cl.extend(t);}function Kc(t){return eu.extend(t);}function $c(t){return Xh.extend(t);}function Jc(t){return ru.extend(t);}function Qc(t){return Rc[t];}jc(2e3,xu),Wc(Th),Fc(5e3,function(t){var o=J();t.eachSeries(function(t){var e=t.get("stack");if(e){var i=o.get(e)||o.set(e,[]),n=t.getData(),a={stackResultDimension:n.getCalculationInfo("stackResultDimension"),stackedOverDimension:n.getCalculationInfo("stackedOverDimension"),stackedDimension:n.getCalculationInfo("stackedDimension"),stackedByDimension:n.getCalculationInfo("stackedByDimension"),isStackedByIndex:n.getCalculationInfo("isStackedByIndex"),data:n,seriesModel:t};if(!a.stackedDimension||!a.isStackedByIndex&&!a.stackedByDimension)return;i.length&&n.setCalculationInfo("stackedOnSeries",i[i.length-1].seriesModel),i.push(a);}}),o.each(Dh);}),Yc("default",function(n,t){C(t=t||{},{text:"loading",color:"#c23531",textColor:"#000",maskColor:"rgba(255, 255, 255, 0.8)",zlevel:0});var a=new wr({style:{fill:t.maskColor},zlevel:t.zlevel,z:1e4}),o=new Tr({shape:{startAngle:-bu/2,endAngle:-bu/2+.1,r:10},style:{stroke:t.color,lineCap:"round",lineWidth:5},zlevel:t.zlevel,z:10001}),r=new wr({style:{fill:"none",text:t.text,textPosition:"right",textDistance:10,textFill:t.textColor},zlevel:t.zlevel,z:10001});o.animateShape(!0).when(1e3,{endAngle:3*bu/2}).start("circularInOut"),o.animateShape(!0).when(1e3,{startAngle:3*bu/2}).delay(300).start("circularInOut");var e=new ii();return e.add(o),e.add(r),e.add(a),e.resize=function(){var t=n.getWidth()/2,e=n.getHeight()/2;o.setShape({cx:t,cy:e});var i=o.shape.r;r.setShape({x:t-i,y:e-i,width:2*i,height:2*i}),a.setShape({x:0,y:0,width:n.getWidth(),height:n.getHeight()});},e.resize(),e;}),Hc({type:"highlight",event:"highlight",update:"highlight"},tt),Hc({type:"downplay",event:"downplay",update:"downplay"},tt),Gc("light",Wu),Gc("dark",Uu);function td(t){return t;}function ed(t,e,i,n,a){this._old=t,this._new=e,this._oldKeyGetter=i||td,this._newKeyGetter=n||td,this.context=a;}function id(t,e,i,n,a){for(var o=0;o<t.length;o++){var r="_ec_"+a[n](t[o],o),s=e[r];null==s?(i.push(r),e[r]=o):(s.length||(e[r]=s=[s]),s.push(o));}}ed.prototype={constructor:ed,add:function add(t){return this._add=t,this;},update:function update(t){return this._update=t,this;},remove:function remove(t){return this._remove=t,this;},execute:function execute(){var t=this._old,e=this._new,i={},n=[],a=[];for(id(t,{},n,"_oldKeyGetter",this),id(e,i,a,"_newKeyGetter",this),o=0;o<t.length;o++){if(null!=(s=i[r=n[o]]))(h=s.length)?(1===h&&(i[r]=null),s=s.unshift()):i[r]=null,this._update&&this._update(s,o);else this._remove&&this._remove(o);}for(var o=0;o<a.length;o++){var r=a[o];if(i.hasOwnProperty(r)){var s;if(null==(s=i[r]))continue;if(s.length)for(var l=0,h=s.length;l<h;l++){this._add&&this._add(s[l]);}else this._add&&this._add(s);}}}};var nd=J(["tooltip","label","itemName","itemId","seriesName"]);function ad(t){return"category"===t?"ordinal":"time"===t?"time":"float";}var od=R,rd="undefined",sd="e\0\0",ld={float:(typeof Float64Array==="undefined"?"undefined":_typeof(Float64Array))===rd?Array:Float64Array,int:(typeof Int32Array==="undefined"?"undefined":_typeof(Int32Array))===rd?Array:Int32Array,ordinal:Array,number:Array,time:Array},hd=(typeof Uint32Array==="undefined"?"undefined":_typeof(Uint32Array))===rd?Array:Uint32Array,ud=(typeof Uint16Array==="undefined"?"undefined":_typeof(Uint16Array))===rd?Array:Uint16Array;function cd(t){return 65535<t._rawCount?hd:ud;}var dd=["hasItemOption","_nameList","_idList","_calculationInfo","_invertedIndicesMap","_rawData","_rawExtent","_chunkSize","_chunkCount","_dimValueGetter","_count","_rawCount","_nameDimIdx","_idDimIdx"];function fd(e,i){z(dd.concat(i.__wrappedMethods||[]),function(t){i.hasOwnProperty(t)&&(e[t]=i[t]);}),e.__wrappedMethods=i.__wrappedMethods;}var pd=function pd(t,e){t=t||["x","y"];for(var i={},n=[],a={},o=0;o<t.length;o++){var r=t[o];D(r)&&(r={name:r});var s=r.name;r.type=r.type||"float",r.coordDim||(r.coordDim=s,r.coordDimIndex=0),r.otherDims=r.otherDims||{},n.push(s),(i[s]=r).index=o,r.createInvertedIndices&&(a[s]=[]);}this.dimensions=n,this._dimensionInfos=i,this.hostModel=e,this.dataType,this._indices=null,this._count=0,this._rawCount=0,this._storage={},this._nameList=[],this._idList=[],this._optionModels=[],this._visual={},this._layout={},this._itemVisuals=[],this.hasItemVisual={},this._itemLayouts=[],this._graphicEls=[],this._chunkSize=1e5,this._chunkCount=0,this._rawData,this._rawExtent={},this._extent={},this._approximateExtent={},this._dimensionsSummary=function(o){var t={},r=t.encode={},s=J(),l=[];z(o.dimensions,function(t){var e,a=o.getDimensionInfo(t),i=a.coordDim;if(i){var n=r[i];r.hasOwnProperty(i)||(n=r[i]=[]),n[a.coordDimIndex]=t,a.isExtraCoord||(s.set(i,1),"ordinal"!==(e=a.type)&&"time"!==e&&(l[0]=t));}nd.each(function(t,e){var i=r[e];r.hasOwnProperty(e)||(i=r[e]=[]);var n=a.otherDims[e];null!=n&&!1!==n&&(i[n]=a.name);});});var n=[],a={};s.each(function(t,e){var i=r[e];a[e]=i[0],n=n.concat(i);}),t.dataDimsOnCoord=n,t.encodeFirstDimNotExtra=a;var e=r.label;e&&e.length&&(l=e.slice());var i=l.slice(),h=r.tooltip;return h&&h.length&&(i=h.slice()),r.defaultedLabel=l,r.defaultedTooltip=i,t;}(this),this._invertedIndicesMap=a,this._calculationInfo={};},gd=pd.prototype;function md(t,e,i){var n;if(null!=e){var a=t._chunkSize,o=Math.floor(i/a),r=i%a,s=t.dimensions[e],l=t._storage[s][o];if(l){n=l[r];var h=t._dimensionInfos[s].ordinalMeta;h&&(n=h.categories[n]);}}return n;}function vd(t){return t;}function yd(t){return t<this._count&&0<=t?this._indices[t]:-1;}function xd(t,e){var i=t._idList[e];return null==i&&(i=md(t,t._idDimIdx,e)),null==i&&(i=sd+e),i;}function _d(t){return E(t)||(t=[t]),t;}function wd(t,e){var i=t.dimensions,n=new pd(P(i,t.getDimensionInfo,t),t.hostModel);fd(n,t);for(var a=n._storage={},o=t._storage,r=k({},t._rawExtent),s=0;s<i.length;s++){var l=i[s];o[l]&&(0<=L(e,l)?(a[l]=bd(o[l]),r[l]=Sd()):a[l]=o[l]);}return n;}function bd(t){for(var e,i,n=new Array(t.length),a=0;a<t.length;a++){n[a]=(e=t[a],i=void 0,(i=e.constructor)===Array?e.slice():new i(e));}return n;}function Sd(){return[1/0,-1/0];}gd.type="list",gd.hasItemOption=!0,gd.getDimension=function(t){return isNaN(t)||(t=this.dimensions[t]||t),t;},gd.getDimensionInfo=function(t){return this._dimensionInfos[this.getDimension(t)];},gd.getDimensionsOnCoord=function(){return this._dimensionsSummary.dataDimsOnCoord.slice();},gd.mapDimension=function(t,e){var i=this._dimensionsSummary;if(null==e)return i.encodeFirstDimNotExtra[t];var n=i.encode[t];return!0===e?(n||[]).slice():n&&n[e];},gd.initData=function(t,e,i){(Ul.isInstance(t)||O(t))&&(t=new Ah(t,this.dimensions.length)),this._rawData=t,this._storage={},this._indices=null,this._nameList=e||[],this._idList=[],this._nameRepeatCount={},i||(this.hasItemOption=!1),this.defaultDimValueGetter=Rh[this._rawData.getSource().sourceFormat],this._dimValueGetter=i=i||this.defaultDimValueGetter,this._rawExtent={},this._initDataFromProvider(0,t.count()),t.pure&&(this.hasItemOption=!1);},gd.getProvider=function(){return this._rawData;},gd.appendData=function(t){var e=this._rawData,i=this.count();e.appendData(t);var n=e.count();e.persistent||(n+=i),this._initDataFromProvider(i,n);},gd._initDataFromProvider=function(t,e){if(!(e<=t)){for(var i,n=this._chunkSize,a=this._rawData,o=this._storage,r=this.dimensions,s=r.length,l=this._dimensionInfos,h=this._nameList,u=this._idList,c=this._rawExtent,d=this._nameRepeatCount={},f=this._chunkCount,p=f-1,g=0;g<s;g++){c[A=r[g]]||(c[A]=Sd());var m=l[A];0===m.otherDims.itemName&&(i=this._nameDimIdx=g),0===m.otherDims.itemId&&(this._idDimIdx=g);var v=ld[m.type];o[A]||(o[A]=[]);var y=o[A][p];if(y&&y.length<n){for(var x=new v(Math.min(e-p*n,n)),_=0;_<y.length;_++){x[_]=y[_];}o[A][p]=x;}for(var w=f*n;w<e;w+=n){o[A].push(new v(Math.min(e-w,n)));}this._chunkCount=o[A].length;}for(var b,S,M=new Array(s),I=t;I<e;I++){M=a.getItem(I,M);var T=Math.floor(I/n),D=I%n;for(w=0;w<s;w++){var A,C=o[A=r[w]][T],L=this._dimValueGetter(M,A,I,w);C[D]=L;var k=c[A];L<k[0]&&(k[0]=L),L>k[1]&&(k[1]=L);}if(!a.pure){var P=h[I];if(M&&null==P)if(null!=M.name)h[I]=P=M.name;else if(null!=i){var N=r[i],O=o[N][T];if(O){P=O[D];var E=l[N].ordinalMeta;E&&(P=E.categories[P]);}}var R=null==M?null:M.id;null==R&&null!=P&&(d[P]=d[P]||0,0<d[R=P]&&(R+="__ec__"+d[P]),d[P]++),null!=R&&(u[I]=R);}}!a.persistent&&a.clean&&a.clean(),this._rawCount=this._count=e,this._extent={},z(S=(b=this)._invertedIndicesMap,function(t,e){var i=b._dimensionInfos[e],n=i.ordinalMeta;if(n){t=S[e]=new hd(n.categories.length);for(var a=0;a<t.length;a++){t[a]=NaN;}for(var a=0;a<b._count;a++){t[b.get(e,a)]=a;}}});}},gd.count=function(){return this._count;},gd.getIndices=function(){var t=this._indices;if(t){var e=t.constructor,i=this._count;if(e===Array){a=new e(i);for(var n=0;n<i;n++){a[n]=t[n];}}else a=new e(t.buffer,0,i);}else{var a=new(e=cd(this))(this.count());for(n=0;n<a.length;n++){a[n]=n;}}return a;},gd.get=function(t,e){if(!(0<=e&&e<this._count))return NaN;var i=this._storage;if(!i[t])return NaN;e=this.getRawIndex(e);var n=Math.floor(e/this._chunkSize),a=e%this._chunkSize;return i[t][n][a];},gd.getByRawIndex=function(t,e){if(!(0<=e&&e<this._rawCount))return NaN;var i=this._storage[t];if(!i)return NaN;var n=Math.floor(e/this._chunkSize),a=e%this._chunkSize;return i[n][a];},gd._getFast=function(t,e){var i=Math.floor(e/this._chunkSize),n=e%this._chunkSize;return this._storage[t][i][n];},gd.getValues=function(t,e){var i=[];E(t)||(e=t,t=this.dimensions);for(var n=0,a=t.length;n<a;n++){i.push(this.get(t[n],e));}return i;},gd.hasValue=function(t){for(var e=this._dimensionsSummary.dataDimsOnCoord,i=this._dimensionInfos,n=0,a=e.length;n<a;n++){if("ordinal"!==i[e[n]].type&&isNaN(this.get(e[n],t)))return!1;}return!0;},gd.getDataExtent=function(t){t=this.getDimension(t);var e=this._storage[t],i=Sd();if(!e)return i;var n,a=this.count();if(!this._indices)return this._rawExtent[t].slice();if(n=this._extent[t])return n.slice();for(var o=(n=i)[0],r=n[1],s=0;s<a;s++){var l=this._getFast(t,this.getRawIndex(s));l<o&&(o=l),r<l&&(r=l);}return n=[o,r],this._extent[t]=n;},gd.getApproximateExtent=function(t){return t=this.getDimension(t),this._approximateExtent[t]||this.getDataExtent(t);},gd.setApproximateExtent=function(t,e){e=this.getDimension(e),this._approximateExtent[e]=t.slice();},gd.getCalculationInfo=function(t){return this._calculationInfo[t];},gd.setCalculationInfo=function(t,e){od(t)?k(this._calculationInfo,t):this._calculationInfo[t]=e;},gd.getSum=function(t){var e=0;if(this._storage[t])for(var i=0,n=this.count();i<n;i++){var a=this.get(t,i);isNaN(a)||(e+=a);}return e;},gd.getMedian=function(t){var i=[];this.each(t,function(t,e){isNaN(t)||i.push(t);});var e=[].concat(i).sort(function(t,e){return t-e;}),n=this.count();return 0===n?0:n%2==1?e[(n-1)/2]:(e[n/2]+e[n/2-1])/2;},gd.rawIndexOf=function(t,e){var i=(t&&this._invertedIndicesMap[t])[e];return null==i||isNaN(i)?-1:i;},gd.indexOfName=function(t){for(var e=0,i=this.count();e<i;e++){if(this.getName(e)===t)return e;}return-1;},gd.indexOfRawIndex=function(t){if(!this._indices)return t;if(t>=this._rawCount||t<0)return-1;var e=this._indices,i=e[t];if(null!=i&&i<this._count&&i===t)return t;for(var n=0,a=this._count-1;n<=a;){var o=(n+a)/2|0;if(e[o]<t)n=o+1;else{if(!(e[o]>t))return o;a=o-1;}}return-1;},gd.indicesOfNearest=function(t,e,i){var n=[];if(!this._storage[t])return n;null==i&&(i=1/0);for(var a=Number.MAX_VALUE,o=-1,r=0,s=this.count();r<s;r++){var l=e-this.get(t,r),h=Math.abs(l);l<=i&&h<=a&&((h<a||0<=l&&o<0)&&(a=h,o=l,n.length=0),n.push(r));}return n;},gd.getRawIndex=vd,gd.getRawDataItem=function(t){if(this._rawData.persistent)return this._rawData.getItem(this.getRawIndex(t));for(var e=[],i=0;i<this.dimensions.length;i++){var n=this.dimensions[i];e.push(this.get(n,t));}return e;},gd.getName=function(t){var e=this.getRawIndex(t);return this._nameList[e]||md(this,this._nameDimIdx,e)||"";},gd.getId=function(t){return xd(this,this.getRawIndex(t));},gd.each=function(t,e,i,n){if(this._count){"function"==typeof t&&(n=i,i=e,e=t,t=[]),i=i||n||this;for(var a=(t=P(_d(t),this.getDimension,this)).length,o=0;o<this.count();o++){switch(a){case 0:e.call(i,o);break;case 1:e.call(i,this.get(t[0],o),o);break;case 2:e.call(i,this.get(t[0],o),this.get(t[1],o),o);break;default:for(var r=0,s=[];r<a;r++){s[r]=this.get(t[r],o);}s[r]=o,e.apply(i,s);}}}},gd.filterSelf=function(t,e,i,n){if(this._count){"function"==typeof t&&(n=i,i=e,e=t,t=[]),i=i||n||this,t=P(_d(t),this.getDimension,this);for(var a=this.count(),o=new(cd(this))(a),r=[],s=t.length,l=0,h=t[0],u=0;u<a;u++){var c,d=this.getRawIndex(u);if(0===s)c=e.call(i,u);else if(1===s){var f=this._getFast(h,d);c=e.call(i,f,u);}else{for(var p=0;p<s;p++){r[p]=this._getFast(h,d);}r[p]=u,c=e.apply(i,r);}c&&(o[l++]=d);}return l<a&&(this._indices=o),this._count=l,this._extent={},this.getRawIndex=this._indices?yd:vd,this;}},gd.selectRange=function(t){if(this._count){var e=[];for(var i in t){t.hasOwnProperty(i)&&e.push(i);}var n=e.length;if(n){var a=this.count(),o=new(cd(this))(a),r=0,s=e[0],l=t[s][0],h=t[s][1],u=!1;if(!this._indices){var c=0;if(1===n){for(var d=this._storage[e[0]],f=0;f<this._chunkCount;f++){for(var p=d[f],g=Math.min(this._count-f*this._chunkSize,this._chunkSize),m=0;m<g;m++){(l<=(w=p[m])&&w<=h||isNaN(w))&&(o[r++]=c),c++;}}u=!0;}else if(2===n){d=this._storage[s];var v=this._storage[e[1]],y=t[e[1]][0],x=t[e[1]][1];for(f=0;f<this._chunkCount;f++){p=d[f];var _=v[f];for(g=Math.min(this._count-f*this._chunkSize,this._chunkSize),m=0;m<g;m++){var w=p[m],b=_[m];(l<=w&&w<=h||isNaN(w))&&(y<=b&&b<=x||isNaN(b))&&(o[r++]=c),c++;}}u=!0;}}if(!u)if(1===n)for(m=0;m<a;m++){var S=this.getRawIndex(m);(l<=(w=this._getFast(s,S))&&w<=h||isNaN(w))&&(o[r++]=S);}else for(m=0;m<a;m++){var M=!0;for(S=this.getRawIndex(m),f=0;f<n;f++){var I=e[f];((w=this._getFast(i,S))<t[I][0]||w>t[I][1])&&(M=!1);}M&&(o[r++]=this.getRawIndex(m));}return r<a&&(this._indices=o),this._count=r,this._extent={},this.getRawIndex=this._indices?yd:vd,this;}}},gd.mapArray=function(t,e,i,n){"function"==typeof t&&(n=i,i=e,e=t,t=[]),i=i||n||this;var a=[];return this.each(t,function(){a.push(e&&e.apply(this,arguments));},i),a;},gd.map=function(t,e,i,n){i=i||n||this;var a=wd(this,t=P(_d(t),this.getDimension,this));a._indices=this._indices,a.getRawIndex=a._indices?yd:vd;for(var o=a._storage,r=[],s=this._chunkSize,l=t.length,h=this.count(),u=[],c=a._rawExtent,d=0;d<h;d++){for(var f=0;f<l;f++){u[f]=this.get(t[f],d);}u[l]=d;var p=e&&e.apply(i,u);if(null!=p){"object"!=(typeof p==="undefined"?"undefined":_typeof(p))&&(r[0]=p,p=r);for(var g=this.getRawIndex(d),m=Math.floor(g/s),v=g%s,y=0;y<p.length;y++){var x=t[y],_=p[y],w=c[x],b=o[x];b&&(b[m][v]=_),_<w[0]&&(w[0]=_),_>w[1]&&(w[1]=_);}}}return a;},gd.downSample=function(t,e,i,n){for(var a=wd(this,[t]),o=a._storage,r=[],s=Math.floor(1/e),l=o[t],h=this.count(),u=this._chunkSize,c=a._rawExtent[t],d=new(cd(this))(h),f=0,p=0;p<h;p+=s){h-p<s&&(s=h-p,r.length=s);for(var g=0;g<s;g++){var m=this.getRawIndex(p+g),v=Math.floor(m/u),y=m%u;r[g]=l[v][y];}var x=i(r),_=this.getRawIndex(Math.min(p+n(r,x)||0,h-1)),w=_%u;(l[Math.floor(_/u)][w]=x)<c[0]&&(c[0]=x),x>c[1]&&(c[1]=x),d[f++]=_;}return a._count=f,a._indices=d,a.getRawIndex=yd,a;},gd.getItemModel=function(t){var e=this.hostModel;return new As(this.getRawDataItem(t),e,e&&e.ecModel);},gd.diff=function(e){var i=this;return new ed(e?e.getIndices():[],this.getIndices(),function(t){return xd(e,t);},function(t){return xd(i,t);});},gd.getVisual=function(t){var e=this._visual;return e&&e[t];},gd.setVisual=function(t,e){if(od(t))for(var i in t){t.hasOwnProperty(i)&&this.setVisual(i,t[i]);}else this._visual=this._visual||{},this._visual[t]=e;},gd.setLayout=function(t,e){if(od(t))for(var i in t){t.hasOwnProperty(i)&&this.setLayout(i,t[i]);}else this._layout[t]=e;},gd.getLayout=function(t){return this._layout[t];},gd.getItemLayout=function(t){return this._itemLayouts[t];},gd.setItemLayout=function(t,e,i){this._itemLayouts[t]=i?k(this._itemLayouts[t]||{},e):e;},gd.clearItemLayouts=function(){this._itemLayouts.length=0;},gd.getItemVisual=function(t,e,i){var n=this._itemVisuals[t],a=n&&n[e];return null!=a||i?a:this.getVisual(e);},gd.setItemVisual=function(t,e,i){var n=this._itemVisuals[t]||{},a=this.hasItemVisual;if(this._itemVisuals[t]=n,od(e))for(var o in e){e.hasOwnProperty(o)&&(n[o]=e[o],a[o]=!0);}else n[e]=i,a[e]=!0;},gd.clearAllVisual=function(){this._visual={},this._itemVisuals=[],this.hasItemVisual={};};var Md=function Md(t){t.seriesIndex=this.seriesIndex,t.dataIndex=this.dataIndex,t.dataType=this.dataType;};function Id(t,e,i){Ul.isInstance(e)||(e=Ul.seriesDataToSource(e)),i=i||{},t=(t||[]).slice();for(var n,a,o,r,s,l=(i.dimsDef||[]).slice(),h=J(i.encodeDef),u=J(),c=J(),d=[],f=(n=e,a=t,o=l,r=i.dimCount,s=Math.max(n.dimensionsDetectCount||1,a.length,o.length,r||0),z(a,function(t){var e=t.dimsDef;e&&(s=Math.max(s,e.length));}),s),p=0;p<f;p++){var g=l[p]=k({},R(l[p])?l[p]:{name:l[p]}),m=g.name,v=d[p]={otherDims:{}};null!=m&&null==u.get(m)&&(v.name=v.displayName=m,u.set(m,p)),null!=g.type&&(v.type=g.type),null!=g.displayName&&(v.displayName=g.displayName);}h.each(function(t,i){t=ra(t).slice();var n=h.set(i,[]);z(t,function(t,e){D(t)&&(t=u.get(t)),null!=t&&t<f&&(n[e]=t,x(d[t],i,e));});});var y=0;function x(t,e,i){null!=nd.get(e)?t.otherDims[e]=i:(t.coordDim=e,t.coordDimIndex=i,c.set(e,!0));}z(t,function(n,t){var a,o,r;if(D(n))a=n,n={};else{a=n.name;var e=n.ordinalMeta;n.ordinalMeta=null,(n=A(n)).ordinalMeta=e,o=n.dimsDef,r=n.otherDims,n.name=n.coordDim=n.coordDimIndex=n.dimsDef=n.otherDims=null;}var i=ra(h.get(a));if(!i.length)for(var s=0;s<(o&&o.length||1);s++){for(;y<d.length&&null!=d[y].coordDim;){y++;}y<d.length&&i.push(y++);}z(i,function(t,e){var i=d[t];x(C(i,n),a,e),null==i.name&&o&&(i.name=i.displayName=o[e]),r&&C(i.otherDims,r);});});var _=i.generateCoord,w=i.generateCoordCount,b=null!=w;w=_?w||1:0;for(var S,M,I=_||"value",T=0;T<f;T++){null==(v=d[T]=d[T]||{}).coordDim&&(v.coordDim=Td(I,c,b),v.coordDimIndex=0,(!_||w<=0)&&(v.isExtraCoord=!0),w--),null==v.name&&(v.name=Td(v.coordDim,u)),null==v.type&&(S=e,M=T,v.name,Kl(S.data,S.sourceFormat,S.seriesLayoutBy,S.dimensionsDefine,S.startIndex,M))&&(v.type="ordinal");}return d;}function Td(t,e,i){if(i||null!=e.get(t)){for(var n=0;null!=e.get(t+n);){n++;}t+=n;}return e.set(t,!0),t;}gd.setItemGraphicEl=function(t,e){var i=this.hostModel;e&&(e.dataIndex=t,e.dataType=this.dataType,e.seriesIndex=i&&i.seriesIndex,"group"===e.type&&e.traverse(Md,e)),this._graphicEls[t]=e;},gd.getItemGraphicEl=function(t){return this._graphicEls[t];},gd.eachItemGraphicEl=function(i,n){z(this._graphicEls,function(t,e){t&&i&&i.call(n,t,e);});},gd.cloneShallow=function(t){if(!t){var e=P(this.dimensions,this.getDimensionInfo,this);t=new pd(e,this.hostModel);}if(t._storage=this._storage,fd(t,this),this._indices){var i=this._indices.constructor;t._indices=new i(this._indices);}else t._indices=null;return t.getRawIndex=t._indices?yd:vd,t._extent=A(this._extent),t._approximateExtent=A(this._approximateExtent),t;},gd.wrapMethod=function(t,e){var i=this[t];"function"==typeof i&&(this.__wrappedMethods=this.__wrappedMethods||[],this.__wrappedMethods.push(t),this[t]=function(){var t=i.apply(this,arguments);return e.apply(this,[t].concat(Z(arguments)));});},gd.TRANSFERABLE_METHODS=["cloneShallow","downSample","map"],gd.CHANGABLE_METHODS=["filterSelf","selectRange"];var Dd=function Dd(t,e){return Id((e=e||{}).coordDimensions||[],t,{dimsDef:e.dimensionsDefine||t.dimensionsDefine,encodeDef:e.encodeDefine||t.encodeDefine,dimCount:e.dimensionsCount,generateCoord:e.generateCoord,generateCoordCount:e.generateCoordCount});};function Ad(t,i,e){var n,a,o,r,s=(e=e||{}).byIndex,l=e.stackedCoordDimension,h=!(!t||!t.get("stack"));if(z(i,function(t,e){D(t)&&(i[e]=t={name:t}),h&&!t.isExtraCoord&&(s||n||!t.ordinalMeta||(n=t),a||"ordinal"===t.type||"time"===t.type||l&&l!==t.coordDim||(a=t));}),a&&(s||n)){o="__\0ecstackresult",r="__\0ecstackedover",n&&(n.createInvertedIndices=!0);var u=a.coordDim,c=a.type,d=0;z(i,function(t){t.coordDim===u&&d++;}),i.push({name:o,coordDim:u,coordDimIndex:d,type:c,isExtraCoord:!0,isCalculationCoord:!0}),d++,i.push({name:r,coordDim:r,coordDimIndex:d,type:c,isExtraCoord:!0,isCalculationCoord:!0});}return{stackedDimension:a&&a.name,stackedByDimension:n&&n.name,isStackedByIndex:s,stackedOverDimension:r,stackResultDimension:o};}function Cd(t,e,i){return e&&e===t.getCalculationInfo("stackedDimension")&&(null!=i?i===t.getCalculationInfo("stackedByDimension"):t.getCalculationInfo("isStackedByIndex"));}function Ld(t,e,i){i=i||{},Ul.isInstance(t)||(t=Ul.seriesDataToSource(t));var n,a=e.get("coordinateSystem"),o=ah.get(a),r=Ol(e);r&&(n=P(r.coordSysDims,function(t){var e={name:t},i=r.axisMap.get(t);if(i){var n=i.get("type");e.type=ad(n);}return e;})),n||(n=o&&(o.getDimensionsInfo?o.getDimensionsInfo():o.dimensions.slice())||["x","y"]);var s,l,h=Dd(t,{coordDimensions:n,generateCoord:i.generateCoord});r&&z(h,function(t,e){var i=t.coordDim,n=r.categoryAxisMap.get(i);n&&(null==s&&(s=e),t.ordinalMeta=n.getOrdinalMeta()),null!=t.otherDims.itemName&&(l=!0);}),l||null==s||(h[s].otherDims.itemName=0);var u=Ad(e,h),c=new pd(h,e);c.setCalculationInfo(u);var d=null!=s&&function(t){if(t.sourceFormat===zl){var e=function(t){var e=0;for(;e<t.length&&null==t[e];){e++;}return t[e];}(t.data||[]);return null!=e&&!E(ha(e));}}(t)?function(t,e,i,n){return n===s?i:this.defaultDimValueGetter(t,e,i,n);}:null;return c.hasItemOption=!1,c.initData(t,null,d),c;}function kd(t){this._setting=t||{},this._extent=[1/0,-1/0],this._interval=0,this.init&&this.init.apply(this,arguments);}function Pd(t){this.categories=t.categories||[],this._needCollect=t.needCollect,this._deduplication=t.deduplication,this._map;}kd.prototype.parse=function(t){return t;},kd.prototype.getSetting=function(t){return this._setting[t];},kd.prototype.contain=function(t){var e=this._extent;return t>=e[0]&&t<=e[1];},kd.prototype.normalize=function(t){var e=this._extent;return e[1]===e[0]?.5:(t-e[0])/(e[1]-e[0]);},kd.prototype.scale=function(t){var e=this._extent;return t*(e[1]-e[0])+e[0];},kd.prototype.unionExtent=function(t){var e=this._extent;t[0]<e[0]&&(e[0]=t[0]),t[1]>e[1]&&(e[1]=t[1]);},kd.prototype.unionExtentFromData=function(t,e){this.unionExtent(t.getApproximateExtent(e));},kd.prototype.getExtent=function(){return this._extent.slice();},kd.prototype.setExtent=function(t,e){var i=this._extent;isNaN(t)||(i[0]=t),isNaN(e)||(i[1]=e);},kd.prototype.getTicksLabels=function(){for(var t=[],e=this.getTicks(),i=0;i<e.length;i++){t.push(this.getLabel(e[i]));}return t;},kd.prototype.isBlank=function(){return this._isBlank;},kd.prototype.setBlank=function(t){this._isBlank=t;},Sa(kd),Aa(kd,{registerWhenExtend:!0}),Pd.createByAxisModel=function(t){var e=t.option,i=e.data,n=i&&P(i,Ed);return new Pd({categories:n,needCollect:!n,deduplication:!1!==e.dedplication});};var Nd=Pd.prototype;function Od(t){return t._map||(t._map=J(t.categories));}function Ed(t){return R(t)&&null!=t.value?t.value:t+"";}Nd.getOrdinal=function(t){return Od(this).get(t);},Nd.parseAndCollect=function(t){var e,i=this._needCollect;if("string"!=typeof t&&!i)return t;if(i&&!this._deduplication)return e=this.categories.length,this.categories[e]=t,e;var n=Od(this);return null==(e=n.get(t))&&(i?(e=this.categories.length,this.categories[e]=t,n.set(t,e)):e=NaN),e;};var Rd=kd.prototype,zd=kd.extend({type:"ordinal",init:function init(t,e){t&&!E(t)||(t=new Pd({categories:t})),this._ordinalMeta=t,this._extent=e||[0,t.categories.length-1];},parse:function parse(t){return"string"==typeof t?this._ordinalMeta.getOrdinal(t):Math.round(t);},contain:function contain(t){return t=this.parse(t),Rd.contain.call(this,t)&&null!=this._ordinalMeta.categories[t];},normalize:function normalize(t){return Rd.normalize.call(this,this.parse(t));},scale:function scale(t){return Math.round(Rd.scale.call(this,t));},getTicks:function getTicks(){for(var t=[],e=this._extent,i=e[0];i<=e[1];){t.push(i),i++;}return t;},getLabel:function getLabel(t){return this._ordinalMeta.categories[t];},count:function count(){return this._extent[1]-this._extent[0]+1;},unionExtentFromData:function unionExtentFromData(t,e){this.unionExtent(t.getApproximateExtent(e));},niceTicks:tt,niceExtent:tt});zd.create=function(){return new zd();};var Bd=Rs;function Vd(t){return Vs(t)+2;}function Gd(t,e,i){t[e]=Math.max(Math.min(t[e],i[1]),i[0]);}function Wd(t,e){!isFinite(t[0])&&(t[0]=e[0]),!isFinite(t[1])&&(t[1]=e[1]),Gd(t,0,e),Gd(t,1,e),t[0]>t[1]&&(t[0]=t[1]);}var Fd=Rs,Hd=kd.extend({type:"interval",_interval:0,_intervalPrecision:2,setExtent:function setExtent(t,e){var i=this._extent;isNaN(t)||(i[0]=parseFloat(t)),isNaN(e)||(i[1]=parseFloat(e));},unionExtent:function unionExtent(t){var e=this._extent;t[0]<e[0]&&(e[0]=t[0]),t[1]>e[1]&&(e[1]=t[1]),Hd.prototype.setExtent.call(this,e[0],e[1]);},getInterval:function getInterval(){return this._interval;},setInterval:function setInterval(t){this._interval=t,this._niceExtent=this._extent.slice(),this._intervalPrecision=Vd(t);},getTicks:function getTicks(){return function(t,e,i,n){var a=[];if(!t)return a;e[0]<i[0]&&a.push(e[0]);for(var o=i[0];o<=i[1]&&(a.push(o),(o=Bd(o+t,n))!==a[a.length-1]);){if(1e4<a.length)return[];}return e[1]>(a.length?a[a.length-1]:i[1])&&a.push(e[1]),a;}(this._interval,this._extent,this._niceExtent,this._intervalPrecision);},getTicksLabels:function getTicksLabels(){for(var t=[],e=this.getTicks(),i=0;i<e.length;i++){t.push(this.getLabel(e[i]));}return t;},getLabel:function getLabel(t,e){if(null==t)return"";var i=e&&e.precision;return null==i?i=Vs(t)||0:"auto"===i&&(i=this._intervalPrecision),Qs(t=Fd(t,i,!0));},niceTicks:function niceTicks(t,e,i){t=t||5;var n=this._extent,a=n[1]-n[0];if(isFinite(a)){a<0&&(a=-a,n.reverse());var o=function(t,e,i,n){var a={},o=t[1]-t[0],r=a.interval=qs(o/e,!0);null!=i&&r<i&&(r=a.interval=i),null!=n&&n<r&&(r=a.interval=n);var s=a.intervalPrecision=Vd(r);return Wd(a.niceTickExtent=[Bd(Math.ceil(t[0]/r)*r,s),Bd(Math.floor(t[1]/r)*r,s)],t),a;}(n,t,e,i);this._intervalPrecision=o.intervalPrecision,this._interval=o.interval,this._niceExtent=o.niceTickExtent;}},niceExtent:function niceExtent(t){var e=this._extent;if(e[0]===e[1])if(0!==e[0]){var i=e[0];t.fixMax||(e[1]+=i/2),e[0]-=i/2;}else e[1]=1;var n=e[1]-e[0];isFinite(n)||(e[0]=0,e[1]=1),this.niceTicks(t.splitNumber,t.minInterval,t.maxInterval);var a=this._interval;t.fixMin||(e[0]=Fd(Math.floor(e[0]/a)*a)),t.fixMax||(e[1]=Fd(Math.ceil(e[1]/a)*a));}});Hd.create=function(){return new Hd();};var Zd="__ec_stack_";function Ud(t){return t.get("stack")||Zd+t.seriesIndex;}function jd(t){return t.dim+t.index;}function Xd(t,e){return Yd(P(t,function(t){var e=t.getData(),i=t.coordinateSystem.getBaseAxis(),n=i.getExtent(),a="category"===i.type?i.getBandWidth():Math.abs(n[1]-n[0])/e.count();return{bandWidth:a,barWidth:Es(t.get("barWidth"),a),barMaxWidth:Es(t.get("barMaxWidth"),a),barGap:t.get("barGap"),barCategoryGap:t.get("barCategoryGap"),axisKey:jd(i),stackId:Ud(t)};}),e);}function Yd(t,e){var c={};z(t,function(t,e){var i=t.axisKey,n=t.bandWidth,a=c[i]||{bandWidth:n,remainedWidth:n,autoWidthCount:0,categoryGap:"20%",gap:"30%",stacks:{}},o=a.stacks;c[i]=a;var r=t.stackId;o[r]||a.autoWidthCount++,o[r]=o[r]||{width:0,maxWidth:0};var s=t.barWidth;s&&!o[r].width&&(o[r].width=s,s=Math.min(a.remainedWidth,s),a.remainedWidth-=s);var l=t.barMaxWidth;l&&(o[r].maxWidth=l);var h=t.barGap;null!=h&&(a.gap=h);var u=t.barCategoryGap;null!=u&&(a.categoryGap=u);});var d={};return z(c,function(t,i){d[i]={};var e=t.stacks,n=t.bandWidth,a=Es(t.categoryGap,n),o=Es(t.gap,1),r=t.remainedWidth,s=t.autoWidthCount,l=(r-a)/(s+(s-1)*o);l=Math.max(l,0),z(e,function(t,e){var i=t.maxWidth;i&&i<l&&(i=Math.min(i,r),t.width&&(i=Math.min(i,t.width)),r-=i,t.width=i,s--);}),l=(r-a)/(s+(s-1)*o),l=Math.max(l,0);var h,u=0;z(e,function(t,e){t.width||(t.width=l),u+=(h=t).width*(1+o);}),h&&(u-=h.width*o);var c=-u/2;z(e,function(t,e){d[i][e]=d[i][e]||{offset:c,width:t.width},c+=t.width*(1+o);});}),d;}function qd(t,e,i){var n=[];e.eachSeriesByType(t,function(t){t.coordinateSystem&&"cartesian2d"===t.coordinateSystem.type&&n.push(t);});var T=Xd(n),D={};z(n,function(t){var e=t.getData(),i=t.coordinateSystem,n=i.getBaseAxis(),a=Ud(t),o=T[jd(n)][a],r=o.offset,s=o.width,l=i.getOtherAxis(n),h=t.get("barMinHeight")||0;D[a]=D[a]||[],e.setLayout({offset:r,size:s});for(var u=e.mapDimension(l.dim),c=e.mapDimension(n.dim),d=Cd(e,u,c),f=l.isHorizontal(),p=0<=L(n.getAxesOnZeroOf(),l)||d?l.toGlobalCoord(l.dataToCoord(0)):l.getGlobalExtent()[0],g=0,m=e.count();g<m;g++){var v=e.get(u,g),y=e.get(c,g);if(!isNaN(v)){var x,_,w,b,S,M=0<=v?"p":"n",I=p;if(d&&(D[a][y]||(D[a][y]={p:p,n:p}),I=D[a][y][M]),f)x=I,_=(S=i.dataToPoint([v,y]))[1]+r,w=S[0]-p,b=s,Math.abs(w)<h&&(w=(w<0?-1:1)*h),d&&(D[a][y][M]+=w);else x=(S=i.dataToPoint([y,v]))[0]+r,_=I,w=s,b=S[1]-p,Math.abs(b)<h&&(b=(b<=0?-1:1)*h),d&&(D[a][y][M]+=b);e.setItemLayout(g,{x:x,y:_,width:w,height:b});}}},this);}var Kd=Hd.prototype,$d=Math.ceil,Jd=Math.floor,Qd=36e5,tf=864e5,ef=Hd.extend({type:"time",getLabel:function getLabel(t){var e=this._stepLvl,i=new Date(t);return cl(e[0],i,this.getSetting("useUTC"));},niceExtent:function niceExtent(t){var e=this._extent;if(e[0]===e[1]&&(e[0]-=tf,e[1]+=tf),e[1]===-1/0&&e[0]===1/0){var i=new Date();e[1]=+new Date(i.getFullYear(),i.getMonth(),i.getDate()),e[0]=e[1]-tf;}this.niceTicks(t.splitNumber,t.minInterval,t.maxInterval);var n=this._interval;t.fixMin||(e[0]=Rs(Jd(e[0]/n)*n)),t.fixMax||(e[1]=Rs($d(e[1]/n)*n));},niceTicks:function niceTicks(t,e,i){t=t||10;var n=this._extent,a=n[1]-n[0],o=a/t;null!=e&&o<e&&(o=e),null!=i&&i<o&&(o=i);var r=nf.length,s=function(t,e,i,n){for(;i<n;){var a=i+n>>>1;t[a][1]<e?i=a+1:n=a;}return i;}(nf,o,0,r),l=nf[Math.min(s,r-1)],h=l[1];"year"===l[0]&&(h*=qs(a/h/t,!0));var u=this.getSetting("useUTC")?0:60*new Date(+n[0]||+n[1]).getTimezoneOffset()*1e3,c=[Math.round($d((n[0]-u)/h)*h+u),Math.round(Jd((n[1]-u)/h)*h+u)];Wd(c,n),this._stepLvl=l,this._interval=h,this._niceExtent=c;},parse:function parse(t){return+js(t);}});z(["contain","normalize"],function(e){ef.prototype[e]=function(t){return Kd[e].call(this,this.parse(t));};});var nf=[["hh:mm:ss",1e3],["hh:mm:ss",5e3],["hh:mm:ss",1e4],["hh:mm:ss",15e3],["hh:mm:ss",3e4],["hh:mm\nMM-dd",6e4],["hh:mm\nMM-dd",3e5],["hh:mm\nMM-dd",6e5],["hh:mm\nMM-dd",9e5],["hh:mm\nMM-dd",18e5],["hh:mm\nMM-dd",Qd],["hh:mm\nMM-dd",72e5],["hh:mm\nMM-dd",6*Qd],["hh:mm\nMM-dd",432e5],["MM-dd\nyyyy",tf],["MM-dd\nyyyy",2*tf],["MM-dd\nyyyy",3*tf],["MM-dd\nyyyy",4*tf],["MM-dd\nyyyy",5*tf],["MM-dd\nyyyy",6*tf],["week",7*tf],["MM-dd\nyyyy",864e6],["week",14*tf],["week",21*tf],["month",31*tf],["week",42*tf],["month",62*tf],["week",42*tf],["quarter",8208e6],["month",31*tf*4],["month",13392e6],["half-year",16416e6],["month",31*tf*8],["month",26784e6],["year",380*tf]];ef.create=function(t){return new ef({useUTC:t.ecModel.get("useUTC")});};var af=kd.prototype,of=Hd.prototype,rf=Vs,sf=Rs,lf=Math.floor,hf=Math.ceil,uf=Math.pow,cf=Math.log,df=kd.extend({type:"log",base:10,$constructor:function $constructor(){kd.apply(this,arguments),this._originalScale=new Hd();},getTicks:function getTicks(){var i=this._originalScale,n=this._extent,a=i.getExtent();return P(of.getTicks.call(this),function(t){var e=Rs(uf(this.base,t));return e=t===n[0]&&i.__fixMin?ff(e,a[0]):e,e=t===n[1]&&i.__fixMax?ff(e,a[1]):e;},this);},getLabel:of.getLabel,scale:function scale(t){return t=af.scale.call(this,t),uf(this.base,t);},setExtent:function setExtent(t,e){var i=this.base;t=cf(t)/cf(i),e=cf(e)/cf(i),of.setExtent.call(this,t,e);},getExtent:function getExtent(){var t=this.base,e=af.getExtent.call(this);e[0]=uf(t,e[0]),e[1]=uf(t,e[1]);var i=this._originalScale,n=i.getExtent();return i.__fixMin&&(e[0]=ff(e[0],n[0])),i.__fixMax&&(e[1]=ff(e[1],n[1])),e;},unionExtent:function unionExtent(t){this._originalScale.unionExtent(t);var e=this.base;t[0]=cf(t[0])/cf(e),t[1]=cf(t[1])/cf(e),af.unionExtent.call(this,t);},unionExtentFromData:function unionExtentFromData(t,e){this.unionExtent(t.getApproximateExtent(e));},niceTicks:function niceTicks(t){t=t||10;var e=this._extent,i=e[1]-e[0];if(!(i===1/0||i<=0)){var n=Xs(i);for(t/i*n<=.5&&(n*=10);!isNaN(n)&&Math.abs(n)<1&&0<Math.abs(n);){n*=10;}var a=[Rs(hf(e[0]/n)*n),Rs(lf(e[1]/n)*n)];this._interval=n,this._niceExtent=a;}},niceExtent:function niceExtent(t){of.niceExtent.call(this,t);var e=this._originalScale;e.__fixMin=t.fixMin,e.__fixMax=t.fixMax;}});function ff(t,e){return sf(t,rf(e));}function pf(t,e){var i,n,a,o=t.type,r=e.getMin(),s=e.getMax(),l=null!=r,h=null!=s,u=t.getExtent();"ordinal"===o?i=e.getCategories().length:(E(n=e.get("boundaryGap"))||(n=[n||0,n||0]),"boolean"==typeof n[0]&&(n=[0,0]),n[0]=Es(n[0],1),n[1]=Es(n[1],1),a=u[1]-u[0]||Math.abs(u[0])),null==r&&(r="ordinal"===o?i?0:NaN:u[0]-n[0]*a),null==s&&(s="ordinal"===o?i?i-1:NaN:u[1]+n[1]*a),"dataMin"===r?r=u[0]:"function"==typeof r&&(r=r({min:u[0],max:u[1]})),"dataMax"===s?s=u[1]:"function"==typeof s&&(s=s({min:u[0],max:u[1]})),(null==r||!isFinite(r))&&(r=NaN),(null==s||!isFinite(s))&&(s=NaN),t.setBlank(G(r)||G(s)),e.getNeedCrossZero()&&(0<r&&0<s&&!l&&(r=0),r<0&&s<0&&!h&&(s=0));var c=e.ecModel;if(c&&"time"===o){var d,f=[];if(c.eachSeriesByType("bar",function(t){t.coordinateSystem&&"cartesian2d"===t.coordinateSystem.type&&(f.push(t),d|=t.getBaseAxis()===e.axis);}),d){var p=function(t,e,i,n){var a=i.axis.getExtent(),o=a[1]-a[0],r=Xd(n),s=i.axis.dim+i.axis.index,l=r[s];if(void 0===l)return{min:t,max:e};var h=1/0;z(l,function(t){h=Math.min(t.offset,h);});var u=-1/0;z(l,function(t){u=Math.max(t.offset+t.width,u);}),h=Math.abs(h),u=Math.abs(u);var c=h+u,d=e-t,f=d/(1-(h+u)/o)-d;return{min:t-=f*(h/c),max:e+=f*(u/c)};}(r,s,e,f);r=p.min,s=p.max;}}return[r,s];}function gf(t,e){var i=pf(t,e),n=null!=e.getMin(),a=null!=e.getMax(),o=e.get("splitNumber");"log"===t.type&&(t.base=e.get("logBase"));var r=t.type;t.setExtent(i[0],i[1]),t.niceExtent({splitNumber:o,fixMin:n,fixMax:a,minInterval:"interval"===r||"time"===r?e.get("minInterval"):null,maxInterval:"interval"===r||"time"===r?e.get("maxInterval"):null});var s=e.get("interval");null!=s&&t.setInterval&&t.setInterval(s);}function mf(t,e){if(e=e||t.get("type"))switch(e){case"category":return new zd(t.getOrdinalMeta?t.getOrdinalMeta():t.getCategories(),[1/0,-1/0]);case"value":return new Hd();default:return(kd.getClass(e)||Hd).create(t);}}function vf(t,e,i,n,a){var o,r=0,s=0,l=(n-a)/180*Math.PI,h=1;40<e.length&&(h=Math.floor(e.length/40));for(var u=0;u<t.length;u+=h){var c=t[u],d=Vi(e[u],i,"center","top");d.x+=c*Math.cos(l),d.y+=c*Math.sin(l),d.width*=1.3,d.height*=1.3,o?o.intersect(d)?(s++,r=Math.max(r,s)):(o.union(d),s=0):o=d.clone();}return 0===r&&1<h?h:(r+1)*h-1;}function yf(i,n){var e,t=i.scale,a=t.getTicksLabels(),o=t.getTicks();return"string"==typeof n?(e=n,P(a,n=function n(t){return e.replace("{value}",null!=t?t:"");})):"function"==typeof n?P(o,function(t,e){return n(xf(i,t),e);},this):a;}function xf(t,e){return"category"===t.type?t.scale.getLabel(e):e;}z(["contain","normalize"],function(e){df.prototype[e]=function(t){return t=cf(t)/cf(this.base),af[e].call(this,t);};}),df.create=function(){return new df();};var _f={getFormattedLabels:function getFormattedLabels(){return yf(this.axis,this.get("axisLabel.formatter"));},getMin:function getMin(t){var e=this.option,i=t||null==e.rangeStart?e.min:e.rangeStart;return this.axis&&null!=i&&"dataMin"!==i&&"function"!=typeof i&&!G(i)&&(i=this.axis.scale.parse(i)),i;},getMax:function getMax(t){var e=this.option,i=t||null==e.rangeEnd?e.max:e.rangeEnd;return this.axis&&null!=i&&"dataMax"!==i&&"function"!=typeof i&&!G(i)&&(i=this.axis.scale.parse(i)),i;},getNeedCrossZero:function getNeedCrossZero(){var t=this.option;return null==t.rangeStart&&null==t.rangeEnd&&!t.scale;},getCoordSysModel:tt,setRange:function setRange(t,e){this.option.rangeStart=t,this.option.rangeEnd=e;},resetRange:function resetRange(){this.option.rangeStart=this.option.rangeEnd=null;}},wf=zr({type:"triangle",shape:{cx:0,cy:0,width:0,height:0},buildPath:function buildPath(t,e){var i=e.cx,n=e.cy,a=e.width/2,o=e.height/2;t.moveTo(i,n-o),t.lineTo(i+a,n+o),t.lineTo(i-a,n+o),t.closePath();}}),bf=zr({type:"diamond",shape:{cx:0,cy:0,width:0,height:0},buildPath:function buildPath(t,e){var i=e.cx,n=e.cy,a=e.width/2,o=e.height/2;t.moveTo(i,n-o),t.lineTo(i+a,n),t.lineTo(i,n+o),t.lineTo(i-a,n),t.closePath();}}),Sf=zr({type:"pin",shape:{x:0,y:0,width:0,height:0},buildPath:function buildPath(t,e){var i=e.x,n=e.y,a=e.width/5*3,o=Math.max(a,e.height),r=a/2,s=r*r/(o-r),l=n-o+r+s,h=Math.asin(s/r),u=Math.cos(h)*r,c=Math.sin(h),d=Math.cos(h),f=.6*r,p=.7*r;t.moveTo(i-u,l+s),t.arc(i,l,r,Math.PI-h,2*Math.PI+h),t.bezierCurveTo(i+u-c*f,l+s+d*f,i,n-p,i,n),t.bezierCurveTo(i,n-p,i-u+c*f,l+s+d*f,i-u,l+s),t.closePath();}}),Mf=zr({type:"arrow",shape:{x:0,y:0,width:0,height:0},buildPath:function buildPath(t,e){var i=e.height,n=e.width,a=e.x,o=e.y,r=n/3*2;t.moveTo(a,o),t.lineTo(a+r,o+i),t.lineTo(a,o+i/4*3),t.lineTo(a-r,o+i),t.lineTo(a,o),t.closePath();}}),If={line:function line(t,e,i,n,a){a.x1=t,a.y1=e+n/2,a.x2=t+i,a.y2=e+n/2;},rect:function rect(t,e,i,n,a){a.x=t,a.y=e,a.width=i,a.height=n;},roundRect:function roundRect(t,e,i,n,a){a.x=t,a.y=e,a.width=i,a.height=n,a.r=Math.min(i,n)/4;},square:function square(t,e,i,n,a){var o=Math.min(i,n);a.x=t,a.y=e,a.width=o,a.height=o;},circle:function circle(t,e,i,n,a){a.cx=t+i/2,a.cy=e+n/2,a.r=Math.min(i,n)/2;},diamond:function diamond(t,e,i,n,a){a.cx=t+i/2,a.cy=e+n/2,a.width=i,a.height=n;},pin:function pin(t,e,i,n,a){a.x=t+i/2,a.y=e+n/2,a.width=i,a.height=n;},arrow:function arrow(t,e,i,n,a){a.x=t+i/2,a.y=e+n/2,a.width=i,a.height=n;},triangle:function triangle(t,e,i,n,a){a.cx=t+i/2,a.cy=e+n/2,a.width=i,a.height=n;}},Tf={};z({line:br,rect:wr,roundRect:wr,square:wr,circle:ur,diamond:bf,pin:Sf,arrow:Mf,triangle:wf},function(t,e){Tf[e]=new t();});var Df=zr({type:"symbol",shape:{symbolType:"",x:0,y:0,width:0,height:0},beforeBrush:function beforeBrush(){var t=this.style;"pin"===this.shape.symbolType&&"inside"===t.textPosition&&(t.textPosition=["50%","40%"],t.textAlign="center",t.textVerticalAlign="middle");},buildPath:function buildPath(t,e,i){var n=e.symbolType,a=Tf[n];"none"!==e.symbolType&&(a||(a=Tf[n="rect"]),If[n](e.x,e.y,e.width,e.height,a.shape),a.buildPath(t,a.shape,i));}});function Af(t,e){if("image"!==this.type){var i=this.style,n=this.shape;n&&"line"===n.symbolType?i.stroke=t:this.__isEmptyBrush?(i.stroke=t,i.fill=e||"#fff"):(i.fill&&(i.fill=t),i.stroke&&(i.stroke=t)),this.dirty(!1);}}function Cf(t,e,i,n,a,o,r){var s,l=0===t.indexOf("empty");return l&&(t=t.substr(5,1).toLowerCase()+t.substr(6)),(s=0===t.indexOf("image://")?Vr(t.slice(8),new ei(e,i,n,a),r?"center":"cover"):0===t.indexOf("path://")?Br(t.slice(7),{},new ei(e,i,n,a),r?"center":"cover"):new Df({shape:{symbolType:t,x:e,y:i,width:n,height:a}})).__isEmptyBrush=l,s.setColor=Af,s.setColor(o),s;}var Lf={isDimensionStacked:Cd,enableDataStack:Ad};var kf=(Object.freeze||Object)({createList:function createList(t){return Ld(t.getSource(),t);},getLayoutRect:wl,dataStack:Lf,createScale:function createScale(t,e){var i=e;As.isInstance(e)||w(i=new As(e),_f);var n=mf(i);return n.setExtent(t[0],t[1]),gf(n,i),n;},mixinAxisModelCommonMethods:function mixinAxisModelCommonMethods(t){w(t,_f);},completeDimensions:Id,createDimensions:Dd,createSymbol:Cf}),Pf=1e-8;function Nf(t,e){return Math.abs(t-e)<Pf;}function Of(t,e,i){var n=0,a=t[0];if(!a)return!1;for(var o=1;o<t.length;o++){var r=t[o];n+=Oo(a[0],a[1],r[0],r[1],e,i),a=r;}var s=t[0];return Nf(a[0],s[0])&&Nf(a[1],s[1])||(n+=Oo(a[0],a[1],s[0],s[1],e,i)),0!==n;}function Ef(t,e,i){if(this.name=t,this.geometries=e,i)i=[i[0],i[1]];else{var n=this.getBoundingRect();i=[n.x+n.width/2,n.y+n.height/2];}this.center=i;}function Rf(t,e,i){for(var n=[],a=e[0],o=e[1],r=0;r<t.length;r+=2){var s=t.charCodeAt(r)-64,l=t.charCodeAt(r+1)-64;s=s>>1^-(1&s),l=l>>1^-(1&l),a=s+=a,o=l+=o,n.push([s/i,l/i]);}return n;}Ef.prototype={constructor:Ef,properties:null,getBoundingRect:function getBoundingRect(){var t=this._rect;if(t)return t;for(var e=Number.MAX_VALUE,i=[e,e],n=[-e,-e],a=[],o=[],r=this.geometries,s=0;s<r.length;s++){if("polygon"===r[s].type)so(r[s].exterior,a,o),bt(i,i,a),St(n,n,o);}return 0===s&&(i[0]=i[1]=n[0]=n[1]=0),this._rect=new ei(i[0],i[1],n[0]-i[0],n[1]-i[1]);},contain:function contain(t){var e=this.getBoundingRect(),i=this.geometries;if(!e.contain(t[0],t[1]))return!1;t:for(var n=0,a=i.length;n<a;n++){if("polygon"===i[n].type){var o=i[n].exterior,r=i[n].interiors;if(Of(o,t[0],t[1])){for(var s=0;s<(r?r.length:0);s++){if(Of(r[s]))continue t;}return!0;}}}return!1;},transformTo:function transformTo(t,e,i,n){var a=this.getBoundingRect(),o=a.width/a.height;i?n||(n=i/o):i=o*n;for(var r=new ei(t,e,i,n),s=a.calculateTransform(r),l=this.geometries,h=0;h<l.length;h++){if("polygon"===l[h].type){for(var u=l[h].exterior,c=l[h].interiors,d=0;d<u.length;d++){wt(u[d],u[d],s);}for(var f=0;f<(c?c.length:0);f++){for(d=0;d<c[f].length;d++){wt(c[f][d],c[f][d],s);}}}}(a=this._rect).copy(r),this.center=[a.x+a.width/2,a.y+a.height/2];}};var zf=function zf(t){return function(t){if(!t.UTF8Encoding)return;var e=t.UTF8Scale;null==e&&(e=1024);for(var i=t.features,n=0;n<i.length;n++){for(var a=i[n].geometry,o=a.coordinates,r=a.encodeOffsets,s=0;s<o.length;s++){var l=o[s];if("Polygon"===a.type)o[s]=Rf(l,r[s],e);else if("MultiPolygon"===a.type)for(var h=0;h<l.length;h++){var u=l[h];l[h]=Rf(u,r[s][h],e);}}}t.UTF8Encoding=!1;}(t),P(T(t.features,function(t){return t.geometry&&t.properties&&0<t.geometry.coordinates.length;}),function(t){var e=t.properties,i=t.geometry,n=i.coordinates,a=[];"Polygon"===i.type&&a.push({type:"polygon",exterior:n[0],interiors:n.slice(1)}),"MultiPolygon"===i.type&&z(n,function(t){t[0]&&a.push({type:"polygon",exterior:t[0],interiors:t.slice(1)});});var o=new Ef(e.name,a,e.cp);return o.properties=e,o;});},Bf=Os;function Vf(t,e){var i=(t[1]-t[0])/e/2;t[0]+=i,t[1]-=i;}var Gf=[0,1],Wf=function Wf(t,e,i){this.dim=t,this.scale=e,this._extent=i||[0,0],this.inverse=!1,this.onBand=!1,this._labelInterval;};Wf.prototype={constructor:Wf,contain:function contain(t){var e=this._extent,i=Math.min(e[0],e[1]),n=Math.max(e[0],e[1]);return i<=t&&t<=n;},containData:function containData(t){return this.contain(this.dataToCoord(t));},getExtent:function getExtent(){return this._extent.slice();},getPixelPrecision:function getPixelPrecision(t){return Gs(t||this.scale.getExtent(),this._extent);},setExtent:function setExtent(t,e){var i=this._extent;i[0]=t,i[1]=e;},dataToCoord:function dataToCoord(t,e){var i=this._extent,n=this.scale;return t=n.normalize(t),this.onBand&&"ordinal"===n.type&&Vf(i=i.slice(),n.count()),Bf(t,Gf,i,e);},coordToData:function coordToData(t,e){var i=this._extent,n=this.scale;this.onBand&&"ordinal"===n.type&&Vf(i=i.slice(),n.count());var a=Bf(t,i,Gf,e);return this.scale.scale(a);},pointToData:function pointToData(t,e){},getTicksCoords:function getTicksCoords(t){if(this.onBand&&!t){for(var e=this.getBands(),i=[],n=0;n<e.length;n++){i.push(e[n][0]);}return e[n-1]&&i.push(e[n-1][1]),i;}return P(this.scale.getTicks(),this.dataToCoord,this);},getLabelsCoords:function getLabelsCoords(){return P(this.scale.getTicks(),this.dataToCoord,this);},getBands:function getBands(){for(var t=this.getExtent(),e=[],i=this.scale.count(),n=t[0],a=t[1]-n,o=0;o<i;o++){e.push([a*o/i+n,a*(o+1)/i+n]);}return e;},getBandWidth:function getBandWidth(){var t=this._extent,e=this.scale.getExtent(),i=e[1]-e[0]+(this.onBand?1:0);0===i&&(i=1);var n=Math.abs(t[1]-t[0]);return Math.abs(n)/i;},isHorizontal:null,getRotate:null,getLabelInterval:function getLabelInterval(){var t=this._labelInterval;if(!t){var e=this.model,i=e.getModel("axisLabel");t=i.get("interval"),"category"!==this.type||null!=t&&"auto"!==t||(t=vf(P(this.scale.getTicks(),this.dataToCoord,this),e.getFormattedLabels(),i.getFont(),this.getRotate?this.getRotate():this.isHorizontal&&!this.isHorizontal()?90:0,i.get("rotate"))),this._labelInterval=t;}return t;}};var Ff=zf,Hf={};function Zf(t,e){var i=t.mapDimension("defaultedLabel",!0),n=i.length;if(1===n)return Vh(t,e,i[0]);if(n){for(var a=[],o=0;o<i.length;o++){var r=Vh(t,e,i[o]);a.push(r);}return a.join(" ");}}function Uf(t){return[t[0]/2,t[1]/2];}function jf(t,e,i){ii.call(this),this.updateData(t,e,i);}z(["map","each","filter","indexOf","inherits","reduce","filter","bind","curry","isArray","isString","isObject","isFunction","extend","defaults","clone","merge"],function(t){Hf[t]=et[t];}),Xh.extend({type:"series.line",dependencies:["grid","polar"],getInitialData:function getInitialData(t,e){return Ld(this.getSource(),this);},defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,hoverAnimation:!0,clipOverflow:!0,label:{position:"top"},lineStyle:{width:2,type:"solid"},step:!1,smooth:!1,smoothMonotone:null,symbol:"emptyCircle",symbolSize:4,symbolRotate:null,showSymbol:!0,showAllSymbol:!1,connectNulls:!1,sampling:"none",animationEasing:"linear",progressive:0,hoverLayerThreshold:1/0}});var Xf=jf.prototype;function Yf(t,e){this.parent.drift(t,e);}Xf._createSymbol=function(t,e,i,n,a){this.removeAll();var o=Cf(t,-1,-1,2,2,e.getItemVisual(i,"color"),a);o.attr({z2:100,culling:!0,scale:Uf(n)}),o.drift=Yf,this._symbolType=t,this.add(o);},Xf.stopSymbolAnimation=function(t){this.childAt(0).stopAnimation(t);},Xf.getSymbolPath=function(){return this.childAt(0);},Xf.getScale=function(){return this.childAt(0).scale;},Xf.highlight=function(){this.childAt(0).trigger("emphasis");},Xf.downplay=function(){this.childAt(0).trigger("normal");},Xf.setZ=function(t,e){var i=this.childAt(0);i.zlevel=t,i.z=e;},Xf.setDraggable=function(t){var e=this.childAt(0);e.draggable=t,e.cursor=t?"move":"pointer";},Xf.updateData=function(t,e,i){this.silent=!1;var n,a,o=t.getItemVisual(e,"symbol")||"circle",r=t.hostModel,s=(n=e,(a=t.getItemVisual(n,"symbolSize"))instanceof Array?a.slice():[+a,+a]),l=o!==this._symbolType;if(l){var h=t.getItemVisual(e,"symbolKeepAspect");this._createSymbol(o,t,e,s,h);}else{(u=this.childAt(0)).silent=!1,fs(u,{scale:Uf(s)},r,e);}if(this._updateCommon(t,e,s,i),l){var u=this.childAt(0),c=i&&i.fadeIn,d={scale:u.scale.slice()};c&&(d.style={opacity:u.style.opacity}),u.scale=[0,0],c&&(u.style.opacity=0),ps(u,d,r,e);}this._seriesModel=r;};var qf=["itemStyle"],Kf=["emphasis","itemStyle"],$f=["label"],Jf=["emphasis","label"];function Qf(t){this.group=new ii(),this._symbolCtor=t||jf;}Xf._updateCommon=function(i,t,e,n){var a=this.childAt(0),o=i.hostModel,r=i.getItemVisual(t,"color");"image"!==a.type&&a.useStyle({strokeNoScale:!0});var s=n&&n.itemStyle,l=n&&n.hoverItemStyle,h=n&&n.symbolRotate,u=n&&n.symbolOffset,c=n&&n.labelModel,d=n&&n.hoverLabelModel,f=n&&n.hoverAnimation,p=n&&n.cursorStyle;if(!n||i.hasItemOption){var g=n&&n.itemModel?n.itemModel:i.getItemModel(t);s=g.getModel(qf).getItemStyle(["color"]),l=g.getModel(Kf).getItemStyle(),h=g.getShallow("symbolRotate"),u=g.getShallow("symbolOffset"),c=g.getModel($f),d=g.getModel(Jf),f=g.getShallow("hoverAnimation"),p=g.getShallow("cursor");}else l=k({},l);var m=a.style;a.attr("rotation",(h||0)*Math.PI/180||0),u&&a.attr("position",[Es(u[0],e[0]),Es(u[1],e[1])]),p&&a.attr("cursor",p),a.setColor(r,n&&n.symbolInnerColor),a.setStyle(s);var v=i.getItemVisual(t,"opacity");null!=v&&(m.opacity=v);var y=n&&n.useNameLabel;os(m,l,c,d,{labelFetcher:o,labelDataIndex:t,defaultText:function defaultText(t,e){return y?i.getName(t):Zf(i,t);},isRectText:!0,autoColor:r}),a.off("mouseover").off("mouseout").off("emphasis").off("normal"),a.hoverStyle=l,as(a);var x=Uf(e);if(f&&o.isAnimationEnabled()){var _=function _(){if(!this.incremental){var t=x[1]/x[0];this.animateTo({scale:[Math.max(1.1*x[0],x[0]+3),Math.max(1.1*x[1],x[1]+3*t)]},400,"elasticOut");}},w=function w(){this.incremental||this.animateTo({scale:x},400,"elasticOut");};a.on("mouseover",_).on("mouseout",w).on("emphasis",_).on("normal",w);}},Xf.fadeOut=function(t,e){var i=this.childAt(0);this.silent=i.silent=!0,(!e||!e.keepLabel)&&(i.style.text=null),fs(i,{style:{opacity:0},scale:[0,0]},this._seriesModel,this.dataIndex,t);},_(jf,ii);var tp=Qf.prototype;function ep(t,e,i,n){return e&&!isNaN(e[0])&&!isNaN(e[1])&&!(n.isIgnore&&n.isIgnore(i))&&!(n.clipShape&&!n.clipShape.contain(e[0],e[1]))&&"none"!==t.getItemVisual(i,"symbol");}function ip(t){return null==t||R(t)||(t={isIgnore:t}),t||{};}function np(t){var e=t.hostModel;return{itemStyle:e.getModel("itemStyle").getItemStyle(["color"]),hoverItemStyle:e.getModel("emphasis.itemStyle").getItemStyle(),symbolRotate:e.get("symbolRotate"),symbolOffset:e.get("symbolOffset"),hoverAnimation:e.get("hoverAnimation"),labelModel:e.getModel("label"),hoverLabelModel:e.getModel("emphasis.label"),cursorStyle:e.get("cursor")};}function ap(t,e,i){var n=t.getBaseAxis(),a=t.getOtherAxis(n),o=function(t,e){var i=0,n=t.scale.getExtent();"start"===e?i=n[0]:"end"===e?i=n[1]:0<n[0]?i=n[0]:n[1]<0&&(i=n[1]);return i;}(a,i),r=n.dim,s=a.dim,l=e.mapDimension(s),h=e.mapDimension(r),u="x"===s||"radius"===s?1:0,c=Cd(e,l,h);return{dataDimsForPoint:P(t.dimensions,function(t){return e.mapDimension(t);}),valueStart:o,valueAxisDim:s,baseAxisDim:r,stacked:c,valueDim:l,baseDim:h,baseDataOffset:u,stackedOverDimension:e.getCalculationInfo("stackedOverDimension")};}function op(t,e,i,n){var a=NaN;t.stacked&&(a=i.get(i.getCalculationInfo("stackedOverDimension"),n)),isNaN(a)&&(a=t.valueStart);var o=t.baseDataOffset,r=[];return r[o]=i.get(t.baseDim,n),r[1-o]=a,e.dataToPoint(r);}tp.updateData=function(a,o){o=ip(o);var r=this.group,s=a.hostModel,l=this._data,h=this._symbolCtor,u=np(a);l||r.removeAll(),a.diff(l).add(function(t){var e=a.getItemLayout(t);if(ep(a,e,t,o)){var i=new h(a,t,u);i.attr("position",e),a.setItemGraphicEl(t,i),r.add(i);}}).update(function(t,e){var i=l.getItemGraphicEl(e),n=a.getItemLayout(t);ep(a,n,t,o)?(i?(i.updateData(a,t,u),fs(i,{position:n},s)):(i=new h(a,t)).attr("position",n),r.add(i),a.setItemGraphicEl(t,i)):r.remove(i);}).remove(function(t){var e=l.getItemGraphicEl(t);e&&e.fadeOut(function(){r.remove(e);});}).execute(),this._data=a;},tp.isPersistent=function(){return!0;},tp.updateLayout=function(){var n=this._data;n&&n.eachItemGraphicEl(function(t,e){var i=n.getItemLayout(e);t.attr("position",i);});},tp.incrementalPrepareUpdate=function(t){this._seriesScope=np(t),this._data=null,this.group.removeAll();},tp.incrementalUpdate=function(t,e,i){function n(t){t.isGroup||(t.incremental=t.useHoverLayer=!0);}i=ip(i);for(var a=t.start;a<t.end;a++){var o=e.getItemLayout(a);if(ep(e,o,a,i)){var r=new this._symbolCtor(e,a,this._seriesScope);r.traverse(n),r.attr("position",o),this.group.add(r),e.setItemGraphicEl(a,r);}}},tp.remove=function(t){var e=this.group,i=this._data;i&&t?i.eachItemGraphicEl(function(t){t.fadeOut(function(){e.remove(t);});}):e.removeAll();};var rp=bt,sp=St,lp=lt,hp=at,up=[],cp=[],dp=[];function fp(t){return isNaN(t[0])||isNaN(t[1]);}function pp(t,e,i,n,a,o,r,s,l,h,u){return null==h?gp(e,"x")?mp(t,e,i,n,a,o,r,s,l,"x",u):gp(e,"y")?mp(t,e,i,n,a,o,r,s,l,"y",u):vp.apply(this,arguments):"none"!==h&&gp(e,h)?mp.apply(this,arguments):vp.apply(this,arguments);}function gp(t,e){if(t.length<=1)return!0;for(var i="x"===e?0:1,n=t[0][i],a=0,o=1;o<t.length;++o){var r=t[o][i]-n;if(!isNaN(r)&&!isNaN(a)&&0!==r&&0!==a&&0<=r!=0<=a)return!1;isNaN(r)||0===r||(a=r,n=t[o][i]);}return!0;}function mp(t,e,i,n,a,o,r,s,l,h,u){for(var c=0,d=i,f=0;f<n;f++){var p=e[d];if(a<=d||d<0)break;if(fp(p)){if(u){d+=o;continue;}break;}if(d===i)t[0<o?"moveTo":"lineTo"](p[0],p[1]);else if(0<l){var g=e[c],m="y"===h?1:0,v=(p[m]-g[m])*l;hp(cp,g),cp[m]=g[m]+v,hp(dp,p),dp[m]=p[m]-v,t.bezierCurveTo(cp[0],cp[1],dp[0],dp[1],p[0],p[1]);}else t.lineTo(p[0],p[1]);c=d,d+=o;}return f;}function vp(t,e,i,n,a,o,r,s,l,h,u){for(var c=0,d=i,f=0;f<n;f++){var p=e[d];if(a<=d||d<0)break;if(fp(p)){if(u){d+=o;continue;}break;}if(d===i)t[0<o?"moveTo":"lineTo"](p[0],p[1]),hp(cp,p);else if(0<l){var g=d+o,m=e[g];if(u)for(;m&&fp(e[g]);){m=e[g+=o];}var v=.5,y=e[c];if(!(m=e[g])||fp(m))hp(dp,p);else{var x,_;if(fp(m)&&!u&&(m=p),ht(up,m,y),"x"===h||"y"===h){var w="x"===h?0:1;x=Math.abs(p[w]-y[w]),_=Math.abs(p[w]-m[w]);}else x=vt(p,y),_=vt(p,m);lp(dp,p,up,-l*(1-(v=_/(_+x))));}rp(cp,cp,s),sp(cp,cp,r),rp(dp,dp,s),sp(dp,dp,r),t.bezierCurveTo(cp[0],cp[1],dp[0],dp[1],p[0],p[1]),lp(cp,p,up,l*v);}else t.lineTo(p[0],p[1]);c=d,d+=o;}return f;}function yp(t,e){var i=[1/0,1/0],n=[-1/0,-1/0];if(e)for(var a=0;a<t.length;a++){var o=t[a];o[0]<i[0]&&(i[0]=o[0]),o[1]<i[1]&&(i[1]=o[1]),o[0]>n[0]&&(n[0]=o[0]),o[1]>n[1]&&(n[1]=o[1]);}return{min:e?i:n,max:e?n:i};}var xp=Xo.extend({type:"ec-polyline",shape:{points:[],smooth:0,smoothConstraint:!0,smoothMonotone:null,connectNulls:!1},style:{fill:null,stroke:"#000"},brush:dr(Xo.prototype.brush),buildPath:function buildPath(t,e){var i=e.points,n=0,a=i.length,o=yp(i,e.smoothConstraint);if(e.connectNulls){for(;0<a&&fp(i[a-1]);a--){}for(;n<a&&fp(i[n]);n++){}}for(;n<a;){n+=pp(t,i,n,a,a,1,o.min,o.max,e.smooth,e.smoothMonotone,e.connectNulls)+1;}}}),_p=Xo.extend({type:"ec-polygon",shape:{points:[],stackedOnPoints:[],smooth:0,stackedOnSmooth:0,smoothConstraint:!0,smoothMonotone:null,connectNulls:!1},brush:dr(Xo.prototype.brush),buildPath:function buildPath(t,e){var i=e.points,n=e.stackedOnPoints,a=0,o=i.length,r=e.smoothMonotone,s=yp(i,e.smoothConstraint),l=yp(n,e.smoothConstraint);if(e.connectNulls){for(;0<o&&fp(i[o-1]);o--){}for(;a<o&&fp(i[a]);a++){}}for(;a<o;){var h=pp(t,i,a,o,o,1,s.min,s.max,e.smooth,r,e.connectNulls);pp(t,n,a+h-1,h,o,-1,l.min,l.max,e.stackedOnSmooth,r,e.connectNulls),a+=h+1,t.closePath();}}});function wp(t,e){if(t.length===e.length){for(var i=0;i<t.length;i++){var n=t[i],a=e[i];if(n[0]!==a[0]||n[1]!==a[1])return;}return!0;}}function bp(t){return"number"==typeof t?t:t?.5:0;}function Sp(t){var e=t.getGlobalExtent();if(t.onBand){var i=t.getBandWidth()/2-1,n=e[1]>e[0]?1:-1;e[0]+=n*i,e[1]-=n*i;}return e;}function Mp(t,e,i){return"polar"===t.type?(a=e,o=i,r=(n=t).getAngleAxis(),s=n.getRadiusAxis().getExtent(),l=r.getExtent(),h=Math.PI/180,u=new fr({shape:{cx:Rs(n.cx,1),cy:Rs(n.cy,1),r0:Rs(s[0],1),r:Rs(s[1],1),startAngle:-l[0]*h,endAngle:-l[1]*h,clockwise:r.inverse}}),a&&(u.shape.endAngle=-l[0]*h,ps(u,{shape:{endAngle:-l[1]*h}},o)),u):function(t,e,i){var n=Sp(t.getAxis("x")),a=Sp(t.getAxis("y")),o=t.getBaseAxis().isHorizontal(),r=Math.min(n[0],n[1]),s=Math.min(a[0],a[1]),l=Math.max(n[0],n[1])-r,h=Math.max(a[0],a[1])-s,u=i.get("lineStyle.width")||2,c=i.get("clipOverflow")?u/2:Math.max(l,h);o?(s-=c,h+=2*c):(r-=c,l+=2*c),r=Rs(r,1),s=Rs(s,1),l=Rs(l,1),h=Rs(h,1);var d=new wr({shape:{x:r,y:s,width:l,height:h}});return e&&(d.shape[o?"width":"height"]=0,ps(d,{shape:{width:l,height:h}},i)),d;}(t,e,i);var n,a,o,r,s,l,h,u;}function Ip(t,e,i){for(var n=e.getBaseAxis(),a="x"===n.dim||"radius"===n.dim?0:1,o=[],r=0;r<t.length-1;r++){var s=t[r+1],l=t[r];o.push(l);var h=[];switch(i){case"end":h[a]=s[a],h[1-a]=l[1-a],o.push(h);break;case"middle":var u=(l[a]+s[a])/2,c=[];h[a]=c[a]=u,h[1-a]=l[1-a],c[1-a]=s[1-a],o.push(h),o.push(c);break;default:h[a]=l[a],h[1-a]=s[1-a],o.push(h);}}return t[r]&&o.push(t[r]),o;}ru.extend({type:"line",init:function init(){var t=new ii(),e=new Qf();this.group.add(e.group),this._symbolDraw=e,this._lineGroup=t;},render:function render(t,e,i){var n=t.coordinateSystem,a=this.group,o=t.getData(),r=t.getModel("lineStyle"),s=t.getModel("areaStyle"),l=o.mapArray(o.getItemLayout),h="polar"===n.type,u=this._coordSys,c=this._symbolDraw,d=this._polyline,f=this._polygon,p=this._lineGroup,g=t.get("animation"),m=!s.isEmpty(),v=s.get("origin"),y=function(t,e,i){if(!i.valueDim)return[];for(var n=[],a=0,o=e.count();a<o;a++){n.push(op(i,t,e,a));}return n;}(n,o,ap(n,o,v)),x=t.get("showSymbol"),_=x&&!h&&!t.get("showAllSymbol")&&this._getSymbolIgnoreFunc(o,n),w=this._data;w&&w.eachItemGraphicEl(function(t,e){t.__temp&&(a.remove(t),w.setItemGraphicEl(e,null));}),x||c.remove(),a.add(p);var b=!h&&t.get("step");if(d&&u.type===n.type&&b===this._step){m&&!f?f=this._newPolygon(l,y,n,g):f&&!m&&(p.remove(f),f=this._polygon=null);var S=Mp(n,!1,t);p.setClipPath(S),x&&c.updateData(o,{isIgnore:_,clipShape:S}),o.eachItemGraphicEl(function(t){t.stopAnimation(!0);}),wp(this._stackedOnPoints,y)&&wp(this._points,l)||(g?this._updateAnimation(o,y,n,i,b,v):(b&&(l=Ip(l,n,b),y=Ip(y,n,b)),d.setShape({points:l}),f&&f.setShape({points:l,stackedOnPoints:y})));}else x&&c.updateData(o,{isIgnore:_,clipShape:Mp(n,!1,t)}),b&&(l=Ip(l,n,b),y=Ip(y,n,b)),d=this._newPolyline(l,n,g),m&&(f=this._newPolygon(l,y,n,g)),p.setClipPath(Mp(n,!0,t));var M=function(t,e){var i=t.getVisual("visualMeta");if(i&&i.length&&t.count()&&"cartesian2d"===e.type){for(var n,a,o=i.length-1;0<=o;o--){var r=i[o].dimension,s=t.dimensions[r],l=t.getDimensionInfo(s);if("x"===(n=l&&l.coordDim)||"y"===n){a=i[o];break;}}if(a){var h=e.getAxis(n),u=P(a.stops,function(t){return{coord:h.toGlobalCoord(h.dataToCoord(t.value)),color:t.color};}),c=u.length,d=a.outerColors.slice();c&&u[0].coord>u[c-1].coord&&(u.reverse(),d.reverse());var f=u[0].coord-10,p=u[c-1].coord+10,g=p-f;if(g<.001)return"transparent";z(u,function(t){t.offset=(t.coord-f)/g;}),u.push({offset:c?u[c-1].offset:.5,color:d[1]||"transparent"}),u.unshift({offset:c?u[0].offset:.5,color:d[0]||"transparent"});var m=new Cr(0,0,0,0,u,!0);return m[n]=f,m[n+"2"]=p,m;}}}(o,n)||o.getVisual("color");d.useStyle(C(r.getLineStyle(),{fill:"none",stroke:M,lineJoin:"bevel"}));var I=t.get("smooth");if(I=bp(t.get("smooth")),d.setShape({smooth:I,smoothMonotone:t.get("smoothMonotone"),connectNulls:t.get("connectNulls")}),f){var T=o.getCalculationInfo("stackedOnSeries"),D=0;f.useStyle(C(s.getAreaStyle(),{fill:M,opacity:.7,lineJoin:"bevel"})),T&&(D=bp(T.get("smooth"))),f.setShape({smooth:I,stackedOnSmooth:D,smoothMonotone:t.get("smoothMonotone"),connectNulls:t.get("connectNulls")});}this._data=o,this._coordSys=n,this._stackedOnPoints=y,this._points=l,this._step=b,this._valueOrigin=v;},dispose:function dispose(){},highlight:function highlight(t,e,i,n){var a=t.getData(),o=pa(a,n);if(!(o instanceof Array)&&null!=o&&0<=o){var r=a.getItemGraphicEl(o);if(!r){var s=a.getItemLayout(o);if(!s)return;(r=new jf(a,o)).position=s,r.setZ(t.get("zlevel"),t.get("z")),r.ignore=isNaN(s[0])||isNaN(s[1]),r.__temp=!0,a.setItemGraphicEl(o,r),r.stopSymbolAnimation(!0),this.group.add(r);}r.highlight();}else ru.prototype.highlight.call(this,t,e,i,n);},downplay:function downplay(t,e,i,n){var a=t.getData(),o=pa(a,n);if(null!=o&&0<=o){var r=a.getItemGraphicEl(o);r&&(r.__temp?(a.setItemGraphicEl(o,null),this.group.remove(r)):r.downplay());}else ru.prototype.downplay.call(this,t,e,i,n);},_newPolyline:function _newPolyline(t){var e=this._polyline;return e&&this._lineGroup.remove(e),e=new xp({shape:{points:t},silent:!0,z2:10}),this._lineGroup.add(e),this._polyline=e;},_newPolygon:function _newPolygon(t,e){var i=this._polygon;return i&&this._lineGroup.remove(i),i=new _p({shape:{points:t,stackedOnPoints:e},silent:!0}),this._lineGroup.add(i),this._polygon=i;},_getSymbolIgnoreFunc:function _getSymbolIgnoreFunc(t,e){var i=e.getAxesByScale("ordinal")[0];if(i&&i.isLabelIgnored)return S(i.isLabelIgnored,i);},_updateAnimation:function _updateAnimation(t,e,i,n,a,o){var r=this._polyline,s=this._polygon,l=t.hostModel,h=function(t,e,i,n,a,o,r,s){for(var l,h,u=(l=t,h=[],e.diff(l).add(function(t){h.push({cmd:"+",idx:t});}).update(function(t,e){h.push({cmd:"=",idx:e,idx1:t});}).remove(function(t){h.push({cmd:"-",idx:t});}).execute(),h),c=[],d=[],f=[],p=[],g=[],m=[],v=[],y=ap(a,e,r),x=ap(o,t,s),_=0;_<u.length;_++){var w=u[_],b=!0;switch(w.cmd){case"=":var S=t.getItemLayout(w.idx),M=e.getItemLayout(w.idx1);(isNaN(S[0])||isNaN(S[1]))&&(S=M.slice()),c.push(S),d.push(M),f.push(i[w.idx]),p.push(n[w.idx1]),v.push(e.getRawIndex(w.idx1));break;case"+":var I=w.idx;c.push(a.dataToPoint([e.get(y.dataDimsForPoint[0],I),e.get(y.dataDimsForPoint[1],I)])),d.push(e.getItemLayout(I).slice()),f.push(op(y,a,e,I)),p.push(n[I]),v.push(e.getRawIndex(I));break;case"-":I=w.idx;var T=t.getRawIndex(I);T!==I?(c.push(t.getItemLayout(I)),d.push(o.dataToPoint([t.get(x.dataDimsForPoint[0],I),t.get(x.dataDimsForPoint[1],I)])),f.push(i[I]),p.push(op(x,o,t,I)),v.push(T)):b=!1;}b&&(g.push(w),m.push(m.length));}m.sort(function(t,e){return v[t]-v[e];});var D=[],A=[],C=[],L=[],k=[];for(_=0;_<m.length;_++){I=m[_],D[_]=c[I],A[_]=d[I],C[_]=f[I],L[_]=p[I],k[_]=g[I];}return{current:D,next:A,stackedOnCurrent:C,stackedOnNext:L,status:k};}(this._data,t,this._stackedOnPoints,e,this._coordSys,i,this._valueOrigin,o),u=h.current,c=h.stackedOnCurrent,d=h.next,f=h.stackedOnNext;a&&(u=Ip(h.current,i,a),c=Ip(h.stackedOnCurrent,i,a),d=Ip(h.next,i,a),f=Ip(h.stackedOnNext,i,a)),r.shape.__points=h.current,r.shape.points=u,fs(r,{shape:{points:d}},l),s&&(s.setShape({points:u,stackedOnPoints:c}),fs(s,{shape:{points:d,stackedOnPoints:f}},l));for(var p=[],g=h.status,m=0;m<g.length;m++){if("="===g[m].cmd){var v=t.getItemGraphicEl(g[m].idx1);v&&p.push({el:v,ptIdx:m});}}r.animators&&r.animators.length&&r.animators[0].during(function(){for(var t=0;t<p.length;t++){p[t].el.attr("position",r.shape.__points[p[t].ptIdx]);}});},remove:function remove(t){var i=this.group,n=this._data;this._lineGroup.removeAll(),this._symbolDraw.remove(!0),n&&n.eachItemGraphicEl(function(t,e){t.__temp&&(i.remove(t),n.setItemGraphicEl(e,null));}),this._polyline=this._polygon=this._coordSys=this._points=this._stackedOnPoints=this._data=null;}});var Tp=function Tp(t,r,s){return{seriesType:t,performRawSeries:!0,reset:function reset(l,t,e){var i=l.getData(),n=l.get("symbol")||r,h=l.get("symbolSize"),a=l.get("symbolKeepAspect");if(i.setVisual({legendSymbol:s||n,symbol:n,symbolSize:h,symbolKeepAspect:a}),!t.isSeriesFiltered(l)){var o="function"==typeof h;return{dataEach:i.hasItemOption||o?function(t,e){if("function"==typeof h){var i=l.getRawValue(e),n=l.getDataParams(e);t.setItemVisual(e,"symbolSize",h(i,n));}if(t.hasItemOption){var a=t.getItemModel(e),o=a.getShallow("symbol",!0),r=a.getShallow("symbolSize",!0),s=a.getShallow("symbolKeepAspect",!0);null!=o&&t.setItemVisual(e,"symbol",o),null!=r&&t.setItemVisual(e,"symbolSize",r),null!=s&&t.setItemVisual(e,"symbolKeepAspect",s);}}:null};}}};},Dp=function Dp(t){return{seriesType:t,plan:nu(),reset:function reset(t){var e=t.getData(),c=t.coordinateSystem,d=t.pipelineContext.large;if(c){var f=P(c.dimensions,function(t){return e.mapDimension(t);}).slice(0,2),p=f.length;return Cd(e,f[0],f[1])&&(f[0]=e.getCalculationInfo("stackResultDimension")),Cd(e,f[1],f[0])&&(f[1]=e.getCalculationInfo("stackResultDimension")),p&&{progress:function progress(t,e){for(var i=t.end-t.start,n=d&&new Float32Array(i*p),a=t.start,o=0,r=[],s=[];a<t.end;a++){var l;if(1===p){var h=e.get(f[0],a);l=!isNaN(h)&&c.dataToPoint(h,null,s);}else{h=r[0]=e.get(f[0],a);var u=r[1]=e.get(f[1],a);l=!isNaN(h)&&!isNaN(u)&&c.dataToPoint(r,null,s);}d?(n[o++]=l?l[0]:NaN,n[o++]=l?l[1]:NaN):e.setItemLayout(a,l&&l.slice()||[NaN,NaN]);}d&&e.setLayout("symbolPoints",n);}};}}};},Ap={average:function average(t){for(var e=0,i=0,n=0;n<t.length;n++){isNaN(t[n])||(e+=t[n],i++);}return 0===i?NaN:e/i;},sum:function sum(t){for(var e=0,i=0;i<t.length;i++){e+=t[i]||0;}return e;},max:function max(t){for(var e=-1/0,i=0;i<t.length;i++){t[i]>e&&(e=t[i]);}return isFinite(e)?e:NaN;},min:function min(t){for(var e=1/0,i=0;i<t.length;i++){t[i]<e&&(e=t[i]);}return isFinite(e)?e:NaN;},nearest:function nearest(t){return t[0];}},Cp=function Cp(t,e){return Math.round(t.length/2);};function Lp(t){return this._axes[t];}var kp=function kp(t){this._axes={},this._dimList=[],this.name=t||"";};function Pp(t){kp.call(this,t);}kp.prototype={constructor:kp,type:"cartesian",getAxis:function getAxis(t){return this._axes[t];},getAxes:function getAxes(){return P(this._dimList,Lp,this);},getAxesByScale:function getAxesByScale(e){return e=e.toLowerCase(),T(this.getAxes(),function(t){return t.scale.type===e;});},addAxis:function addAxis(t){var e=t.dim;this._axes[e]=t,this._dimList.push(e);},dataToCoord:function dataToCoord(t){return this._dataCoordConvert(t,"dataToCoord");},coordToData:function coordToData(t){return this._dataCoordConvert(t,"coordToData");},_dataCoordConvert:function _dataCoordConvert(t,e){for(var i=this._dimList,n=t instanceof Array?[]:{},a=0;a<i.length;a++){var o=i[a],r=this._axes[o];n[o]=r[e](t[o]);}return n;}},Pp.prototype={constructor:Pp,type:"cartesian2d",dimensions:["x","y"],getBaseAxis:function getBaseAxis(){return this.getAxesByScale("ordinal")[0]||this.getAxesByScale("time")[0]||this.getAxis("x");},containPoint:function containPoint(t){var e=this.getAxis("x"),i=this.getAxis("y");return e.contain(e.toLocalCoord(t[0]))&&i.contain(i.toLocalCoord(t[1]));},containData:function containData(t){return this.getAxis("x").containData(t[0])&&this.getAxis("y").containData(t[1]);},dataToPoint:function dataToPoint(t,e,i){var n=this.getAxis("x"),a=this.getAxis("y");return(i=i||[])[0]=n.toGlobalCoord(n.dataToCoord(t[0])),i[1]=a.toGlobalCoord(a.dataToCoord(t[1])),i;},clampData:function clampData(t,e){var i=this.getAxis("x").scale,n=this.getAxis("y").scale,a=i.getExtent(),o=n.getExtent(),r=i.parse(t[0]),s=n.parse(t[1]);return(e=e||[])[0]=Math.min(Math.max(Math.min(a[0],a[1]),r),Math.max(a[0],a[1])),e[1]=Math.min(Math.max(Math.min(o[0],o[1]),s),Math.max(o[0],o[1])),e;},pointToData:function pointToData(t,e){var i=this.getAxis("x"),n=this.getAxis("y");return(e=e||[])[0]=i.coordToData(i.toLocalCoord(t[0])),e[1]=n.coordToData(n.toLocalCoord(t[1])),e;},getOtherAxis:function getOtherAxis(t){return this.getAxis("x"===t.dim?"y":"x");}},_(Pp,kp);var Np=function Np(t,e,i,n,a){Wf.call(this,t,e,i),this.type=n||"value",this.position=a||"bottom";};Np.prototype={constructor:Np,index:0,getAxesOnZeroOf:null,model:null,isHorizontal:function isHorizontal(){var t=this.position;return"top"===t||"bottom"===t;},getGlobalExtent:function getGlobalExtent(t){var e=this.getExtent();return e[0]=this.toGlobalCoord(e[0]),e[1]=this.toGlobalCoord(e[1]),t&&e[0]>e[1]&&e.reverse(),e;},getOtherAxis:function getOtherAxis(){this.grid.getOtherAxis();},isLabelIgnored:function isLabelIgnored(t){if("category"===this.type){var e=this.getLabelInterval();return"function"==typeof e&&!e(t,this.scale.getLabel(t))||t%(e+1);}},pointToData:function pointToData(t,e){return this.coordToData(this.toLocalCoord(t["x"===this.dim?0:1]),e);},toLocalCoord:null,toGlobalCoord:null},_(Np,Wf);var Op={show:!0,zlevel:0,z:0,inverse:!1,name:"",nameLocation:"end",nameRotate:null,nameTruncate:{maxWidth:null,ellipsis:"...",placeholder:"."},nameTextStyle:{},nameGap:15,silent:!1,triggerEvent:!1,tooltip:{show:!1},axisPointer:{},axisLine:{show:!0,onZero:!0,onZeroAxisIndex:null,lineStyle:{color:"#333",width:1,type:"solid"},symbol:["none","none"],symbolSize:[10,15]},axisTick:{show:!0,inside:!1,length:5,lineStyle:{width:1}},axisLabel:{show:!0,inside:!1,rotate:0,showMinLabel:null,showMaxLabel:null,margin:8,fontSize:12},splitLine:{show:!0,lineStyle:{color:["#ccc"],width:1,type:"solid"}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}},Ep={};Ep.categoryAxis=g({boundaryGap:!0,deduplication:null,splitLine:{show:!1},axisTick:{alignWithLabel:!1,interval:"auto"},axisLabel:{interval:"auto"}},Op),Ep.valueAxis=g({boundaryGap:[0,0],splitNumber:5},Op),Ep.timeAxis=C({scale:!0,min:"dataMin",max:"dataMax"},Ep.valueAxis),Ep.logAxis=C({scale:!0,logBase:10},Ep.valueAxis);var Rp=["value","category","time","log"],zp=function zp(o,t,r,e){z(Rp,function(a){t.extend({type:o+"Axis."+a,mergeDefaultAndTheme:function mergeDefaultAndTheme(t,e){var i=this.layoutMode,n=i?Ml(t):{};g(t,e.getTheme().get(a+"Axis")),g(t,this.getDefaultOption()),t.type=r(o,t),i&&Sl(t,n,i);},optionUpdated:function optionUpdated(){"category"===this.option.type&&(this.__ordinalMeta=Pd.createByAxisModel(this));},getCategories:function getCategories(t){var e=this.option;if("category"===e.type)return t?e.data:this.__ordinalMeta.categories;},getOrdinalMeta:function getOrdinalMeta(){return this.__ordinalMeta;},defaultOption:p([{},Ep[a+"Axis"],e],!0)});}),Cl.registerSubTypeDefaulter(o+"Axis",N(r,o));},Bp=Cl.extend({type:"cartesian2dAxis",axis:null,init:function init(){Bp.superApply(this,"init",arguments),this.resetRange();},mergeOption:function mergeOption(){Bp.superApply(this,"mergeOption",arguments),this.resetRange();},restoreData:function restoreData(){Bp.superApply(this,"restoreData",arguments),this.resetRange();},getCoordSysModel:function getCoordSysModel(){return this.ecModel.queryComponents({mainType:"grid",index:this.option.gridIndex,id:this.option.gridId})[0];}});function Vp(t,e){return e.type||(e.data?"category":"value");}g(Bp.prototype,_f);var Gp={offset:0};zp("x",Bp,Vp,Gp),zp("y",Bp,Vp,Gp),Cl.extend({type:"grid",dependencies:["xAxis","yAxis"],layoutMode:"box",coordinateSystem:null,defaultOption:{show:!1,zlevel:0,z:0,left:"10%",top:60,right:"10%",bottom:60,containLabel:!1,backgroundColor:"rgba(0,0,0,0)",borderWidth:1,borderColor:"#ccc"}});var Wp=z,Fp=function Fp(t){var e=t.scale.getExtent(),i=e[0],n=e[1];return!(0<i&&0<n||i<0&&n<0);},Hp=gf;function Zp(t,e,i){return t.getCoordSysModel()===e;}function Up(t,e,i){this._coordsMap={},this._coordsList=[],this._axesMap={},this._axesList=[],this._initCartesian(t,e,i),this.model=t;}var jp=Up.prototype;function Xp(t,e,i){i.getAxesOnZeroOf=function(){return n?[n]:[];};var n,a=t[e],o=i.model,r=o.get("axisLine.onZero"),s=o.get("axisLine.onZeroAxisIndex");if(r)if(null==s){for(var l in a){if(a.hasOwnProperty(l)&&Yp(a[l])){n=a[l];break;}}}else Yp(a[s])&&(n=a[s]);}function Yp(t){return t&&"category"!==t.type&&"time"!==t.type&&Fp(t);}jp.type="grid",jp.axisPointerEnabled=!0,jp.getRect=function(){return this._rect;},jp.update=function(t,e){var i=this._axesMap;this._updateScale(t,this.model),Wp(i.x,function(t){Hp(t.scale,t.model);}),Wp(i.y,function(t){Hp(t.scale,t.model);}),Wp(i.x,function(t){Xp(i,"y",t);}),Wp(i.y,function(t){Xp(i,"x",t);}),this.resize(this.model,e);},jp.resize=function(t,e,i){var l=wl(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()});this._rect=l;var n=this._axesList;function a(){Wp(n,function(t){var e,i,n,a,o=t.isHorizontal(),r=o?[0,l.width]:[0,l.height],s=t.inverse?1:0;t.setExtent(r[s],r[1-s]),e=t,i=o?l.x:l.y,n=e.getExtent(),a=n[0]+n[1],e.toGlobalCoord="x"===e.dim?function(t){return t+i;}:function(t){return a-t+i;},e.toLocalCoord="x"===e.dim?function(t){return t-i;}:function(t){return a-t+i;};});}a(),!i&&t.get("containLabel")&&(Wp(n,function(t){if(!t.model.get("axisLabel.inside")){var e=function(t){var e,i,n,a,o,r,s,l,h,u=t.model,c=u.get("axisLabel.show")?u.getFormattedLabels():[],d=u.getModel("axisLabel"),f=1,p=c.length;40<p&&(f=Math.ceil(p/40));for(var g=0;g<p;g+=f){if(!t.isLabelIgnored(g)){var m=d.getTextRect(c[g]),v=(i=m,n=d.get("rotate")||0,a=n*Math.PI/180,o=i.plain(),r=o.width,s=o.height,l=r*Math.cos(a)+s*Math.sin(a),h=r*Math.sin(a)+s*Math.cos(a),new ei(o.x,o.y,l,h));e?e.union(v):e=v;}}return e;}(t);if(e){var i=t.isHorizontal()?"height":"width",n=t.model.get("axisLabel.margin");l[i]-=e[i]+n,"top"===t.position?l.y+=e.height+n:"left"===t.position&&(l.x+=e.width+n);}}}),a());},jp.getAxis=function(t,e){var i=this._axesMap[t];if(null!=i){if(null==e)for(var n in i){if(i.hasOwnProperty(n))return i[n];}return i[e];}},jp.getAxes=function(){return this._axesList.slice();},jp.getCartesian=function(t,e){if(null!=t&&null!=e){var i="x"+t+"y"+e;return this._coordsMap[i];}R(t)&&(e=t.yAxisIndex,t=t.xAxisIndex);for(var n=0,a=this._coordsList;n<a.length;n++){if(a[n].getAxis("x").index===t||a[n].getAxis("y").index===e)return a[n];}},jp.getCartesians=function(){return this._coordsList.slice();},jp.convertToPixel=function(t,e,i){var n=this._findConvertTarget(t,e);return n.cartesian?n.cartesian.dataToPoint(i):n.axis?n.axis.toGlobalCoord(n.axis.dataToCoord(i)):null;},jp.convertFromPixel=function(t,e,i){var n=this._findConvertTarget(t,e);return n.cartesian?n.cartesian.pointToData(i):n.axis?n.axis.coordToData(n.axis.toLocalCoord(i)):null;},jp._findConvertTarget=function(t,e){var i,n,a=e.seriesModel,o=e.xAxisModel||a&&a.getReferringComponents("xAxis")[0],r=e.yAxisModel||a&&a.getReferringComponents("yAxis")[0],s=e.gridModel,l=this._coordsList;if(a)L(l,i=a.coordinateSystem)<0&&(i=null);else if(o&&r)i=this.getCartesian(o.componentIndex,r.componentIndex);else if(o)n=this.getAxis("x",o.componentIndex);else if(r)n=this.getAxis("y",r.componentIndex);else if(s){s.coordinateSystem===this&&(i=this._coordsList[0]);}return{cartesian:i,axis:n};},jp.containPoint=function(t){var e=this._coordsList[0];if(e)return e.containPoint(t);},jp._initCartesian=function(r,t,e){var s={left:!1,right:!1,top:!1,bottom:!1},l={x:{},y:{}},h={x:0,y:0};if(t.eachComponent("xAxis",i("x"),this),t.eachComponent("yAxis",i("y"),this),!h.x||!h.y)return this._axesMap={},void(this._axesList=[]);function i(o){return function(t,e){if(Zp(t,r)){var i=t.get("position");"x"===o?"top"!==i&&"bottom"!==i&&s[i="bottom"]&&(i="top"===i?"bottom":"top"):"left"!==i&&"right"!==i&&s[i="left"]&&(i="left"===i?"right":"left"),s[i]=!0;var n=new Np(o,mf(t),[0,0],t.get("type"),i),a="category"===n.type;n.onBand=a&&t.get("boundaryGap"),n.inverse=t.get("inverse"),(t.axis=n).model=t,n.grid=this,n.index=e,this._axesList.push(n),l[o][e]=n,h[o]++;}};}this._axesMap=l,Wp(l.x,function(a,o){Wp(l.y,function(t,e){var i="x"+o+"y"+e,n=new Pp(i);n.grid=this,n.model=r,this._coordsMap[i]=n,this._coordsList.push(n),n.addAxis(a),n.addAxis(t);},this);},this);},jp._updateScale=function(l,h){function u(e,i,t){Wp(e.mapDimension(i.dim,!0),function(t){i.scale.unionExtentFromData(e,t);});}z(this._axesList,function(t){t.scale.setExtent(1/0,-1/0);}),l.eachSeries(function(t){if($p(t)){var e=Kp(t,l),i=e[0],n=e[1];if(!Zp(i,h)||!Zp(n,h))return;var a=this.getCartesian(i.componentIndex,n.componentIndex),o=t.getData(),r=a.getAxis("x"),s=a.getAxis("y");"list"===o.type&&(u(o,r,t),u(o,s,t));}},this);},jp.getTooltipAxes=function(n){var a=[],o=[];return Wp(this.getCartesians(),function(t){var e=null!=n&&"auto"!==n?t.getAxis(n):t.getBaseAxis(),i=t.getOtherAxis(e);L(a,e)<0&&a.push(e),L(o,i)<0&&o.push(i);}),{baseAxes:a,otherAxes:o};};var qp=["xAxis","yAxis"];function Kp(e,t){return P(qp,function(t){return e.getReferringComponents(t)[0];});}function $p(t){return"cartesian2d"===t.get("coordinateSystem");}Up.create=function(n,a){var o=[];return n.eachComponent("grid",function(t,e){var i=new Up(t,n,a);i.name="grid_"+e,i.resize(t,a,!0),t.coordinateSystem=i,o.push(i);}),n.eachSeries(function(t){if($p(t)){var e=Kp(t),i=e[0],n=e[1],a=i.getCoordSysModel().coordinateSystem;t.coordinateSystem=a.getCartesian(i.componentIndex,n.componentIndex);}}),o;},Up.dimensions=Up.prototype.dimensions=Pp.prototype.dimensions,ah.register("cartesian2d",Up);var Jp=Math.PI;function Qp(t){var e={componentType:t.mainType};return e[t.mainType+"Index"]=t.componentIndex,e;}var tg=function tg(t,e){this.opt=e,this.axisModel=t,C(e,{labelOffset:0,nameDirection:1,tickDirection:1,labelDirection:1,silent:!0}),this.group=new ii();var i=new ii({position:e.position.slice(),rotation:e.rotation});i.updateTransform(),this._transform=i.transform,this._dumbGroup=i;};tg.prototype={constructor:tg,hasBuilder:function hasBuilder(t){return!!eg[t];},add:function add(t){eg[t].call(this);},getGroup:function getGroup(){return this.group;}};var eg={axisLine:function axisLine(){var o=this.opt,t=this.axisModel;if(t.get("axisLine.show")){var e=this.axisModel.axis.getExtent(),i=this._transform,r=[e[0],0],n=[e[1],0];i&&(wt(r,r,i),wt(n,n,i));var s=k({lineCap:"round"},t.getModel("axisLine.lineStyle").getLineStyle());this.group.add(new br(Hr({anid:"line",shape:{x1:r[0],y1:r[1],x2:n[0],y2:n[1]},style:s,strokeContainThreshold:o.strokeContainThreshold||5,silent:!0,z2:1})));var l=t.get("axisLine.symbol"),a=t.get("axisLine.symbolSize"),h=t.get("axisLine.symbolOffset")||0;if("number"==typeof h&&(h=[h,h]),null!=l){"string"==typeof l&&(l=[l,l]),"string"!=typeof a&&"number"!=typeof a||(a=[a,a]);var u=a[0],c=a[1];z([{rotate:o.rotation+Math.PI/2,offset:h[0],r:0},{rotate:o.rotation-Math.PI/2,offset:h[1],r:Math.sqrt((r[0]-n[0])*(r[0]-n[0])+(r[1]-n[1])*(r[1]-n[1]))}],function(t,e){if("none"!==l[e]&&null!=l[e]){var i=Cf(l[e],-u/2,-c/2,u,c,s.stroke,!0),n=t.r+t.offset,a=[r[0]+n*Math.cos(o.rotation),r[1]-n*Math.sin(o.rotation)];i.attr({rotation:t.rotate,position:a,silent:!0}),this.group.add(i);}},this);}}},axisTickLabel:function axisTickLabel(){var t=this.axisModel,e=this.opt,i=function(t,e,i){var n=e.axis;if(!e.get("axisTick.show")||n.scale.isBlank())return;for(var a=e.getModel("axisTick"),o=a.getModel("lineStyle"),r=a.get("length"),s=lg(a,i.labelInterval),l=n.getTicksCoords(a.get("alignWithLabel")),h=n.scale.getTicks(),u=e.get("axisLabel.showMinLabel"),c=e.get("axisLabel.showMaxLabel"),d=[],f=[],p=t._transform,g=[],m=l.length,v=0;v<m;v++){if(!sg(n,v,s,m,u,c)){var y=l[v];d[0]=y,d[1]=0,f[0]=y,f[1]=i.tickDirection*r,p&&(wt(d,d,p),wt(f,f,p));var x=new br(Hr({anid:"tick_"+h[v],shape:{x1:d[0],y1:d[1],x2:f[0],y2:f[1]},style:C(o.getLineStyle(),{stroke:e.get("axisLine.lineStyle.color")}),z2:2,silent:!0}));t.group.add(x),g.push(x);}}return g;}(this,t,e);!function(t,e,i){var n=t.get("axisLabel.showMinLabel"),a=t.get("axisLabel.showMaxLabel");i=i||[];var o=(e=e||[])[0],r=e[1],s=e[e.length-1],l=e[e.length-2],h=i[0],u=i[1],c=i[i.length-1],d=i[i.length-2];!1===n?(ag(o),ag(h)):og(o,r)&&(n?(ag(r),ag(u)):(ag(o),ag(h)));!1===a?(ag(s),ag(c)):og(l,s)&&(a?(ag(l),ag(d)):(ag(s),ag(c)));}(t,function(s,l,h){var u=l.axis;if(!W(h.axisLabelShow,l.get("axisLabel.show"))||u.scale.isBlank())return;var c=l.getModel("axisLabel"),d=c.get("margin"),f=u.scale.getTicks(),p=l.getFormattedLabels(),t=(W(h.labelRotate,c.get("rotate"))||0)*Jp/180,g=ig(h.rotation,t,h.labelDirection),m=l.getCategories(!0),v=[],y=ng(l),x=l.get("triggerEvent"),_=l.get("axisLabel.showMinLabel"),w=l.get("axisLabel.showMaxLabel");return z(f,function(t,e){if(!sg(u,e,h.labelInterval,f.length,_,w)){var i=c;m&&m[t]&&m[t].textStyle&&(i=new As(m[t].textStyle,c,l.ecModel));var n=i.getTextColor()||l.get("axisLine.lineStyle.color"),a=[u.dataToCoord(t),h.labelOffset+h.labelDirection*d],o=u.scale.getLabel(t),r=new hr({anid:"label_"+t,position:a,rotation:g.rotation,silent:y,z2:10});rs(r.style,i,{text:p[e],textAlign:i.getShallow("align",!0)||g.textAlign,textVerticalAlign:i.getShallow("verticalAlign",!0)||i.getShallow("baseline",!0)||g.textVerticalAlign,textFill:"function"==typeof n?n("category"===u.type?o:"value"===u.type?t+"":t,e):n}),x&&(r.eventData=Qp(l),r.eventData.targetType="axisLabel",r.eventData.value=o),s._dumbGroup.add(r),r.updateTransform(),v.push(r),s.group.add(r),r.decomposeTransform();}}),v;}(this,t,e),i);},axisName:function axisName(){var t=this.opt,e=this.axisModel,i=W(t.axisName,e.get("name"));if(i){var n,a,o=e.get("nameLocation"),r=t.nameDirection,s=e.getModel("nameTextStyle"),l=e.get("nameGap")||0,h=this.axisModel.axis.getExtent(),u=h[0]>h[1]?-1:1,c=["start"===o?h[0]-u*l:"end"===o?h[1]+u*l:(h[0]+h[1])/2,rg(o)?t.labelOffset+r*l:0],d=e.get("nameRotate");null!=d&&(d=d*Jp/180),rg(o)?n=ig(t.rotation,null!=d?d:t.rotation,r):(n=function(t,e,i,n){var a,o,r=Hs(i-t.rotation),s=n[0]>n[1],l="start"===e&&!s||"start"!==e&&s;Zs(r-Jp/2)?(o=l?"bottom":"top",a="center"):Zs(r-1.5*Jp)?(o=l?"top":"bottom",a="center"):(o="middle",a=r<1.5*Jp&&Jp/2<r?l?"left":"right":l?"right":"left");return{rotation:r,textAlign:a,textVerticalAlign:o};}(t,o,d||0,h),null!=(a=t.axisNameAvailableWidth)&&(a=Math.abs(a/Math.sin(n.rotation)),!isFinite(a)&&(a=null)));var f=s.getFont(),p=e.get("nameTruncate",!0)||{},g=p.ellipsis,m=W(t.nameTruncateMaxWidth,p.maxWidth,a),v=null!=g&&null!=m?fl(i,m,f,g,{minChar:2,placeholder:p.placeholder}):i,y=e.get("tooltip",!0),x=e.mainType,_={componentType:x,name:i,$vars:["name"]};_[x+"Index"]=e.componentIndex;var w=new hr({anid:"name",__fullText:i,__truncatedText:v,position:c,rotation:n.rotation,silent:ng(e),z2:1,tooltip:y&&y.show?k({content:i,formatter:function formatter(){return i;},formatterParams:_},y):null});rs(w.style,s,{text:v,textFont:f,textFill:s.getTextColor()||e.get("axisLine.lineStyle.color"),textAlign:n.textAlign,textVerticalAlign:n.textVerticalAlign}),e.get("triggerEvent")&&(w.eventData=Qp(e),w.eventData.targetType="axisName",w.eventData.name=i),this._dumbGroup.add(w),w.updateTransform(),this.group.add(w),w.decomposeTransform();}}},ig=tg.innerTextLayout=function(t,e,i){var n,a,o=Hs(e-t);return Zs(o)?(a=0<i?"top":"bottom",n="center"):Zs(o-Jp)?(a=0<i?"bottom":"top",n="center"):(a="middle",n=0<o&&o<Jp?0<i?"right":"left":0<i?"left":"right"),{rotation:o,textAlign:n,textVerticalAlign:a};};function ng(t){var e=t.get("tooltip");return t.get("silent")||!(t.get("triggerEvent")||e&&e.show);}function ag(t){t&&(t.ignore=!0);}function og(t,e,i){var n=t&&t.getBoundingRect().clone(),a=e&&e.getBoundingRect().clone();if(n&&a){var o=Rt([]);return Gt(o,o,-t.rotation),n.applyTransform(Bt([],o,t.getLocalTransform())),a.applyTransform(Bt([],o,e.getLocalTransform())),n.intersect(a);}}function rg(t){return"middle"===t||"center"===t;}var sg=tg.ifIgnoreOnTick=function(t,e,i,n,a,o){if(0===e&&a||e===n-1&&o)return!1;var r,s=t.scale;return"ordinal"===s.type&&("function"==typeof i?!i(r=s.getTicks()[e],s.getLabel(r)):e%(i+1));},lg=tg.getInterval=function(t,e){var i=t.get("interval");return null!=i&&"auto"!=i||(i=e),i;};var hg=z,ug=N;function cg(t,e){var p,g,i,r,m,v,y,n={axesInfo:{},seriesInvolved:!1,coordSysAxesInfo:{},coordSysMap:{}};return p=n,i=e,r=(g=t).getComponent("tooltip"),m=g.getComponent("axisPointer"),v=m.get("link",!0)||[],y=[],hg(i.getCoordinateSystems(),function(c){if(c.axisPointerEnabled){var t=gg(c.model),d=p.coordSysAxesInfo[t]={},e=(p.coordSysMap[t]=c).model,f=e.getModel("tooltip",r);if(hg(c.getAxes(),ug(o,!1,null)),c.getTooltipAxes&&r&&f.get("show")){var i="axis"===f.get("trigger"),n="cross"===f.get("axisPointer.type"),a=c.getTooltipAxes(f.get("axisPointer.axis"));(i||n)&&hg(a.baseAxes,ug(o,!n||"cross",i)),n&&hg(a.otherAxes,ug(o,"cross",!1));}}function o(t,e,i){var n=i.model.getModel("axisPointer",m),a=n.get("show");if(a&&("auto"!==a||t||pg(n))){null==e&&(e=n.get("triggerTooltip"));var o=(n=t?function(t,e,i,n,a,o){var r=e.getModel("axisPointer"),s={};hg(["type","snap","lineStyle","shadowStyle","label","animation","animationDurationUpdate","animationEasingUpdate","z"],function(t){s[t]=A(r.get(t));}),s.snap="category"!==t.type&&!!o,"cross"===r.get("type")&&(s.type="line");var l=s.label||(s.label={});if(null==l.show&&(l.show=!1),"cross"===a){var h=r.get("label.show");if(l.show=null==h||h,!o){var u=s.lineStyle=r.get("crossStyle");u&&C(l,u.textStyle);}}return t.model.getModel("axisPointer",new As(s,i,n));}(i,f,m,g,t,e):n).get("snap"),r=gg(i.model),s=e||o||"category"===i.type,l=p.axesInfo[r]={key:r,axis:i,coordSys:c,axisPointerModel:n,triggerTooltip:e,involveSeries:s,snap:o,useHandle:pg(n),seriesModels:[]};d[r]=l,p.seriesInvolved|=s;var h=function(t,e){for(var i=e.model,n=e.dim,a=0;a<t.length;a++){var o=t[a]||{};if(dg(o[n+"AxisId"],i.id)||dg(o[n+"AxisIndex"],i.componentIndex)||dg(o[n+"AxisName"],i.name))return a;}}(v,i);if(null!=h){var u=y[h]||(y[h]={axesInfo:{}});u.axesInfo[r]=l,u.mapper=v[h].mapper,l.linkGroup=u;}}}}),n.seriesInvolved&&function(a,t){t.eachSeries(function(i){var n=i.coordinateSystem,t=i.get("tooltip.trigger",!0),e=i.get("tooltip.show",!0);n&&"none"!==t&&!1!==t&&"item"!==t&&!1!==e&&!1!==i.get("axisPointer.show",!0)&&hg(a.coordSysAxesInfo[gg(n.model)],function(t){var e=t.axis;n.getAxis(e.dim)===e&&(t.seriesModels.push(i),null==t.seriesDataCount&&(t.seriesDataCount=0),t.seriesDataCount+=i.getData().count());});},this);}(n,t),n;}function dg(t,e){return"all"===t||E(t)&&0<=L(t,e)||t===e;}function fg(t){var e=(t.ecModel.getComponent("axisPointer")||{}).coordSysAxesInfo;return e&&e.axesInfo[gg(t)];}function pg(t){return!!t.get("handle.show");}function gg(t){return t.type+"||"+t.id;}var mg=Kc({type:"axis",_axisPointer:null,axisPointerClass:null,render:function render(t,e,i,n){this.axisPointerClass&&function(t){var e=fg(t);if(e){var i=e.axisPointerModel,n=e.axis.scale,a=i.option,o=i.get("status"),r=i.get("value");null!=r&&(r=n.parse(r));var s=pg(i);null==o&&(a.status=s?"show":"hide");var l=n.getExtent().slice();l[0]>l[1]&&l.reverse(),(null==r||r>l[1])&&(r=l[1]),r<l[0]&&(r=l[0]),a.value=r,s&&(a.status=e.axis.scale.isBlank()?"hide":"show");}}(t),mg.superApply(this,"render",arguments),vg(this,t,e,i,n,!0);},updateAxisPointer:function updateAxisPointer(t,e,i,n,a){vg(this,t,e,i,n,!1);},remove:function remove(t,e){var i=this._axisPointer;i&&i.remove(e),mg.superApply(this,"remove",arguments);},dispose:function dispose(t,e){yg(this,e),mg.superApply(this,"dispose",arguments);}});function vg(t,e,i,n,a,o){var r=mg.getAxisPointerClass(t.axisPointerClass);if(r){var s,l=(s=fg(e))&&s.axisPointerModel;l?(t._axisPointer||(t._axisPointer=new r())).render(e,l,n,o):yg(t,n);}}function yg(t,e,i){var n=t._axisPointer;n&&n.dispose(e,i),t._axisPointer=null;}var xg=[];function _g(t,e,i){i=i||{};var n=t.coordinateSystem,a=e.axis,o={},r=a.getAxesOnZeroOf()[0],s=a.position,l=r?"onZero":s,h=a.dim,u=n.getRect(),c=[u.x,u.x+u.width,u.y,u.y+u.height],d={left:0,right:1,top:0,bottom:1,onZero:2},f=e.get("offset")||0,p="x"===h?[c[2]-f,c[3]+f]:[c[0]-f,c[1]+f];if(r){var g=r.toGlobalCoord(r.dataToCoord(0));p[d.onZero]=Math.max(Math.min(g,p[1]),p[0]);}o.position=["y"===h?p[d[l]]:c[0],"x"===h?p[d[l]]:c[3]],o.rotation=Math.PI/2*("x"===h?0:1);o.labelDirection=o.tickDirection=o.nameDirection={top:-1,bottom:1,left:-1,right:1}[s],o.labelOffset=r?p[d[s]]-p[d.onZero]:0,e.get("axisTick.inside")&&(o.tickDirection=-o.tickDirection),W(i.labelInside,e.get("axisLabel.inside"))&&(o.labelDirection=-o.labelDirection);var m=e.get("axisLabel.rotate");return o.labelRotate="top"===l?-m:m,o.labelInterval=a.getLabelInterval(),o.z2=1,o;}mg.registerAxisPointerClass=function(t,e){xg[t]=e;},mg.getAxisPointerClass=function(t){return t&&xg[t];};var wg=tg.ifIgnoreOnTick,bg=tg.getInterval,Sg=["axisLine","axisTickLabel","axisName"],Mg=["splitArea","splitLine"],Ig=mg.extend({type:"cartesianAxis",axisPointerClass:"CartesianAxisPointer",render:function render(e,t,i,n){this.group.removeAll();var a=this._axisGroup;if(this._axisGroup=new ii(),this.group.add(this._axisGroup),e.get("show")){var o=e.getCoordSysModel(),r=_g(o,e),s=new tg(e,r);z(Sg,s.add,s),this._axisGroup.add(s.getGroup()),z(Mg,function(t){e.get(t+".show")&&this["_"+t](e,o,r.labelInterval);},this),ys(a,this._axisGroup,e),Ig.superCall(this,"render",e,t,i,n);}},_splitLine:function _splitLine(t,e,i){var n=t.axis;if(!n.scale.isBlank()){var a=t.getModel("splitLine"),o=a.getModel("lineStyle"),r=o.get("color"),s=bg(a,i);r=E(r)?r:[r];for(var l=e.coordinateSystem.getRect(),h=n.isHorizontal(),u=0,c=n.getTicksCoords(),d=n.scale.getTicks(),f=t.get("axisLabel.showMinLabel"),p=t.get("axisLabel.showMaxLabel"),g=[],m=[],v=o.getLineStyle(),y=0;y<c.length;y++){if(!wg(n,y,s,c.length,f,p)){var x=n.toGlobalCoord(c[y]);h?(g[0]=x,g[1]=l.y,m[0]=x,m[1]=l.y+l.height):(g[0]=l.x,g[1]=x,m[0]=l.x+l.width,m[1]=x);var _=u++%r.length;this._axisGroup.add(new br(Hr({anid:"line_"+d[y],shape:{x1:g[0],y1:g[1],x2:m[0],y2:m[1]},style:C({stroke:r[_]},v),silent:!0})));}}}},_splitArea:function _splitArea(t,e,i){var n=t.axis;if(!n.scale.isBlank()){var a=t.getModel("splitArea"),o=a.getModel("areaStyle"),r=o.get("color"),s=e.coordinateSystem.getRect(),l=n.getTicksCoords(),h=n.scale.getTicks(),u=n.toGlobalCoord(l[0]),c=n.toGlobalCoord(l[0]),d=0,f=bg(a,i),p=o.getAreaStyle();r=E(r)?r:[r];for(var g=t.get("axisLabel.showMinLabel"),m=t.get("axisLabel.showMaxLabel"),v=1;v<l.length;v++){if(!(wg(n,v,f,l.length,g,m)&&v<l.length-1)){var y,x,_,w,b=n.toGlobalCoord(l[v]);n.isHorizontal()?(y=u,x=s.y,_=b-y,w=s.height):(y=s.x,x=c,_=s.width,w=b-x);var S=d++%r.length;this._axisGroup.add(new wr({anid:"area_"+h[v],shape:{x:y,y:x,width:_,height:w},style:C({fill:r[S]},p),silent:!0})),u=y+_,c=x+w;}}}}});Ig.extend({type:"xAxis"}),Ig.extend({type:"yAxis"}),Kc({type:"grid",render:function render(t,e){this.group.removeAll(),t.get("show")&&this.group.add(new wr({shape:t.coordinateSystem.getRect(),style:C({fill:t.get("backgroundColor")},t.getItemStyle()),silent:!0,z2:-1}));}}),Wc(function(t){t.xAxis&&t.yAxis&&!t.grid&&(t.grid={});}),jc(Tp("line","circle","line")),Uc(Dp("line")),Fc(tc.PROCESSOR.STATISTIC,{seriesType:"line",modifyOutputEnd:!0,reset:function reset(t,e,i){var n=t.getData(),a=t.get("sampling"),o=t.coordinateSystem;if("cartesian2d"===o.type&&a){var r,s=o.getBaseAxis(),l=o.getOtherAxis(s),h=s.getExtent(),u=h[1]-h[0],c=Math.round(n.count()/u);1<c&&("string"==typeof a?r=Ap[a]:"function"==typeof a&&(r=a),r&&t.setData(n.downSample(n.mapDimension(l.dim),1/c,r,Cp)));}}});var Tg=Xh.extend({type:"series.__base_bar__",getInitialData:function getInitialData(t,e){return Ld(this.getSource(),this);},getMarkerPosition:function getMarkerPosition(t){var e=this.coordinateSystem;if(e){var i=e.dataToPoint(e.clampData(t)),n=this.getData(),a=n.getLayout("offset"),o=n.getLayout("size");return i[e.getBaseAxis().isHorizontal()?0:1]+=a+o/2,i;}return[NaN,NaN];},defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,barMinHeight:0,barMinAngle:0,itemStyle:{},emphasis:{}}});function Dg(t,e,i,n,a,o,r){os(t,e,i.getModel("label"),i.getModel("emphasis.label"),{labelFetcher:a,labelDataIndex:o,defaultText:Zf(a.getData(),o),isRectText:!0,autoColor:n}),Ag(t),Ag(e);}function Ag(t,e){"outside"===t.textPosition&&(t.textPosition=e);}Tg.extend({type:"series.bar",dependencies:["grid","polar"],brushSelector:"rect"});var Cg=Ca([["fill","color"],["stroke","borderColor"],["lineWidth","borderWidth"],["stroke","barBorderColor"],["lineWidth","barBorderWidth"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"]]),Lg=["itemStyle","barBorderWidth"];k(As.prototype,{getBarItemStyle:function getBarItemStyle(t){var e=Cg(this,t);if(this.getBorderLineDash){var i=this.getBorderLineDash();i&&(e.lineDash=i);}return e;}}),Jc({type:"bar",render:function render(t,e,i){var n=t.get("coordinateSystem");return"cartesian2d"!==n&&"polar"!==n||this._render(t,e,i),this.group;},dispose:tt,_render:function _render(o,t,e){var r,s=this.group,l=o.getData(),h=this._data,u=o.coordinateSystem,i=u.getBaseAxis();"cartesian2d"===u.type?r=i.isHorizontal():"polar"===u.type&&(r="angle"===i.dim);var c=o.isAnimationEnabled()?o:null;l.diff(h).add(function(t){if(l.hasValue(t)){var e=l.getItemModel(t),i=Og[u.type](l,t,e),n=kg[u.type](l,t,e,i,r,c);l.setItemGraphicEl(t,n),s.add(n),Eg(n,l,t,e,i,o,r,"polar"===u.type);}}).update(function(t,e){var i=h.getItemGraphicEl(e);if(l.hasValue(t)){var n=l.getItemModel(t),a=Og[u.type](l,t,n);i?fs(i,{shape:a},c,t):i=kg[u.type](l,t,n,a,r,c,!0),l.setItemGraphicEl(t,i),s.add(i),Eg(i,l,t,n,a,o,r,"polar"===u.type);}else s.remove(i);}).remove(function(t){var e=h.getItemGraphicEl(t);"cartesian2d"===u.type?e&&Pg(t,c,e):e&&Ng(t,c,e);}).execute(),this._data=l;},remove:function remove(e,t){var i=this.group,n=this._data;e.get("animation")?n&&n.eachItemGraphicEl(function(t){"sector"===t.type?Ng(t.dataIndex,e,t):Pg(t.dataIndex,e,t);}):i.removeAll();}});var kg={cartesian2d:function cartesian2d(t,e,i,n,a,o,r){var s=new wr({shape:k({},n)});if(o){var l=a?"height":"width",h={};s.shape[l]=0,h[l]=n[l],ws[r?"updateProps":"initProps"](s,{shape:h},o,e);}return s;},polar:function polar(t,e,i,n,a,o,r){var s=n.startAngle<n.endAngle,l=new fr({shape:C({clockwise:s},n)});if(o){var h=a?"r":"endAngle",u={};l.shape[h]=a?0:n.startAngle,u[h]=n[h],ws[r?"updateProps":"initProps"](l,{shape:u},o,e);}return l;}};function Pg(t,e,i){i.style.text=null,fs(i,{shape:{width:0}},e,t,function(){i.parent&&i.parent.remove(i);});}function Ng(t,e,i){i.style.text=null,fs(i,{shape:{r:i.shape.r0}},e,t,function(){i.parent&&i.parent.remove(i);});}var Og={cartesian2d:function cartesian2d(t,e,i){var n,a,o=t.getItemLayout(e),r=(n=o,a=i.get(Lg)||0,Math.min(a,Math.abs(n.width),Math.abs(n.height))),s=0<o.width?1:-1,l=0<o.height?1:-1;return{x:o.x+s*r/2,y:o.y+l*r/2,width:o.width-s*r,height:o.height-l*r};},polar:function polar(t,e,i){var n=t.getItemLayout(e);return{cx:n.cx,cy:n.cy,r0:n.r0,r:n.r,startAngle:n.startAngle,endAngle:n.endAngle};}};function Eg(t,e,i,n,a,o,r,s){var l=e.getItemVisual(i,"color"),h=e.getItemVisual(i,"opacity"),u=n.getModel("itemStyle"),c=n.getModel("emphasis.itemStyle").getBarItemStyle();s||t.setShape("r",u.get("barBorderRadius")||0),t.useStyle(C({fill:l,opacity:h},u.getBarItemStyle()));var d=n.getShallow("cursor");d&&t.attr("cursor",d);r?a.height:a.width;s||Dg(t.style,c,n,l,o,i),as(t,c);}Uc(N(qd,"bar")),jc(function(t){t.eachSeriesByType("bar",function(t){t.getData().setVisual("legendSymbol","roundRect");});});var Rg=function Rg(t,e,i){e=E(e)&&{coordDimensions:e}||k({},e);var n=t.getSource(),a=Dd(n,e),o=new pd(a,t);return o.initData(n,i),o;},zg={updateSelectedMap:function updateSelectedMap(t){this._targetList=E(t)?t.slice():[],this._selectTargetMap=b(t||[],function(t,e){return t.set(e.name,e),t;},J());},select:function select(t,e){var i=null!=e?this._targetList[e]:this._selectTargetMap.get(t);"single"===this.get("selectedMode")&&this._selectTargetMap.each(function(t){t.selected=!1;}),i&&(i.selected=!0);},unSelect:function unSelect(t,e){var i=null!=e?this._targetList[e]:this._selectTargetMap.get(t);i&&(i.selected=!1);},toggleSelected:function toggleSelected(t,e){var i=null!=e?this._targetList[e]:this._selectTargetMap.get(t);if(null!=i)return this[i.selected?"unSelect":"select"](t,e),i.selected;},isSelected:function isSelected(t,e){var i=null!=e?this._targetList[e]:this._selectTargetMap.get(t);return i&&i.selected;}},Bg=$c({type:"series.pie",init:function init(t){Bg.superApply(this,"init",arguments),this.legendDataProvider=function(){return this.getRawData();},this.updateSelectedMap(this._createSelectableList()),this._defaultLabelLine(t);},mergeOption:function mergeOption(t){Bg.superCall(this,"mergeOption",t),this.updateSelectedMap(this._createSelectableList());},getInitialData:function getInitialData(t,e){return Rg(this,["value"]);},_createSelectableList:function _createSelectableList(){for(var t=this.getRawData(),e=t.mapDimension("value"),i=[],n=0,a=t.count();n<a;n++){i.push({name:t.getName(n),value:t.get(e,n),selected:Gh(t,n,"selected")});}return i;},getDataParams:function getDataParams(t){var e=this.getData(),i=Bg.superCall(this,"getDataParams",t),n=[];return e.each(e.mapDimension("value"),function(t){n.push(t);}),i.percent=Ws(n,t,e.hostModel.get("percentPrecision")),i.$vars.push("percent"),i;},_defaultLabelLine:function _defaultLabelLine(t){sa(t,"labelLine",["show"]);var e=t.labelLine,i=t.emphasis.labelLine;e.show=e.show&&t.label.show,i.show=i.show&&t.emphasis.label.show;},defaultOption:{zlevel:0,z:2,legendHoverLink:!0,hoverAnimation:!0,center:["50%","50%"],radius:[0,"75%"],clockwise:!0,startAngle:90,minAngle:0,selectedOffset:10,hoverOffset:10,avoidLabelOverlap:!0,percentPrecision:2,stillShowZeroSum:!0,label:{rotate:!1,show:!0,position:"outer"},labelLine:{show:!0,length:15,length2:15,smooth:!1,lineStyle:{width:1,type:"solid"}},itemStyle:{borderWidth:1},animationType:"expansion",animationEasing:"cubicOut"}});function Vg(t,e,i,n){var a=e.getData(),o=this.dataIndex,r=a.getName(o),s=e.get("selectedOffset");n.dispatchAction({type:"pieToggleSelect",from:t,name:r,seriesId:e.id}),a.each(function(t){Gg(a.getItemGraphicEl(t),a.getItemLayout(t),e.isSelected(a.getName(t)),s,i);});}function Gg(t,e,i,n,a){var o=(e.startAngle+e.endAngle)/2,r=i?n:0,s=[Math.cos(o)*r,Math.sin(o)*r];a?t.animate().when(200,{position:s}).start("bounceOut"):t.attr("position",s);}function Wg(t,e){ii.call(this);var i=new fr({z2:2}),n=new _r(),a=new hr();function o(){n.ignore=n.hoverIgnore,a.ignore=a.hoverIgnore;}function r(){n.ignore=n.normalIgnore,a.ignore=a.normalIgnore;}this.add(i),this.add(n),this.add(a),this.updateData(t,e,!0),this.on("emphasis",o).on("normal",r).on("mouseover",o).on("mouseout",r);}w(Bg,zg);var Fg=Wg.prototype;Fg.updateData=function(t,e,i){var n=this.childAt(0),a=t.hostModel,o=t.getItemModel(e),r=t.getItemLayout(e),s=k({},r);(s.label=null,i)?(n.setShape(s),"scale"===a.getShallow("animationType")?(n.shape.r=r.r0,ps(n,{shape:{r:r.r}},a,e)):(n.shape.endAngle=r.startAngle,fs(n,{shape:{endAngle:r.endAngle}},a,e))):fs(n,{shape:s},a,e);var l=t.getItemVisual(e,"color");n.useStyle(C({lineJoin:"bevel",fill:l},o.getModel("itemStyle").getItemStyle())),n.hoverStyle=o.getModel("emphasis.itemStyle").getItemStyle();var h=o.getShallow("cursor");function u(){n.stopAnimation(!0),n.animateTo({shape:{r:r.r+a.get("hoverOffset")}},300,"elasticOut");}function c(){n.stopAnimation(!0),n.animateTo({shape:{r:r.r}},300,"elasticOut");}h&&n.attr("cursor",h),Gg(this,t.getItemLayout(e),a.isSelected(null,e),a.get("selectedOffset"),a.get("animation")),n.off("mouseover").off("mouseout").off("emphasis").off("normal"),o.get("hoverAnimation")&&a.isAnimationEnabled()&&n.on("mouseover",u).on("mouseout",c).on("emphasis",u).on("normal",c),this._updateLabel(t,e),as(this);},Fg._updateLabel=function(t,e){var i=this.childAt(1),n=this.childAt(2),a=t.hostModel,o=t.getItemModel(e),r=t.getItemLayout(e).label,s=t.getItemVisual(e,"color");fs(i,{shape:{points:r.linePoints||[[r.x,r.y],[r.x,r.y],[r.x,r.y]]}},a,e),fs(n,{style:{x:r.x,y:r.y}},a,e),n.attr({rotation:r.rotation,origin:[r.x,r.y],z2:10});var l=o.getModel("label"),h=o.getModel("emphasis.label"),u=o.getModel("labelLine"),c=o.getModel("emphasis.labelLine");s=t.getItemVisual(e,"color");os(n.style,n.hoverStyle={},l,h,{labelFetcher:t.hostModel,labelDataIndex:e,defaultText:t.getName(e),autoColor:s,useInsideStyle:!!r.inside},{textAlign:r.textAlign,textVerticalAlign:r.verticalAlign,opacity:t.getItemVisual(e,"opacity")}),n.ignore=n.normalIgnore=!l.get("show"),n.hoverIgnore=!h.get("show"),i.ignore=i.normalIgnore=!u.get("show"),i.hoverIgnore=!c.get("show"),i.setStyle({stroke:s,opacity:t.getItemVisual(e,"opacity")}),i.setStyle(u.getModel("lineStyle").getLineStyle()),i.hoverStyle=c.getModel("lineStyle").getLineStyle();var d=u.get("smooth");d&&!0===d&&(d=.4),i.setShape({smooth:d});},_(Wg,ii);ru.extend({type:"pie",init:function init(){var t=new ii();this._sectorGroup=t;},render:function render(t,e,i,n){if(!n||n.from!==this.uid){var a=t.getData(),o=this._data,r=this.group,s=e.get("animation"),l=!o,h=t.get("animationType"),u=N(Vg,this.uid,t,s,i),c=t.get("selectedMode");if(a.diff(o).add(function(t){var e=new Wg(a,t);l&&"scale"!==h&&e.eachChild(function(t){t.stopAnimation(!0);}),c&&e.on("click",u),a.setItemGraphicEl(t,e),r.add(e);}).update(function(t,e){var i=o.getItemGraphicEl(e);i.updateData(a,t),i.off("click"),c&&i.on("click",u),r.add(i),a.setItemGraphicEl(t,i);}).remove(function(t){var e=o.getItemGraphicEl(t);r.remove(e);}).execute(),s&&l&&0<a.count()&&"scale"!==h){var d=a.getItemLayout(0),f=Math.max(i.getWidth(),i.getHeight())/2,p=S(r.removeClipPath,r);r.setClipPath(this._createClipPath(d.cx,d.cy,f,d.startAngle,d.clockwise,p,t));}this._data=a;}},dispose:function dispose(){},_createClipPath:function _createClipPath(t,e,i,n,a,o,r){var s=new fr({shape:{cx:t,cy:e,r0:0,r:i,startAngle:n,endAngle:n,clockwise:a}});return ps(s,{shape:{endAngle:n+(a?1:-1)*Math.PI*2}},r,o),s;},containPoint:function containPoint(t,e){var i=e.getData().getItemLayout(0);if(i){var n=t[0]-i.cx,a=t[1]-i.cy,o=Math.sqrt(n*n+a*a);return o<=i.r&&o>=i.r0;}}});var Hg=function Hg(i,t){z(t,function(o){o.update="updateView",Hc(o,function(t,e){var a={};return e.eachComponent({mainType:"series",subType:i,query:t},function(i){i[o.method]&&i[o.method](t.name,t.dataIndex);var n=i.getData();n.each(function(t){var e=n.getName(t);a[e]=i.isSelected(e)||!1;});}),{name:t.name,selected:a};});});},Zg=function Zg(n){return{getTargetSeries:function getTargetSeries(t){var e={},i=J();return t.eachSeriesByType(n,function(t){t.__paletteScope=e,i.set(t.uid,t);}),i;},reset:function reset(a,t){var o=a.getRawData(),r={},s=a.getData();s.each(function(t){var e=s.getRawIndex(t);r[e]=t;}),o.each(function(t){var e=r[t],i=null!=e&&s.getItemVisual(e,"color",!0);if(i)o.setItemVisual(t,"color",i);else{var n=o.getItemModel(t).get("itemStyle.color")||a.getColorFromPalette(o.getName(t)||t+"",a.__paletteScope,o.count());o.setItemVisual(t,"color",n),null!=e&&s.setItemVisual(e,"color",n);}});}};};function Ug(o,t,e,i,n,a,r){function s(t,e,i,n){for(var a=t;a<e;a++){if(o[a].y+=i,t<a&&a+1<e&&o[a+1].y>o[a].y+o[a].height)return void l(a,i/2);}l(e-1,i/2);}function l(t,e){for(var i=t;0<=i&&(o[i].y-=e,!(0<i&&o[i].y>o[i-1].y+o[i-1].height));i--){}}function h(t,e,i,n,a,o){for(var r=e?Number.MAX_VALUE:0,s=0,l=t.length;s<l;s++){if("center"!==t[s].position){var h=Math.abs(t[s].y-n),u=t[s].len,c=t[s].len2,d=h<a+u?Math.sqrt((a+u+c)*(a+u+c)-h*h):Math.abs(t[s].x-i);e&&r<=d&&(d=r-10),!e&&d<=r&&(d=r+10),t[s].x=i+d*o,r=d;}}}o.sort(function(t,e){return t.y-e.y;});for(var u,c=0,d=o.length,f=[],p=[],g=0;g<d;g++){(u=o[g].y-c)<0&&s(g,d,-u),c=o[g].y+o[g].height;}r-c<0&&l(d-1,c-r);for(g=0;g<d;g++){o[g].y>=e?p.push(o[g]):f.push(o[g]);}h(f,!1,t,e,i,n),h(p,!0,t,e,i,n);}var jg=function jg(M,I,t,e){var T,D,A=M.getData(),C=[],L=!1;A.each(function(t){var e,i,n,a,o=A.getItemLayout(t),r=A.getItemModel(t),s=r.getModel("label"),l=s.get("position")||r.get("emphasis.label.position"),h=r.getModel("labelLine"),u=h.get("length"),c=h.get("length2"),d=(o.startAngle+o.endAngle)/2,f=Math.cos(d),p=Math.sin(d);T=o.cx,D=o.cy;var g="inside"===l||"inner"===l;if("center"===l)e=o.cx,i=o.cy,a="center";else{var m=(g?(o.r+o.r0)/2*f:o.r*f)+T,v=(g?(o.r+o.r0)/2*p:o.r*p)+D;if(e=m+3*f,i=v+3*p,!g){var y=m+f*(u+I-o.r),x=v+p*(u+I-o.r),_=y+(f<0?-1:1)*c;e=_+(f<0?-5:5),n=[[m,v],[y,x],[_,i=x]];}a=g?"center":0<f?"left":"right";}var w=s.getFont(),b=s.get("rotate")?f<0?-d+Math.PI:-d:0,S=Vi(M.getFormattedLabel(t,"normal")||A.getName(t),w,a,"top");L=!!b,o.label={x:e,y:i,position:l,height:S.height,len:u,len2:c,linePoints:n,textAlign:a,verticalAlign:"middle",rotation:b,inside:g},g||C.push(o.label);}),!L&&M.get("avoidLabelOverlap")&&function(t,e,i,n,a,o){for(var r=[],s=[],l=0;l<t.length;l++){t[l].x<e?r.push(t[l]):s.push(t[l]);}for(Ug(s,e,i,n,1,0,o),Ug(r,e,i,n,-1,0,o),l=0;l<t.length;l++){var h=t[l].linePoints;if(h){var u=h[1][0]-h[2][0];t[l].x<e?h[2][0]=t[l].x+3:h[2][0]=t[l].x-3,h[1][1]=h[2][1]=t[l].y,h[1][0]=h[2][0]+u;}}}(C,T,D,I,0,e);},Xg=2*Math.PI,Yg=Math.PI/180,qg=function qg(t){return{seriesType:t,reset:function reset(t,e){var n=e.findComponents({mainType:"legend"});if(n&&n.length){var a=t.getData();a.filterSelf(function(t){for(var e=a.getName(t),i=0;i<n.length;i++){if(!n[i].isSelected(e))return!1;}return!0;});}}};};Hg("pie",[{type:"pieToggleSelect",event:"pieselectchanged",method:"toggleSelected"},{type:"pieSelect",event:"pieselected",method:"select"},{type:"pieUnSelect",event:"pieunselected",method:"unSelect"}]),jc(Zg("pie")),Uc(N(function(t,e,T,i){e.eachSeriesByType(t,function(t){var a=t.getData(),e=a.mapDimension("value"),i=t.get("center"),n=t.get("radius");E(n)||(n=[0,n]),E(i)||(i=[i,i]);var o=T.getWidth(),r=T.getHeight(),s=Math.min(o,r),l=Es(i[0],o),h=Es(i[1],r),u=Es(n[0],s/2),c=Es(n[1],s/2),d=-t.get("startAngle")*Yg,f=t.get("minAngle")*Yg,p=0;a.each(e,function(t){!isNaN(t)&&p++;});var g=a.getSum(e),m=Math.PI/(g||p)*2,v=t.get("clockwise"),y=t.get("roseType"),x=t.get("stillShowZeroSum"),_=a.getDataExtent(e);_[0]=0;var w=Xg,b=0,S=d,M=v?1:-1;if(a.each(e,function(t,e){var i;if(isNaN(t))a.setItemLayout(e,{angle:NaN,startAngle:NaN,endAngle:NaN,clockwise:v,cx:l,cy:h,r0:u,r:y?NaN:c});else{(i="area"!==y?0===g&&x?m:t*m:Xg/p)<f?w-=i=f:b+=t;var n=S+M*i;a.setItemLayout(e,{angle:i,startAngle:S,endAngle:n,clockwise:v,cx:l,cy:h,r0:u,r:y?Os(t,_,[u,c]):c}),S=n;}}),w<Xg&&p)if(w<=.001){var I=Xg/p;a.each(e,function(t,e){if(!isNaN(t)){var i=a.getItemLayout(e);i.angle=I,i.startAngle=d+M*e*I,i.endAngle=d+M*(e+1)*I;}});}else m=w/b,S=d,a.each(e,function(t,e){if(!isNaN(t)){var i=a.getItemLayout(e),n=i.angle===f?f:t*m;i.startAngle=S,i.endAngle=S+M*n,S+=M*n;}});jg(t,c,0,r);});},"pie")),Fc(qg("pie")),Xh.extend({type:"series.scatter",dependencies:["grid","polar","geo","singleAxis","calendar"],getInitialData:function getInitialData(t,e){return Ld(this.getSource(),this);},brushSelector:"point",getProgressive:function getProgressive(){var t=this.option.progressive;return null==t?this.option.large?5e3:this.get("progressive"):t;},getProgressiveThreshold:function getProgressiveThreshold(){var t=this.option.progressiveThreshold;return null==t?this.option.large?1e4:this.get("progressiveThreshold"):t;},defaultOption:{coordinateSystem:"cartesian2d",zlevel:0,z:2,legendHoverLink:!0,hoverAnimation:!0,symbolSize:10,large:!1,largeThreshold:2e3,itemStyle:{opacity:.8},progressive:null}});var Kg=zr({shape:{points:null},symbolProxy:null,buildPath:function buildPath(t,e){var i=e.points,n=e.size,a=this.symbolProxy,o=a.shape;if(!((t.getContext?t.getContext():t)&&n[0]<4))for(var r=0;r<i.length;){var s=i[r++],l=i[r++];isNaN(s)||isNaN(l)||(o.x=s-n[0]/2,o.y=l-n[1]/2,o.width=n[0],o.height=n[1],a.buildPath(t,o,!0));}},afterBrush:function afterBrush(t){var e=this.shape,i=e.points,n=e.size;if(n[0]<4){this.setTransform(t);for(var a=0;a<i.length;){var o=i[a++],r=i[a++];isNaN(o)||isNaN(r)||t.fillRect(o-n[0]/2,r-n[1]/2,n[0],n[1]);}this.restoreTransform(t);}},findDataIndex:function findDataIndex(t,e){for(var i=this.shape,n=i.points,a=i.size,o=Math.max(a[0],4),r=Math.max(a[1],4),s=n.length/2-1;0<=s;s--){var l=2*s,h=n[l]-o/2,u=n[l+1]-r/2;if(h<=t&&u<=e&&t<=h+o&&e<=u+r)return s;}return-1;}});function $g(){this.group=new ii();}var Jg=$g.prototype;function Qg(t,e,i){Wf.call(this,t,e,i),this.type="value",this.angle=0,this.name="",this.model;}function tm(t,e,i){this._model=t,this.dimensions=[],this._indicatorAxes=P(t.getIndicatorModels(),function(t,e){var i="indicator_"+e,n=new Qg(i,new Hd());return n.name=t.get("name"),(n.model=t).axis=n,this.dimensions.push(i),n;},this),this.resize(t,i),this.cx,this.cy,this.r,this.startAngle;}Jg.isPersistent=function(){return!this._incremental;},Jg.updateData=function(t){this.group.removeAll();var e=new Kg({rectHover:!0,cursor:"default"});e.setShape({points:t.getLayout("symbolPoints")}),this._setCommon(e,t),this.group.add(e),this._incremental=null;},Jg.updateLayout=function(t){if(!this._incremental){var n=t.getLayout("symbolPoints");this.group.eachChild(function(t){if(null!=t.startIndex){var e=2*(t.endIndex-t.startIndex),i=4*t.startIndex*2;n=new Float32Array(n.buffer,i,e);}t.setShape("points",n);});}},Jg.incrementalPrepareUpdate=function(t){this.group.removeAll(),this._clearIncremental(),2e6<t.count()?(this._incremental||(this._incremental=new kr({silent:!0})),this.group.add(this._incremental)):this._incremental=null;},Jg.incrementalUpdate=function(t,e){var i;this._incremental?(i=new Kg(),this._incremental.addDisplayable(i,!0)):((i=new Kg({rectHover:!0,cursor:"default",startIndex:t.start,endIndex:t.end})).incremental=!0,this.group.add(i)),i.setShape({points:e.getLayout("symbolPoints")}),this._setCommon(i,e,!!this._incremental);},Jg._setCommon=function(i,t,e){var n=t.hostModel,a=t.getVisual("symbolSize");i.setShape("size",a instanceof Array?a:[a,a]),i.symbolProxy=Cf(t.getVisual("symbol"),0,0,0,0),i.setColor=i.symbolProxy.setColor;var o=i.shape.size[0]<4;i.useStyle(n.getModel("itemStyle").getItemStyle(o?["color","shadowBlur","shadowColor"]:["color"]));var r=t.getVisual("color");r&&i.setColor(r),e||(i.seriesIndex=n.seriesIndex,i.on("mousemove",function(t){i.dataIndex=null;var e=i.findDataIndex(t.offsetX,t.offsetY);0<=e&&(i.dataIndex=e+(i.startIndex||0));}));},Jg.remove=function(){this._clearIncremental(),this._incremental=null,this.group.removeAll();},Jg._clearIncremental=function(){var t=this._incremental;t&&t.clearDisplaybles();},Jc({type:"scatter",render:function render(t,e,i){var n=t.getData();this._updateSymbolDraw(n,t).updateData(n),this._finished=!0;},incrementalPrepareRender:function incrementalPrepareRender(t,e,i){var n=t.getData();this._updateSymbolDraw(n,t).incrementalPrepareUpdate(n),this._finished=!1;},incrementalRender:function incrementalRender(t,e,i){this._symbolDraw.incrementalUpdate(t,e.getData()),this._finished=t.end===e.getData().count();},updateTransform:function updateTransform(t,e,i){var n=t.getData();if(this.group.dirty(),!this._finished||1e4<n.count()||!this._symbolDraw.isPersistent())return{update:!0};var a=Dp().reset(t);a.progress&&a.progress({start:0,end:n.count()},n),this._symbolDraw.updateLayout(n);},_updateSymbolDraw:function _updateSymbolDraw(t,e){var i=this._symbolDraw,n=e.pipelineContext.large;return i&&n===this._isLargeDraw||(i&&i.remove(),i=this._symbolDraw=n?new $g():new Qf(),this._isLargeDraw=n,this.group.removeAll()),this.group.add(i.group),i;},remove:function remove(t,e){this._symbolDraw&&this._symbolDraw.remove(!0),this._symbolDraw=null;},dispose:function dispose(){}}),jc(Tp("scatter","circle")),Uc(Dp("scatter")),_(Qg,Wf),tm.prototype.getIndicatorAxes=function(){return this._indicatorAxes;},tm.prototype.dataToPoint=function(t,e){var i=this._indicatorAxes[e];return this.coordToPoint(i.dataToCoord(t),e);},tm.prototype.coordToPoint=function(t,e){var i=this._indicatorAxes[e].angle;return[this.cx+t*Math.cos(i),this.cy-t*Math.sin(i)];},tm.prototype.pointToData=function(t){var e=t[0]-this.cx,i=t[1]-this.cy,n=Math.sqrt(e*e+i*i);e/=n,i/=n;for(var a,o=Math.atan2(-i,e),r=1/0,s=-1,l=0;l<this._indicatorAxes.length;l++){var h=this._indicatorAxes[l],u=Math.abs(o-h.angle);u<r&&(a=h,s=l,r=u);}return[s,+(a&&a.coodToData(n))];},tm.prototype.resize=function(t,e){var i=t.get("center"),n=e.getWidth(),a=e.getHeight(),o=Math.min(n,a)/2;this.cx=Es(i[0],n),this.cy=Es(i[1],a),this.startAngle=t.get("startAngle")*Math.PI/180,this.r=Es(t.get("radius"),o),z(this._indicatorAxes,function(t,e){t.setExtent(0,this.r);var i=this.startAngle+e*Math.PI*2/this._indicatorAxes.length;i=Math.atan2(Math.sin(i),Math.cos(i)),t.angle=i;},this);},tm.prototype.update=function(n,t){var a=this._indicatorAxes,o=this._model;z(a,function(t){t.scale.setExtent(1/0,-1/0);}),n.eachSeriesByType("radar",function(t,e){if("radar"===t.get("coordinateSystem")&&n.getComponent("radar",t.get("radarIndex"))===o){var i=t.getData();z(a,function(t){t.scale.unionExtentFromData(i,i.mapDimension(t.dim));});}},this);var f=o.get("splitNumber");function p(t){var e=Math.pow(10,Math.floor(Math.log(t)/Math.LN10)),i=t/e;return 2===i?i=5:i*=2,i*e;}z(a,function(t,e){var i=pf(t.scale,t.model);gf(t.scale,t.model);var n=t.model,a=t.scale,o=n.getMin(),r=n.getMax(),s=a.getInterval();if(null!=o&&null!=r)a.setExtent(+o,+r),a.setInterval((r-o)/f);else if(null!=o)for(var l;l=o+s*f,a.setExtent(+o,l),a.setInterval(s),s=p(s),l<i[1]&&isFinite(l)&&isFinite(i[1]);){}else if(null!=r)for(var h;h=r-s*f,a.setExtent(h,+r),a.setInterval(s),s=p(s),h>i[0]&&isFinite(h)&&isFinite(i[0]);){}else{var u=a.getTicks().length-1;f<u&&(s=p(s));var c=Math.round((i[0]+i[1])/2/s)*s,d=Math.round(f/2);a.setExtent(Rs(c-d*s),Rs(c+(f-d)*s)),a.setInterval(s);}});},tm.dimensions=[],tm.create=function(i,n){var a=[];return i.eachComponent("radar",function(t){var e=new tm(t,i,n);a.push(e),t.coordinateSystem=e;}),i.eachSeriesByType("radar",function(t){"radar"===t.get("coordinateSystem")&&(t.coordinateSystem=a[t.get("radarIndex")||0]);}),a;},ah.register("radar",tm);var em=Ep.valueAxis;function im(t,e){return C({show:e},t);}qc({type:"radar",optionUpdated:function optionUpdated(){var a=this.get("boundaryGap"),o=this.get("splitNumber"),r=this.get("scale"),s=this.get("axisLine"),l=this.get("axisTick"),h=this.get("axisLabel"),u=this.get("name"),c=this.get("name.show"),d=this.get("name.formatter"),f=this.get("nameGap"),p=this.get("triggerEvent"),t=P(this.get("indicator")||[],function(t){null!=t.max&&0<t.max&&!t.min?t.min=0:null!=t.min&&t.min<0&&!t.max&&(t.max=0);var e=u;if(null!=t.color&&(e=C({color:t.color},u)),t=g(A(t),{boundaryGap:a,splitNumber:o,scale:r,axisLine:s,axisTick:l,axisLabel:h,name:t.text,nameLocation:"end",nameGap:f,nameTextStyle:e,triggerEvent:p},!1),c||(t.name=""),"string"==typeof d){var i=t.name;t.name=d.replace("{value}",null!=i?i:"");}else"function"==typeof d&&(t.name=d(t.name,t));var n=k(new As(t,null,this.ecModel),_f);return n.mainType="radar",n.componentIndex=this.componentIndex,n;},this);this.getIndicatorModels=function(){return t;};},defaultOption:{zlevel:0,z:0,center:["50%","50%"],radius:"75%",startAngle:90,name:{show:!0},boundaryGap:[0,0],splitNumber:5,nameGap:15,scale:!1,shape:"polygon",axisLine:g({lineStyle:{color:"#bbb"}},em.axisLine),axisLabel:im(em.axisLabel,!1),axisTick:im(em.axisTick,!1),splitLine:im(em.splitLine,!0),splitArea:im(em.splitArea,!0),indicator:[]}});var nm=["axisLine","axisTickLabel","axisName"];Kc({type:"radar",render:function render(t,e,i){this.group.removeAll(),this._buildAxes(t),this._buildSplitLineAndArea(t);},_buildAxes:function _buildAxes(t){var e=t.coordinateSystem;z(P(e.getIndicatorAxes(),function(t){return new tg(t.model,{position:[e.cx,e.cy],rotation:t.angle,labelDirection:-1,tickDirection:-1,nameDirection:1});}),function(t){z(nm,t.add,t),this.group.add(t.getGroup());},this);},_buildSplitLineAndArea:function _buildSplitLineAndArea(t){var n=t.coordinateSystem,e=n.getIndicatorAxes();if(e.length){var i=t.get("shape"),a=t.getModel("splitLine"),o=t.getModel("splitArea"),r=a.getModel("lineStyle"),s=o.getModel("areaStyle"),l=a.get("show"),h=o.get("show"),u=r.get("color"),c=s.get("color");u=E(u)?u:[u],c=E(c)?c:[c];var d=[],f=[];if("circle"===i)for(var p=e[0].getTicksCoords(),g=n.cx,m=n.cy,v=0;v<p.length;v++){if(l)d[I(d,u,v)].push(new ur({shape:{cx:g,cy:m,r:p[v]}}));if(h&&v<p.length-1)f[I(f,c,v)].push(new pr({shape:{cx:g,cy:m,r0:p[v],r:p[v+1]}}));}else{var y,x=P(e,function(t,e){var i=t.getTicksCoords();return y=null==y?i.length-1:Math.min(i.length-1,y),P(i,function(t){return n.coordToPoint(t,e);});}),_=[];for(v=0;v<=y;v++){for(var w=[],b=0;b<e.length;b++){w.push(x[b][v]);}if(w[0]&&w.push(w[0].slice()),l)d[I(d,u,v)].push(new _r({shape:{points:w}}));if(h&&_)f[I(f,c,v-1)].push(new xr({shape:{points:w.concat(_)}}));_=w.slice().reverse();}}var S=r.getLineStyle(),M=s.getAreaStyle();z(f,function(t,e){this.group.add(Wr(t,{style:C({stroke:"none",fill:c[e%c.length]},M),silent:!0}));},this),z(d,function(t,e){this.group.add(Wr(t,{style:C({fill:"none",stroke:u[e%u.length]},S),silent:!0}));},this);}function I(t,e,i){var n=i%e.length;return t[n]=t[n]||[],n;}}});var am=Xh.extend({type:"series.radar",dependencies:["radar"],init:function init(t){am.superApply(this,"init",arguments),this.legendDataProvider=function(){return this.getRawData();};},getInitialData:function getInitialData(t,e){return Rg(this,{generateCoord:"indicator_",generateCoordCount:1/0});},formatTooltip:function formatTooltip(n){var a=this.getData(),t=this.coordinateSystem.getIndicatorAxes(),e=this.getData().getName(n);return al(""===e?this.name:e)+"<br/>"+P(t,function(t,e){var i=a.get(a.mapDimension(t.dim),n);return al(t.name+" : "+i);}).join("<br />");},defaultOption:{zlevel:0,z:2,coordinateSystem:"radar",legendHoverLink:!0,radarIndex:0,lineStyle:{width:2,type:"solid"},label:{position:"top"},symbol:"emptyCircle",symbolSize:4}});Jc({type:"radar",render:function render(l,t,e){var i=l.coordinateSystem,v=this.group,y=l.getData(),s=this._data;function h(t,e){var i=t.getItemVisual(e,"symbol")||"circle",n=t.getItemVisual(e,"color");if("none"!==i){var a,o=(E(a=t.getItemVisual(e,"symbolSize"))||(a=[+a,+a]),a),r=Cf(i,-1,-1,2,2,n);return r.attr({style:{strokeNoScale:!0},z2:100,scale:[o[0]/2,o[1]/2]}),r;}}function u(t,e,i,n,a,o){i.removeAll();for(var r=0;r<e.length-1;r++){var s=h(n,a);s&&(t[s.__dimIdx=r]?(s.attr("position",t[r]),ws[o?"initProps":"updateProps"](s,{position:e[r]},l,a)):s.attr("position",e[r]),i.add(s));}}function c(t){return P(t,function(t){return[i.cx,i.cy];});}y.diff(s).add(function(t){var e=y.getItemLayout(t);if(e){var i=new xr(),n=new _r(),a={shape:{points:e}};i.shape.points=c(e),n.shape.points=c(e),ps(i,a,l,t),ps(n,a,l,t);var o=new ii(),r=new ii();o.add(n),o.add(i),o.add(r),u(n.shape.points,e,r,y,t,!0),y.setItemGraphicEl(t,o);}}).update(function(t,e){var i=s.getItemGraphicEl(e),n=i.childAt(0),a=i.childAt(1),o=i.childAt(2),r={shape:{points:y.getItemLayout(t)}};r.shape.points&&(u(n.shape.points,r.shape.points,o,y,t,!1),fs(n,r,l),fs(a,r,l),y.setItemGraphicEl(t,i));}).remove(function(t){v.remove(s.getItemGraphicEl(t));}).execute(),y.eachItemGraphicEl(function(t,e){var i=y.getItemModel(e),n=t.childAt(0),a=t.childAt(1),o=t.childAt(2),r=y.getItemVisual(e,"color");v.add(t),n.useStyle(C(i.getModel("lineStyle").getLineStyle(),{fill:"none",stroke:r})),n.hoverStyle=i.getModel("emphasis.lineStyle").getLineStyle();var s=i.getModel("areaStyle"),l=i.getModel("emphasis.areaStyle"),h=s.isEmpty()&&s.parentModel.isEmpty(),u=l.isEmpty()&&l.parentModel.isEmpty();u=u&&h,a.ignore=h,a.useStyle(C(s.getAreaStyle(),{fill:r,opacity:.7})),a.hoverStyle=l.getAreaStyle();var c=i.getModel("itemStyle").getItemStyle(["color"]),d=i.getModel("emphasis.itemStyle").getItemStyle(),f=i.getModel("label"),p=i.getModel("emphasis.label");function g(){a.attr("ignore",u);}function m(){a.attr("ignore",h);}o.eachChild(function(t){t.setStyle(c),t.hoverStyle=A(d),os(t.style,t.hoverStyle,f,p,{labelFetcher:y.hostModel,labelDataIndex:e,labelDimIndex:t.__dimIdx,defaultText:y.get(y.dimensions[t.__dimIdx],e),autoColor:r,isRectText:!0});}),t.off("mouseover").off("mouseout").off("normal").off("emphasis"),t.on("emphasis",g).on("mouseover",g).on("normal",m).on("mouseout",m),as(t);}),this._data=y;},remove:function remove(){this.group.removeAll(),this._data=null;},dispose:function dispose(){}});jc(Zg("radar")),jc(Tp("radar","circle")),Uc(function(t){t.eachSeriesByType("radar",function(t){var e=t.getData(),i=[],n=t.coordinateSystem;if(n){for(var a=n.getIndicatorAxes(),o=0;o<a.length;o++){e.each(e.mapDimension(a[o].dim),r);}e.each(function(t){i[t][0]&&i[t].push(i[t][0].slice()),e.setItemLayout(t,i[t]);});}function r(t,e){i[e]=i[e]||[],i[e][o]=n.dataToPoint(t,o);}});}),Fc(qg("radar")),Wc(function(i){var t=i.polar;if(t){E(t)||(t=[t]);var n=[];z(t,function(t,e){t.indicator?(t.type&&!t.shape&&(t.shape=t.type),i.radar=i.radar||[],E(i.radar)||(i.radar=[i.radar]),i.radar.push(t)):n.push(t);}),i.polar=n;}z(i.series,function(t){t&&"radar"===t.type&&t.polarIndex&&(t.radarIndex=t.polarIndex);});});var om=wt;function rm(){Yt.call(this);}function sm(t){this.name=t,this.zoomLimit,Yt.call(this),this._roamTransformable=new rm(),this._rawTransformable=new rm(),this._center,this._zoom;}function lm(t,e,i,n){var a=i.seriesModel,o=a?a.coordinateSystem:null;return o===this?o[t](n):null;}w(rm,Yt),sm.prototype={constructor:sm,type:"view",dimensions:["x","y"],setBoundingRect:function setBoundingRect(t,e,i,n){return this._rect=new ei(t,e,i,n),this._rect;},getBoundingRect:function getBoundingRect(){return this._rect;},setViewRect:function setViewRect(t,e,i,n){this.transformTo(t,e,i,n),this._viewRect=new ei(t,e,i,n);},transformTo:function transformTo(t,e,i,n){var a=this.getBoundingRect(),o=this._rawTransformable;o.transform=a.calculateTransform(new ei(t,e,i,n)),o.decomposeTransform(),this._updateTransform();},setCenter:function setCenter(t){t&&(this._center=t,this._updateCenterAndZoom());},setZoom:function setZoom(t){t=t||1;var e=this.zoomLimit;e&&(null!=e.max&&(t=Math.min(e.max,t)),null!=e.min&&(t=Math.max(e.min,t))),this._zoom=t,this._updateCenterAndZoom();},getDefaultCenter:function getDefaultCenter(){var t=this.getBoundingRect();return[t.x+t.width/2,t.y+t.height/2];},getCenter:function getCenter(){return this._center||this.getDefaultCenter();},getZoom:function getZoom(){return this._zoom||1;},getRoamTransform:function getRoamTransform(){return this._roamTransformable.getLocalTransform();},_updateCenterAndZoom:function _updateCenterAndZoom(){var t=this._rawTransformable.getLocalTransform(),e=this._roamTransformable,i=this.getDefaultCenter(),n=this.getCenter(),a=this.getZoom();n=wt([],n,t),i=wt([],i,t),e.origin=n,e.position=[i[0]-n[0],i[1]-n[1]],e.scale=[a,a],this._updateTransform();},_updateTransform:function _updateTransform(){var t=this._roamTransformable,e=this._rawTransformable;(e.parent=t).updateTransform(),e.updateTransform(),zt(this.transform||(this.transform=[]),e.transform||Et()),this._rawTransform=e.getLocalTransform(),this.invTransform=this.invTransform||[],Ft(this.invTransform,this.transform),this.decomposeTransform();},getViewRect:function getViewRect(){return this._viewRect;},getViewRectAfterRoam:function getViewRectAfterRoam(){var t=this.getBoundingRect().clone();return t.applyTransform(this.transform),t;},dataToPoint:function dataToPoint(t,e,i){var n=e?this._rawTransform:this.transform;return i=i||[],n?om(i,t,n):at(i,t);},pointToData:function pointToData(t){var e=this.invTransform;return e?om([],t,e):[t[0],t[1]];},convertToPixel:N(lm,"dataToPoint"),convertFromPixel:N(lm,"pointToData"),containPoint:function containPoint(t){return this.getViewRectAfterRoam().contain(t[0],t[1]);}},w(sm,Yt);for(var hm=[126,25],um=[[[0,3.5],[7,11.2],[15,11.9],[30,7],[42,.7],[52,.7],[56,7.7],[59,.7],[64,.7],[64,0],[5,0],[0,3.5]],[[13,16.1],[19,14.7],[16,21.7],[11,23.1],[13,16.1]],[[12,32.2],[14,38.5],[15,38.5],[13,32.2],[12,32.2]],[[16,47.6],[12,53.2],[13,53.2],[18,47.6],[16,47.6]],[[6,64.4],[8,70],[9,70],[8,64.4],[6,64.4]],[[23,82.6],[29,79.8],[30,79.8],[25,82.6],[23,82.6]],[[37,70.7],[43,62.3],[44,62.3],[39,70.7],[37,70.7]],[[48,51.1],[51,45.5],[53,45.5],[50,51.1],[48,51.1]],[[51,35],[51,28.7],[53,28.7],[53,35],[51,35]],[[52,22.4],[55,17.5],[56,17.5],[53,22.4],[52,22.4]],[[58,12.6],[62,7],[63,7],[60,12.6],[58,12.6]],[[0,3.5],[0,93.1],[64,93.1],[64,0],[63,0],[63,92.4],[1,92.4],[1,3.5],[0,3.5]]],cm=0;cm<um.length;cm++){for(var dm=0;dm<um[cm].length;dm++){um[cm][dm][0]/=10.5,um[cm][dm][1]/=-14,um[cm][dm][0]+=hm[0],um[cm][dm][1]+=hm[1];}}var fm={"鍗楁捣璇稿矝":[32,80],"骞夸笢":[0,-10],"棣欐腐":[10,5],"婢抽棬":[-10,10],"澶╂触":[5,5]},pm={Russia:[100,60],"United States":[-99,38],"United States of America":[-99,38]},gm=[[[123.45165252685547,25.73527164402261],[123.49731445312499,25.73527164402261],[123.49731445312499,25.750734064600884],[123.45165252685547,25.750734064600884],[123.45165252685547,25.73527164402261]]],mm=[function(t){"china"===t.map&&t.regions.push(new Ef("鍗楁捣璇稿矝",P(um,function(t){return{type:"polygon",exterior:t};}),hm));},function(t){z(t.regions,function(t){var e=fm[t.name];if(e){var i=t.center;i[0]+=e[0]/10.5,i[1]+=-e[1]/14;}});},function(t){z(t.regions,function(t){var e=pm[t.name];if(e){var i=t.center;i[0]=e[0],i[1]=e[1];}});},function(t){if("china"===t.map)for(var e=0,i=t.regions.length;e<i;++e){"鍙版咕"===t.regions[e].name&&t.regions[e].geometries.push({type:"polygon",exterior:gm[0]});}}];function vm(t,e,i,n,a){sm.call(this,t),this.map=e,this._nameCoordMap=J(),this.loadGeoJson(i,n,a);}function ym(t,e,i,n){var a=i.geoModel,o=i.seriesModel,r=a?a.coordinateSystem:o?o.coordinateSystem||(o.getReferringComponents("geo")[0]||{}).coordinateSystem:null;return r===this?r[t](n):null;}function xm(t,e){var i=t.get("boundingCoords");if(null!=i){var n=i[0],a=i[1];isNaN(n[0])||isNaN(n[1])||isNaN(a[0])||isNaN(a[1])||this.setBoundingRect(n[0],n[1],a[0]-n[0],a[1]-n[1]);}var o,r=this.getBoundingRect(),s=t.get("layoutCenter"),l=t.get("layoutSize"),h=e.getWidth(),u=e.getHeight(),c=t.get("aspectScale")||.75,d=r.width/r.height*c,f=!1;if(s&&l&&(s=[Es(s[0],h),Es(s[1],u)],l=Es(l,Math.min(h,u)),isNaN(s[0])||isNaN(s[1])||isNaN(l)||(f=!0)),f){var p={};1<d?(p.width=l,p.height=l/d):(p.height=l,p.width=l*d),p.y=s[1]-p.height/2,p.x=s[0]-p.width/2;}else(o=t.getBoxLayoutParams()).aspect=d,p=wl(o,{width:h,height:u});this.setViewRect(p.x,p.y,p.width,p.height),this.setCenter(t.get("center")),this.setZoom(t.get("zoom"));}function _m(i,t){z(t.get("geoCoord"),function(t,e){i.addGeoCoord(e,t);});}vm.prototype={constructor:vm,type:"geo",dimensions:["lng","lat"],containCoord:function containCoord(t){for(var e=this.regions,i=0;i<e.length;i++){if(e[i].contain(t))return!0;}return!1;},loadGeoJson:function loadGeoJson(t,e,i){try{this.regions=t?zf(t):[];}catch(t){throw"Invalid geoJson format\n"+t.message;}e=e||{},i=i||{};for(var n=this.regions,a=J(),o=0;o<n.length;o++){var r=n[o].name;r=i.hasOwnProperty(r)?i[r]:r,n[o].name=r,a.set(r,n[o]),this.addGeoCoord(r,n[o].center);var s=e[r];s&&n[o].transformTo(s.left,s.top,s.width,s.height);}this._regionsMap=a,this._rect=null,z(mm,function(t){t(this);},this);},transformTo:function transformTo(t,e,i,n){var a=this.getBoundingRect();(a=a.clone()).y=-a.y-a.height;var o=this._rawTransformable;o.transform=a.calculateTransform(new ei(t,e,i,n)),o.decomposeTransform();var r=o.scale;r[1]=-r[1],o.updateTransform(),this._updateTransform();},getRegion:function getRegion(t){return this._regionsMap.get(t);},getRegionByCoord:function getRegionByCoord(t){for(var e=this.regions,i=0;i<e.length;i++){if(e[i].contain(t))return e[i];}},addGeoCoord:function addGeoCoord(t,e){this._nameCoordMap.set(t,e);},getGeoCoord:function getGeoCoord(t){return this._nameCoordMap.get(t);},getBoundingRect:function getBoundingRect(){if(this._rect)return this._rect;for(var t,e=this.regions,i=0;i<e.length;i++){var n=e[i].getBoundingRect();(t=t||n.clone()).union(n);}return this._rect=t||new ei(0,0,0,0);},dataToPoint:function dataToPoint(t,e,i){if("string"==typeof t&&(t=this.getGeoCoord(t)),t)return sm.prototype.dataToPoint.call(this,t,e,i);},convertToPixel:N(ym,"dataToPoint"),convertFromPixel:N(ym,"pointToData")},w(vm,sm);var wm={dimensions:vm.prototype.dimensions,create:function create(t,o){var r=[];t.eachComponent("geo",function(t,e){var i=t.get("map"),n=Qc(i),a=new vm(i+e,i,n&&n.geoJson,n&&n.specialAreas,t.get("nameMap"));a.zoomLimit=t.get("scaleLimit"),r.push(a),_m(a,t),(t.coordinateSystem=a).model=t,a.resize=xm,a.resize(t,o);}),t.eachSeries(function(t){if("geo"===t.get("coordinateSystem")){var e=t.get("geoIndex")||0;t.coordinateSystem=r[e];}});var i={};return t.eachSeriesByType("map",function(t){if(!t.getHostGeoModel()){var e=t.getMapType();i[e]=i[e]||[],i[e].push(t);}}),z(i,function(t,e){var i=Qc(e),n=P(t,function(t){return t.get("nameMap");}),a=new vm(e,e,i&&i.geoJson,i&&i.specialAreas,p(n));a.zoomLimit=W.apply(null,P(t,function(t){return t.get("scaleLimit");})),r.push(a),a.resize=xm,a.resize(t[0],o),z(t,function(t){_m(t.coordinateSystem=a,t);});}),r;},getFilledRegions:function getFilledRegions(t,e,i){var n=(t||[]).slice();i=i||{};var a=Qc(e),o=a&&a.geoJson;if(!o)return t;for(var r=J(),s=o.features,l=0;l<n.length;l++){r.set(n[l].name,n[l]);}for(l=0;l<s.length;l++){var h=s[l].properties.name;r.get(h)||(i.hasOwnProperty(h)&&(h=i[h]),n.push({name:h}));}return n;}};Zc("geo",wm);var bm=Xh.extend({type:"series.map",dependencies:["geo"],layoutMode:"box",needsDrawMap:!1,seriesGroup:[],init:function init(t){bm.superApply(this,"init",arguments),this.updateSelectedMap(this._createSelectableList());},getInitialData:function getInitialData(t){return Rg(this,["value"]);},mergeOption:function mergeOption(t){bm.superApply(this,"mergeOption",arguments),this.updateSelectedMap(this._createSelectableList());},_createSelectableList:function _createSelectableList(){for(var t=this.getRawData(),e=t.mapDimension("value"),i=[],n=0,a=t.count();n<a;n++){i.push({name:t.getName(n),value:t.get(e,n),selected:Gh(t,n,"selected")});}return i=wm.getFilledRegions(i,this.getMapType(),this.option.nameMap);},getHostGeoModel:function getHostGeoModel(){var t=this.option.geoIndex;return null!=t?this.dependentModels.geo[t]:null;},getMapType:function getMapType(){return(this.getHostGeoModel()||this).option.map;},_fillOption:function _fillOption(t,e){},getRawValue:function getRawValue(t){var e=this.getData();return e.get(e.mapDimension("value"),t);},getRegionModel:function getRegionModel(t){var e=this.getData();return e.getItemModel(e.indexOfName(t));},formatTooltip:function formatTooltip(t){for(var e=this.getData(),i=Qs(this.getRawValue(t)),n=e.getName(t),a=this.seriesGroup,o=[],r=0;r<a.length;r++){var s=a[r].originalData.indexOfName(n),l=e.mapDimension("value");isNaN(a[r].originalData.get(l,s))||o.push(al(a[r].name));}return o.join(", ")+"<br />"+al(n+" : "+i);},getTooltipPosition:function getTooltipPosition(t){if(null!=t){var e=this.getData().getName(t),i=this.coordinateSystem,n=i.getRegion(e);return n&&i.dataToPoint(n.center);}},setZoom:function setZoom(t){this.option.zoom=t;},setCenter:function setCenter(t){this.option.center=t;},defaultOption:{zlevel:0,z:2,coordinateSystem:"geo",map:"",left:"center",top:"center",aspectScale:.75,showLegendSymbol:!0,dataRangeHoverLink:!0,boundingCoords:null,center:null,zoom:1,scaleLimit:null,label:{show:!1,color:"#000"},itemStyle:{borderWidth:.5,borderColor:"#444",areaColor:"#eee"},emphasis:{label:{show:!0,color:"rgb(100,0,0)"},itemStyle:{areaColor:"rgba(255,215,0,0.8)"}}}});w(bm,zg);var Sm="\0_ec_interaction_mutex";function Mm(t,e){return!!Im(t)[e];}function Im(t){return t[Sm]||(t[Sm]={});}function Tm(i){this.pointerChecker,this._zr=i,this._opt={};var t=S,n=t(Dm,this),a=t(Am,this),o=t(Cm,this),r=t(Lm,this),s=t(km,this);At.call(this),this.setPointerChecker=function(t){this.pointerChecker=t;},this.enable=function(t,e){this.disable(),this._opt=C(A(e)||{},{zoomOnMouseWheel:!0,moveOnMouseMove:!0,preventDefaultMouseMove:!0}),null==t&&(t=!0),!0!==t&&"move"!==t&&"pan"!==t||(i.on("mousedown",n),i.on("mousemove",a),i.on("mouseup",o)),!0!==t&&"scale"!==t&&"zoom"!==t||(i.on("mousewheel",r),i.on("pinch",s));},this.disable=function(){i.off("mousedown",n),i.off("mousemove",a),i.off("mouseup",o),i.off("mousewheel",r),i.off("pinch",s);},this.dispose=this.disable,this.isDragging=function(){return this._dragging;},this.isPinching=function(){return this._pinching;};}function Dm(t){if(!(Nn(t)||t.target&&t.target.draggable)){var e=t.offsetX,i=t.offsetY;this.pointerChecker&&this.pointerChecker(t,e,i)&&(this._x=e,this._y=i,this._dragging=!0);}}function Am(t){if(!Nn(t)&&Nm(this,"moveOnMouseMove",t)&&this._dragging&&"pinch"!==t.gestureEvent&&!Mm(this._zr,"globalPan")){var e=t.offsetX,i=t.offsetY,n=this._x,a=this._y,o=e-n,r=i-a;this._x=e,this._y=i,this._opt.preventDefaultMouseMove&&Pn(t.event),this.trigger("pan",o,r,n,a,e,i);}}function Cm(t){Nn(t)||(this._dragging=!1);}function Lm(t){if(Nm(this,"zoomOnMouseWheel",t)&&0!==t.wheelDelta){var e=0<t.wheelDelta?1.1:1/1.1;Pm.call(this,t,e,t.offsetX,t.offsetY);}}function km(t){if(!Mm(this._zr,"globalPan")){var e=1<t.pinchScale?1.1:1/1.1;Pm.call(this,t,e,t.pinchX,t.pinchY);}}function Pm(t,e,i,n){this.pointerChecker&&this.pointerChecker(t,i,n)&&(Pn(t.event),this.trigger("zoom",e,i,n));}function Nm(t,e,i){var n=t._opt[e];return n&&(!D(n)||i.event[n+"Key"]);}function Om(t,e,i){var n=t.target,a=n.position;a[0]+=e,a[1]+=i,n.dirty();}function Em(t,e,i,n){var a=t.target,o=t.zoomLimit,r=a.position,s=a.scale,l=t.zoom=t.zoom||1;if(l*=e,o){var h=o.min||0,u=o.max||1/0;l=Math.max(Math.min(u,l),h);}var c=l/t.zoom;t.zoom=l,r[0]-=(i-r[0])*(c-1),r[1]-=(n-r[1])*(c-1),s[0]*=c,s[1]*=c,a.dirty();}Hc({type:"takeGlobalCursor",event:"globalCursorTaken",update:"update"},function(){}),w(Tm,At);var Rm={axisPointer:1,tooltip:1,brush:1};function zm(t,e,i){var n=e.getComponentByElement(t.topTarget),a=n&&n.coordinateSystem;return n&&n!==i&&!Rm[n.mainType]&&a&&a.model!==i;}function Bm(t,e){var i=t.getItemStyle(),n=t.get("areaColor");return null!=n&&(i.fill=n),i;}function Vm(i,t){t.eachChild(function(e){z(e.__regions,function(t){e.trigger(i.isSelected(t.name)?"emphasis":"normal");});});}function Gm(t,e){var i=new ii();this._controller=new Tm(t.getZr()),this._controllerHost={target:e?i:null},this.group=i,this._updateGroup=e,this._mouseDownFlag;}function Wm(t,e,i){var n=t.getZoom(),a=t.getCenter(),o=e.zoom,r=t.dataToPoint(a);if(null!=e.dx&&null!=e.dy){r[0]-=e.dx,r[1]-=e.dy;a=t.pointToData(r);t.setCenter(a);}if(null!=o){if(i){var s=i.min||0,l=i.max||1/0;o=Math.max(Math.min(n*o,l),s)/n;}t.scale[0]*=o,t.scale[1]*=o;var h=t.position,u=(e.originX-h[0])*(o-1),c=(e.originY-h[1])*(o-1);h[0]-=u,h[1]-=c,t.updateTransform();a=t.pointToData(r);t.setCenter(a),t.setZoom(o*n);}return{center:t.getCenter(),zoom:t.getZoom()};}Gm.prototype={constructor:Gm,draw:function draw(x,t,e,i,n){var _="geo"===x.mainType,w=x.getData&&x.getData();_&&t.eachComponent({mainType:"series",subType:"map"},function(t){w||t.getHostGeoModel()!==x||(w=t.getData());});var a=x.coordinateSystem,b=this.group,S=a.scale,o={position:a.position,scale:S};!b.childAt(0)||n?b.attr(o):fs(b,o,x),b.removeAll();var r,s,l,h,u,M=["itemStyle"],I=["emphasis","itemStyle"],T=["label"],D=["emphasis","label"],A=J();z(a.regions,function(t){var e=A.get(t.name)||A.set(t.name,new ii()),i=new Dr({shape:{paths:[]}});e.add(i);var n,a=(y=x.getRegionModel(t.name)||x).getModel(M),o=y.getModel(I),r=Bm(a),s=Bm(o),l=y.getModel(T),h=y.getModel(D);if(w){n=w.indexOfName(t.name);var u=w.getItemVisual(n,"color",!0);u&&(r.fill=u);}z(t.geometries,function(t){if("polygon"===t.type){i.shape.paths.push(new xr({shape:{points:t.exterior}}));for(var e=0;e<(t.interiors?t.interiors.length:0);e++){i.shape.paths.push(new xr({shape:{points:t.interiors[e]}}));}}}),i.setStyle(r),i.style.strokeNoScale=!0,i.culling=!0;var c=l.get("show"),d=h.get("show"),f=w&&isNaN(w.get(w.mapDimension("value"),n)),p=w&&w.getItemLayout(n);if(_||f&&(c||d)||p&&p.showLabel){var g,m=_?t.name:n;(!w||0<=n)&&(g=x);var v=new hr({position:t.center.slice(),scale:[1/S[0],1/S[1]],z2:10,silent:!0});os(v.style,v.hoverStyle={},l,h,{labelFetcher:g,labelDataIndex:m,defaultText:t.name,useInsideStyle:!1},{textAlign:"center",textVerticalAlign:"middle"}),e.add(v);}if(w)w.setItemGraphicEl(n,e);else{var y=x.getRegionModel(t.name);i.eventData={componentType:"geo",geoIndex:x.componentIndex,name:t.name,region:y&&y.option||{}};}(e.__regions||(e.__regions=[])).push(t),as(e,s,{hoverSilentOnTouch:!!x.get("selectedMode")}),b.add(e);}),this._updateController(x,t,e),r=this,s=x,h=e,u=i,(l=b).off("click"),l.off("mousedown"),s.get("selectedMode")&&(l.on("mousedown",function(){r._mouseDownFlag=!0;}),l.on("click",function(t){if(r._mouseDownFlag){r._mouseDownFlag=!1;for(var e=t.target;!e.__regions;){e=e.parent;}if(e){var i={type:("geo"===s.mainType?"geo":"map")+"ToggleSelect",batch:P(e.__regions,function(t){return{name:t.name,from:u.uid};})};i[s.mainType+"Id"]=s.id,h.dispatchAction(i),Vm(s,l);}}})),Vm(x,b);},remove:function remove(){this.group.removeAll(),this._controller.dispose(),this._controllerHost={};},_updateController:function _updateController(n,t,o){var a=n.coordinateSystem,e=this._controller,r=this._controllerHost;r.zoomLimit=n.get("scaleLimit"),r.zoom=a.getZoom(),e.enable(n.get("roam")||!1);var i=n.mainType;function s(){var t={type:"geoRoam",componentType:i};return t[i+"Id"]=n.id,t;}e.off("pan").on("pan",function(t,e){this._mouseDownFlag=!1,Om(r,t,e),o.dispatchAction(k(s(),{dx:t,dy:e}));},this),e.off("zoom").on("zoom",function(t,e,i){if(this._mouseDownFlag=!1,Em(r,t,e,i),o.dispatchAction(k(s(),{zoom:t,originX:e,originY:i})),this._updateGroup){var n=this.group,a=n.scale;n.traverse(function(t){"text"===t.type&&t.attr("scale",[1/a[0],1/a[1]]);});}},this),e.setPointerChecker(function(t,e,i){return a.getViewRectAfterRoam().contain(e,i)&&!zm(t,o,n);});}},Jc({type:"map",render:function render(t,e,i,n){if(!n||"mapToggleSelect"!==n.type||n.from!==this.uid){var a=this.group;if(a.removeAll(),!t.getHostGeoModel()){if(n&&"geoRoam"===n.type&&"series"===n.componentType&&n.seriesId===t.id)(o=this._mapDraw)&&a.add(o.group);else if(t.needsDrawMap){var o=this._mapDraw||new Gm(i,!0);a.add(o.group),o.draw(t,e,i,this,n),this._mapDraw=o;}else this._mapDraw&&this._mapDraw.remove(),this._mapDraw=null;t.get("showLegendSymbol")&&e.getComponent("legend")&&this._renderSymbols(t,e,i);}}},remove:function remove(){this._mapDraw&&this._mapDraw.remove(),this._mapDraw=null,this.group.removeAll();},dispose:function dispose(){this._mapDraw&&this._mapDraw.remove(),this._mapDraw=null;},_renderSymbols:function _renderSymbols(v,t,e){var y=v.originalData,x=this.group;y.each(y.mapDimension("value"),function(t,e){if(!isNaN(t)){var i=y.getItemLayout(e);if(i&&i.point){var n=i.point,a=i.offset,o=new ur({style:{fill:v.getData().getVisual("color")},shape:{cx:n[0]+9*a,cy:n[1],r:3},silent:!0,z2:a?8:10});if(!a){var r=v.mainSeries.getData(),s=y.getName(e),l=r.indexOfName(s),h=y.getItemModel(e),u=h.getModel("label"),c=h.getModel("emphasis.label"),d=r.getItemGraphicEl(l),f=F(v.getFormattedLabel(e,"normal"),s),p=F(v.getFormattedLabel(e,"emphasis"),f),g=function g(){var t=rs({},c,{text:c.get("show")?p:null},{isRectText:!0,useInsideStyle:!1},!0);o.style.extendFrom(t),o.__mapOriginalZ2=o.z2,o.z2+=1;},m=function m(){rs(o.style,u,{text:u.get("show")?f:null,textPosition:u.getShallow("position")||"bottom"},{isRectText:!0,useInsideStyle:!1}),null!=o.__mapOriginalZ2&&(o.z2=o.__mapOriginalZ2,o.__mapOriginalZ2=null);};d.on("mouseover",g).on("mouseout",m).on("emphasis",g).on("normal",m),m();}x.add(o);}}});}}),Hc({type:"geoRoam",event:"geoRoam",update:"updateTransform"},function(n,t){var a=n.componentType||"series";t.eachComponent({mainType:a,query:n},function(t){var e=t.coordinateSystem;if("geo"===e.type){var i=Wm(e,n,t.get("scaleLimit"));t.setCenter&&t.setCenter(i.center),t.setZoom&&t.setZoom(i.zoom),"series"===a&&z(t.seriesGroup,function(t){t.setCenter(i.center),t.setZoom(i.zoom);});}});});Uc(function(i){var a={};i.eachSeriesByType("map",function(t){var e=t.getMapType();if(!t.getHostGeoModel()&&!a[e]){var l={};z(t.seriesGroup,function(t){var r=t.coordinateSystem,s=t.originalData;t.get("showLegendSymbol")&&i.getComponent("legend")&&s.each(s.mapDimension("value"),function(t,e){var i=s.getName(e),n=r.getRegion(i);if(n&&!isNaN(t)){var a=l[i]||0,o=r.dataToPoint(n.center);l[i]=a+1,s.setItemLayout(e,{point:o,offset:a});}});});var n=t.getData();n.each(function(t){var e=n.getName(t),i=n.getItemLayout(t)||{};i.showLabel=!l[e],n.setItemLayout(t,i);}),a[e]=!0;}});}),jc(function(t){t.eachSeriesByType("map",function(t){var e=t.get("color"),i=t.getModel("itemStyle"),n=i.get("areaColor"),a=i.get("color")||e[t.seriesIndex%e.length];t.getData().setVisual({areaColor:n,color:a});});}),Fc(tc.PROCESSOR.STATISTIC,function(t){var n={};t.eachSeriesByType("map",function(t){var e=t.getHostGeoModel(),i=e?"o"+e.id:"i"+t.getMapType();(n[i]=n[i]||[]).push(t);}),z(n,function(t,e){for(var h,u,c,i=(h=P(t,function(t){return t.getData();}),u=t[0].get("mapValueCalculation"),c={},z(h,function(n){n.each(n.mapDimension("value"),function(t,e){var i="ec-"+n.getName(e);c[i]=c[i]||[],isNaN(t)||c[i].push(t);});}),h[0].map(h[0].mapDimension("value"),function(t,e){for(var i,n="ec-"+h[0].getName(e),a=0,o=1/0,r=-1/0,s=c[n].length,l=0;l<s;l++){o=Math.min(o,c[n][l]),r=Math.max(r,c[n][l]),a+=c[n][l];}return i="min"===u?o:"max"===u?r:"average"===u?a/s:a,0===s?NaN:i;})),n=0;n<t.length;n++){t[n].originalData=t[n].getData();}for(n=0;n<t.length;n++){(t[n].seriesGroup=t)[n].needsDrawMap=0===n&&!t[n].getHostGeoModel(),t[n].setData(i.cloneShallow()),t[n].mainSeries=t[0];}});}),Wc(function(t){var e=[];z(t.series,function(t){t&&"map"===t.type&&(e.push(t),t.map=t.map||t.mapType,C(t,t.mapLocation));});}),Hg("map",[{type:"mapToggleSelect",event:"mapselectchanged",method:"toggleSelected"},{type:"mapSelect",event:"mapselected",method:"select"},{type:"mapUnSelect",event:"mapunselected",method:"unSelect"}]);var Fm=z,Hm="\0__link_datas",Zm="\0__link_mainData";function Um(i){var n=i.mainData,t=i.datas;t||(t={main:n},i.datasAttr={main:"data"}),i.datas=i.mainData=null,Km(n,t,i),Fm(t,function(e){Fm(n.TRANSFERABLE_METHODS,function(t){e.wrapMethod(t,N(jm,i));});}),n.wrapMethod("cloneShallow",N(Ym,i)),Fm(n.CHANGABLE_METHODS,function(t){n.wrapMethod(t,N(Xm,i));}),j(t[n.dataType]===n);}function jm(t,e){if((n=this)[Zm]===n){var i=k({},this[Hm]);Km(i[this.dataType]=e,i,t);}else $m(e,this.dataType,this[Zm],t);var n;return e;}function Xm(t,e){return t.struct&&t.struct.update(this),e;}function Ym(i,n){return Fm(n[Hm],function(t,e){t!==n&&$m(t.cloneShallow(),e,n,i);}),n;}function qm(t){var e=this[Zm];return null==t||null==e?e:e[Hm][t];}function Km(i,t,n){i[Hm]={},Fm(t,function(t,e){$m(t,e,i,n);});}function $m(t,e,i,n){(i[Hm][e]=t)[Zm]=i,t.dataType=e,n.struct&&(t[n.structAttr]=n.struct,n.struct[n.datasAttr[e]]=t),t.getLinkedData=qm;}var Jm=function Jm(t,e){this.name=t||"",this.depth=0,this.height=0,this.parentNode=null,this.dataIndex=-1,this.children=[],this.viewChildren=[],this.hostTree=e;};function Qm(e,t,i){this.root,this.data,this._nodes=[],this.hostModel=e,this.levelModels=P(t||[],function(t){return new As(t,e,e.ecModel);}),this.leavesModel=new As(i||{},e,e.ecModel);}function tv(t,e){var i=t.isExpand?t.children:[],n=t.parentNode.children,a=t.hierNode.i?n[t.hierNode.i-1]:null;if(i.length){!function(t){var e=t.children,i=e.length,n=0,a=0;for(;0<=--i;){var o=e[i];o.hierNode.prelim+=n,o.hierNode.modifier+=n,a+=o.hierNode.change,n+=o.hierNode.shift+a;}}(t);var o=(i[0].hierNode.prelim+i[i.length-1].hierNode.prelim)/2;a?(t.hierNode.prelim=a.hierNode.prelim+e(t,a),t.hierNode.modifier=t.hierNode.prelim-o):t.hierNode.prelim=o;}else a&&(t.hierNode.prelim=a.hierNode.prelim+e(t,a));t.parentNode.hierNode.defaultAncestor=function(t,e,i,n){if(e){for(var a=t,o=t,r=o.parentNode.children[0],s=e,l=a.hierNode.modifier,h=o.hierNode.modifier,u=r.hierNode.modifier,c=s.hierNode.modifier;s=av(s),o=ov(o),s&&o;){a=av(a),r=ov(r),a.hierNode.ancestor=t;var d=s.hierNode.prelim+c-o.hierNode.prelim-h+n(s,o);0<d&&(rv((p=t,g=i,(f=s).hierNode.ancestor.parentNode===p.parentNode?f.hierNode.ancestor:g),t,d),h+=d,l+=d),c+=s.hierNode.modifier,h+=o.hierNode.modifier,l+=a.hierNode.modifier,u+=r.hierNode.modifier;}s&&!av(a)&&(a.hierNode.thread=s,a.hierNode.modifier+=c-l),o&&!ov(r)&&(r.hierNode.thread=o,r.hierNode.modifier+=h-u,i=t);}var f,p,g;return i;}(t,a,t.parentNode.hierNode.defaultAncestor||n[0],e);}function ev(t){var e=t.hierNode.prelim+t.parentNode.hierNode.modifier;t.setLayout({x:e},!0),t.hierNode.modifier+=t.parentNode.hierNode.modifier;}function iv(t){return arguments.length?t:sv;}function nv(t,e){var i={};return t-=Math.PI/2,i.x=e*Math.cos(t),i.y=e*Math.sin(t),i;}function av(t){var e=t.children;return e.length&&t.isExpand?e[e.length-1]:t.hierNode.thread;}function ov(t){var e=t.children;return e.length&&t.isExpand?e[0]:t.hierNode.thread;}function rv(t,e,i){var n=i/(e.hierNode.i-t.hierNode.i);e.hierNode.change-=n,e.hierNode.shift+=i,e.hierNode.modifier+=i,e.hierNode.prelim+=i,t.hierNode.change+=n;}function sv(t,e){return t.parentNode===e.parentNode?1:2;}function lv(t,e){var i=t.getItemLayout(e);return i&&!isNaN(i.x)&&!isNaN(i.y)&&"none"!==t.getItemVisual(e,"symbol");}function hv(t,e,i){return i.itemModel=e,i.itemStyle=e.getModel("itemStyle").getItemStyle(),i.hoverItemStyle=e.getModel("emphasis.itemStyle").getItemStyle(),i.lineStyle=e.getModel("lineStyle").getLineStyle(),i.labelModel=e.getModel("label"),i.hoverLabelModel=e.getModel("emphasis.label"),!1===t.isExpand&&0!==t.children.length?i.symbolInnerColor=i.itemStyle.fill:i.symbolInnerColor="#fff",i;}function uv(t,e,i,n,a,o){var r=!i,s=t.tree.getNodeByDataIndex(e),l=(o=hv(s,s.getModel(),o),t.tree.root),h=s.parentNode===l?s:s.parentNode||s,u=t.getItemGraphicEl(h.dataIndex),c=h.getLayout(),d=u?{x:u.position[0],y:u.position[1],rawX:u.__radialOldRawX,rawY:u.__radialOldRawY}:c,f=s.getLayout();r?(i=new jf(t,e,o)).attr("position",[d.x,d.y]):i.updateData(t,e,o),i.__radialOldRawX=i.__radialRawX,i.__radialOldRawY=i.__radialRawY,i.__radialRawX=f.rawX,i.__radialRawY=f.rawY,n.add(i),t.setItemGraphicEl(e,i),fs(i,{position:[f.x,f.y]},a);var p=i.getSymbolPath();if("radial"===o.layout){var g,m,v=l.children[0],y=v.getLayout(),x=v.children.length;if(f.x===y.x&&!0===s.isExpand){var _={};_.x=(v.children[0].getLayout().x+v.children[x-1].getLayout().x)/2,_.y=(v.children[0].getLayout().y+v.children[x-1].getLayout().y)/2,(g=Math.atan2(_.y-y.y,_.x-y.x))<0&&(g=2*Math.PI+g),(m=_.x<y.x)&&(g-=Math.PI);}else(g=Math.atan2(f.y-y.y,f.x-y.x))<0&&(g=2*Math.PI+g),0===s.children.length||0!==s.children.length&&!1===s.isExpand?(m=f.x<y.x)&&(g-=Math.PI):(m=f.x>y.x)||(g-=Math.PI);var w=m?"left":"right";p.setStyle({textPosition:w,textRotation:-g,textOrigin:"center",verticalAlign:"middle"});}if(s.parentNode&&s.parentNode!==l){var b=i.__edge;b||(b=i.__edge=new Ir({shape:dv(o,d,d),style:C({opacity:0},o.lineStyle)})),fs(b,{shape:dv(o,c,f),style:{opacity:1}},a),n.add(b);}}function cv(t,e,i,n,a,o){for(var r,s=t.tree.getNodeByDataIndex(e),l=t.tree.root,h=(o=hv(s,s.getModel(),o),s.parentNode===l?s:s.parentNode||s);null==(r=h.getLayout());){h=h.parentNode===l?h:h.parentNode||h;}fs(i,{position:[r.x+1,r.y+1]},a,function(){n.remove(i),t.setItemGraphicEl(e,null);}),i.fadeOut(null,{keepLabel:!0});var u=i.__edge;u&&fs(u,{shape:dv(o,r,r),style:{opacity:0}},a,function(){n.remove(u);});}function dv(t,e,i){var n,a,o,r,s=t.orient;if("radial"===t.layout){var l=e.rawX,h=e.rawY,u=i.rawX,c=i.rawY,d=nv(l,h),f=nv(l,h+(c-h)*t.curvature),p=nv(u,c+(h-c)*t.curvature),g=nv(u,c);return{x1:d.x,y1:d.y,x2:g.x,y2:g.y,cpx1:f.x,cpy1:f.y,cpx2:p.x,cpy2:p.y};}l=e.x,h=e.y,u=i.x,c=i.y;return"LR"!==s&&"RL"!==s||(n=l+(u-l)*t.curvature,a=h,o=u+(l-u)*t.curvature,r=c),"TB"!==s&&"BT"!==s||(n=l,a=h+(c-h)*t.curvature,o=u,r=c+(h-c)*t.curvature),{x1:l,y1:h,x2:u,y2:c,cpx1:n,cpy1:a,cpx2:o,cpy2:r};}function fv(t,e){for(var i,n=[t];i=n.pop();){if(e(i),i.isExpand){var a=i.children;if(a.length)for(var o=a.length-1;0<=o;o--){n.push(a[o]);}}}}Jm.prototype={constructor:Jm,isRemoved:function isRemoved(){return this.dataIndex<0;},eachNode:function eachNode(t,e,i){"function"==typeof t&&(i=e,e=t,t=null),D(t=t||{})&&(t={order:t});var n,a=t.order||"preorder",o=this[t.attr||"children"];"preorder"===a&&(n=e.call(i,this));for(var r=0;!n&&r<o.length;r++){o[r].eachNode(t,e,i);}"postorder"===a&&e.call(i,this);},updateDepthAndHeight:function updateDepthAndHeight(t){var e=0;this.depth=t;for(var i=0;i<this.children.length;i++){var n=this.children[i];n.updateDepthAndHeight(t+1),n.height>e&&(e=n.height);}this.height=e+1;},getNodeById:function getNodeById(t){if(this.getId()===t)return this;for(var e=0,i=this.children,n=i.length;e<n;e++){var a=i[e].getNodeById(t);if(a)return a;}},contains:function contains(t){if(t===this)return!0;for(var e=0,i=this.children,n=i.length;e<n;e++){var a=i[e].contains(t);if(a)return a;}},getAncestors:function getAncestors(t){for(var e=[],i=t?this:this.parentNode;i;){e.push(i),i=i.parentNode;}return e.reverse(),e;},getValue:function getValue(t){var e=this.hostTree.data;return e.get(e.getDimension(t||"value"),this.dataIndex);},setLayout:function setLayout(t,e){0<=this.dataIndex&&this.hostTree.data.setItemLayout(this.dataIndex,t,e);},getLayout:function getLayout(){return this.hostTree.data.getItemLayout(this.dataIndex);},getModel:function getModel(t){if(!(this.dataIndex<0)){var e,i=this.hostTree,n=i.data.getItemModel(this.dataIndex),a=this.getLevelModel();return a||0!==this.children.length&&(0===this.children.length||!1!==this.isExpand)||(e=this.getLeavesModel()),n.getModel(t,(a||e||i.hostModel).getModel(t));}},getLevelModel:function getLevelModel(){return(this.hostTree.levelModels||[])[this.depth];},getLeavesModel:function getLeavesModel(){return this.hostTree.leavesModel;},setVisual:function setVisual(t,e){0<=this.dataIndex&&this.hostTree.data.setItemVisual(this.dataIndex,t,e);},getVisual:function getVisual(t,e){return this.hostTree.data.getItemVisual(this.dataIndex,t,e);},getRawIndex:function getRawIndex(){return this.hostTree.data.getRawIndex(this.dataIndex);},getId:function getId(){return this.hostTree.data.getId(this.dataIndex);},isAncestorOf:function isAncestorOf(t){for(var e=t.parentNode;e;){if(e===this)return!0;e=e.parentNode;}return!1;},isDescendantOf:function isDescendantOf(t){return t!==this&&t.isAncestorOf(this);}},Qm.prototype={constructor:Qm,type:"tree",eachNode:function eachNode(t,e,i){this.root.eachNode(t,e,i);},getNodeByDataIndex:function getNodeByDataIndex(t){var e=this.data.getRawIndex(t);return this._nodes[e];},getNodeByName:function getNodeByName(t){return this.root.getNodeByName(t);},update:function update(){for(var t=this.data,e=this._nodes,i=0,n=e.length;i<n;i++){e[i].dataIndex=-1;}for(i=0,n=t.count();i<n;i++){e[t.getRawIndex(i)].dataIndex=i;}},clearLayouts:function clearLayouts(){this.data.clearItemLayouts();}},Qm.createTree=function(t,e,i){var s=new Qm(e,i.levels,i.leaves),l=[],h=1;!function t(e,i){var n=e.value;h=Math.max(h,E(n)?n.length:1);l.push(e);var a=new Jm(e.name,s);i?function(t,e){var i=e.children;if(t.parentNode===e)return;i.push(t),t.parentNode=e;}(a,i):s.root=a;s._nodes.push(a);var o=e.children;if(o)for(var r=0;r<o.length;r++){t(o[r],a);}}(t),s.root.updateDepthAndHeight(0);var n=Dd(l,{coordDimensions:["value"],dimensionsCount:h}),a=new pd(n,e);return a.initData(l),Um({mainData:a,struct:s,structAttr:"tree"}),s.update(),s;},Xh.extend({type:"series.tree",layoutInfo:null,layoutMode:"box",getInitialData:function getInitialData(t){var e={name:t.name,children:t.data},i=t.leaves||{},n={};n.leaves=i;var a=Qm.createTree(e,this,n),o=0;a.eachNode("preorder",function(t){t.depth>o&&(o=t.depth);});var r=t.expandAndCollapse&&0<=t.initialTreeDepth?t.initialTreeDepth:o;return a.root.eachNode("preorder",function(t){var e=t.hostTree.data.getRawDataItem(t.dataIndex);t.isExpand=e&&null!=e.collapsed?!e.collapsed:t.depth<=r;}),a.data;},getOrient:function getOrient(){var t=this.get("orient");return"horizontal"===t?t="LR":"vertical"===t&&(t="TB"),t;},formatTooltip:function formatTooltip(t){for(var e=this.getData().tree,i=e.root.children[0],n=e.getNodeByDataIndex(t),a=n.getValue(),o=n.name;n&&n!==i;){o=n.parentNode.name+"."+o,n=n.parentNode;}return al(o+(isNaN(a)||null==a?"":" : "+a));},defaultOption:{zlevel:0,z:2,left:"12%",top:"12%",right:"12%",bottom:"12%",layout:"orthogonal",orient:"LR",symbol:"emptyCircle",symbolSize:7,expandAndCollapse:!0,initialTreeDepth:2,lineStyle:{color:"#ccc",width:1.5,curveness:.5},itemStyle:{color:"lightsteelblue",borderColor:"#c23531",borderWidth:1.5},label:{show:!0,color:"#555"},leaves:{label:{show:!0}},animationEasing:"linear",animationDuration:700,animationDurationUpdate:1e3}}),Jc({type:"tree",init:function init(t,e){this._oldTree,this._mainGroup=new ii(),this.group.add(this._mainGroup);},render:function render(n,t,i,e){var a=n.getData(),o=n.layoutInfo,r=this._mainGroup,s=n.get("layout");"radial"===s?r.attr("position",[o.x+o.width/2,o.y+o.height/2]):r.attr("position",[o.x,o.y]);var l=this._data,h={expandAndCollapse:n.get("expandAndCollapse"),layout:s,orient:n.getOrient(),curvature:n.get("lineStyle.curveness"),symbolRotate:n.get("symbolRotate"),symbolOffset:n.get("symbolOffset"),hoverAnimation:n.get("hoverAnimation"),useNameLabel:!0,fadeIn:!0};a.diff(l).add(function(t){lv(a,t)&&uv(a,t,null,r,n,h);}).update(function(t,e){var i=l.getItemGraphicEl(e);lv(a,t)?uv(a,t,i,r,n,h):i&&cv(a,t,i,r,n,h);}).remove(function(t){var e=l.getItemGraphicEl(t);cv(a,t,e,r,n,h);}).execute(),!0===h.expandAndCollapse&&a.eachItemGraphicEl(function(t,e){t.off("click").on("click",function(){i.dispatchAction({type:"treeExpandAndCollapse",seriesId:n.id,dataIndex:e});});}),this._data=a;},dispose:function dispose(){},remove:function remove(){this._mainGroup.removeAll(),this._data=null;}}),Hc({type:"treeExpandAndCollapse",event:"treeExpandAndCollapse",update:"update"},function(n,t){t.eachComponent({mainType:"series",subType:"tree",query:n},function(t){var e=n.dataIndex,i=t.getData().tree.getNodeByDataIndex(e);i.isExpand=!i.isExpand;});});var pv=function pv(t,e){var i,n=(i=e,wl(t.getBoxLayoutParams(),{width:i.getWidth(),height:i.getHeight()}));t.layoutInfo=n;var a=t.get("layout"),o=0,r=0,s=null;"radial"===a?(o=2*Math.PI,r=Math.min(n.height,n.width)/2,s=iv(function(t,e){return(t.parentNode===e.parentNode?1:2)/t.depth;})):(o=n.width,r=n.height,s=iv());var l=t.getData().tree.root,h=l.children[0];!function(t){t.hierNode={defaultAncestor:null,ancestor:t,prelim:0,modifier:0,change:0,shift:0,i:0,thread:null};for(var e,i,n=[t];e=n.pop();){if(i=e.children,e.isExpand&&i.length)for(var a=i.length-1;0<=a;a--){var o=i[a];o.hierNode={defaultAncestor:null,ancestor:o,prelim:0,modifier:0,change:0,shift:0,i:a,thread:null},n.push(o);}}}(l),function(t,e,i){for(var n,a=[t],o=[];n=a.pop();){if(o.push(n),n.isExpand){var r=n.children;if(r.length)for(var s=0;s<r.length;s++){a.push(r[s]);}}}for(;n=o.pop();){e(n,i);}}(h,tv,s),l.hierNode.modifier=-h.hierNode.prelim,fv(h,ev);var u=h,c=h,d=h;fv(h,function(t){var e=t.getLayout().x;e<u.getLayout().x&&(u=t),e>c.getLayout().x&&(c=t),t.depth>d.depth&&(d=t);});var f=u===c?1:s(u,c)/2,p=f-u.getLayout().x,g=0,m=0,v=0,y=0;if("radial"===a)g=o/(c.getLayout().x+f+p),m=r/(d.depth-1||1),fv(h,function(t){v=(t.getLayout().x+p)*g,y=(t.depth-1)*m;var e=nv(v,y);t.setLayout({x:e.x,y:e.y,rawX:v,rawY:y},!0);});else{var x=t.getOrient();"RL"===x||"LR"===x?(m=r/(c.getLayout().x+f+p),g=o/(d.depth-1||1),fv(h,function(t){y=(t.getLayout().x+p)*m,v="LR"===x?(t.depth-1)*g:o-(t.depth-1)*g,t.setLayout({x:v,y:y},!0);})):"TB"!==x&&"BT"!==x||(g=o/(c.getLayout().x+f+p),m=r/(d.depth-1||1),fv(h,function(t){v=(t.getLayout().x+p)*g,y="TB"===x?(t.depth-1)*m:r-(t.depth-1)*m,t.setLayout({x:v,y:y},!0);}));}};function gv(t,e,i){if(t&&0<=L(e,t.type)){var n=i.getData().tree.root,a=t.targetNode;if(a&&n.contains(a))return{node:a};var o=t.targetNodeId;if(null!=o&&(a=n.getNodeById(o)))return{node:a};}}function mv(t){for(var e=[];t;){(t=t.parentNode)&&e.push(t);}return e.reverse();}function vv(t,e){return 0<=L(mv(t),e);}function yv(t,e){for(var i=[];t;){var n=t.dataIndex;i.push({name:t.name,dataIndex:n,value:e.getRawValue(n)}),t=t.parentNode;}return i.reverse(),i;}jc(Tp("tree","circle")),Uc(function(t,e){t.eachSeriesByType("tree",function(t){pv(t,e);});}),Uc(function(t,e){t.eachSeriesByType("tree",function(t){pv(t,e);});}),Xh.extend({type:"series.treemap",layoutMode:"box",dependencies:["grid","polar"],_viewRoot:null,defaultOption:{progressive:0,hoverLayerThreshold:1/0,left:"center",top:"middle",right:null,bottom:null,width:"80%",height:"80%",sort:!0,clipWindow:"origin",squareRatio:.5*(1+Math.sqrt(5)),leafDepth:null,drillDownIcon:"鈻�",zoomToNodeRatio:.1024,roam:!0,nodeClick:"zoomToNode",animation:!0,animationDurationUpdate:900,animationEasing:"quinticInOut",breadcrumb:{show:!0,height:22,left:"center",top:"bottom",emptyItemWidth:25,itemStyle:{color:"rgba(0,0,0,0.7)",borderColor:"rgba(255,255,255,0.7)",borderWidth:1,shadowColor:"rgba(150,150,150,1)",shadowBlur:3,shadowOffsetX:0,shadowOffsetY:0,textStyle:{color:"#fff"}},emphasis:{textStyle:{}}},label:{show:!0,distance:0,padding:5,position:"inside",color:"#fff",ellipsis:!0},upperLabel:{show:!1,position:[0,"50%"],height:20,color:"#fff",ellipsis:!0,verticalAlign:"middle"},itemStyle:{color:null,colorAlpha:null,colorSaturation:null,borderWidth:0,gapWidth:0,borderColor:"#fff",borderColorSaturation:null},emphasis:{upperLabel:{show:!0,position:[0,"50%"],color:"#fff",ellipsis:!0,verticalAlign:"middle"}},visualDimension:0,visualMin:null,visualMax:null,color:[],colorAlpha:null,colorSaturation:null,colorMappingBy:"index",visibleMin:10,childrenVisibleMin:null,levels:[]},getInitialData:function getInitialData(t,e){var i={name:t.name,children:t.data};!function i(t){var n=0;z(t.children,function(t){i(t);var e=t.value;E(e)&&(e=e[0]),n+=e;});var e=t.value;E(e)&&(e=e[0]);(null==e||isNaN(e))&&(e=n);e<0&&(e=0);E(t.value)?t.value[0]=e:t.value=e;}(i);var n=t.levels||[];n=t.levels=function(t,e){var n,i=e.get("color");if(!i)return;if(z(t=t||[],function(t){var e=new As(t),i=e.get("color");(e.get("itemStyle.color")||i&&"none"!==i)&&(n=!0);}),!n){var a=t[0]||(t[0]={});a.color=i.slice();}return t;}(n,e);var a={};return a.levels=n,Qm.createTree(i,this,a).data;},optionUpdated:function optionUpdated(){this.resetViewRoot();},formatTooltip:function formatTooltip(t){var e=this.getData(),i=this.getRawValue(t),n=E(i)?Qs(i[0]):Qs(i);return al(e.getName(t)+": "+n);},getDataParams:function getDataParams(t){var e=Xh.prototype.getDataParams.apply(this,arguments),i=this.getData().tree.getNodeByDataIndex(t);return e.treePathInfo=yv(i,this),e;},setLayoutInfo:function setLayoutInfo(t){this.layoutInfo=this.layoutInfo||{},k(this.layoutInfo,t);},mapIdToIndex:function mapIdToIndex(t){var e=this._idIndexMap;e||(e=this._idIndexMap=J(),this._idIndexMapCount=0);var i=e.get(t);return null==i&&e.set(t,i=this._idIndexMapCount++),i;},getViewRoot:function getViewRoot(){return this._viewRoot;},resetViewRoot:function resetViewRoot(t){t?this._viewRoot=t:t=this._viewRoot;var e=this.getRawData().tree.root;t&&(t===e||e.contains(t))||(this._viewRoot=e);}});var xv=5;function _v(t){this.group=new ii(),t.add(this.group);}function wv(t,e,i,n,a,o){var r=[[a?t:t-xv,e],[t+i,e],[t+i,e+n],[a?t:t-xv,e+n]];return!o&&r.splice(2,0,[t+i+xv,e+n/2]),!a&&r.push([t,e+n/2]),r;}_v.prototype={constructor:_v,render:function render(t,e,i,n){var a=t.getModel("breadcrumb"),o=this.group;if(o.removeAll(),a.get("show")&&i){var r=a.getModel("itemStyle"),s=r.getModel("textStyle"),l={pos:{left:a.get("left"),right:a.get("right"),top:a.get("top"),bottom:a.get("bottom")},box:{width:e.getWidth(),height:e.getHeight()},emptyItemWidth:a.get("emptyItemWidth"),totalWidth:0,renderList:[]};this._prepare(i,l,s),this._renderContent(t,l,r,s,n),bl(o,l.pos,l.box);}},_prepare:function _prepare(t,e,i){for(var n=t;n;n=n.parentNode){var a=n.getModel().get("name"),o=i.getTextRect(a),r=Math.max(o.width+16,e.emptyItemWidth);e.totalWidth+=r+8,e.renderList.push({node:n,text:a,width:r});}},_renderContent:function _renderContent(t,e,i,n,a){for(var o,r,s,l,h,u,c,d,f,p,g,m=0,v=e.emptyItemWidth,y=t.get("breadcrumb.height"),x=(o=e.pos,r=e.box,l=r.width,h=r.height,u=Es(o.x,l),c=Es(o.y,h),d=Es(o.x2,l),f=Es(o.y2,h),(isNaN(u)||isNaN(parseFloat(o.x)))&&(u=0),(isNaN(d)||isNaN(parseFloat(o.x2)))&&(d=l),(isNaN(c)||isNaN(parseFloat(o.y)))&&(c=0),(isNaN(f)||isNaN(parseFloat(o.y2)))&&(f=h),s=el(s||0),{width:Math.max(d-u-s[1]-s[3],0),height:Math.max(f-c-s[0]-s[2],0)}),_=e.totalWidth,w=e.renderList,b=w.length-1;0<=b;b--){var S=w[b],M=S.node,I=S.width,T=S.text;x.width<_&&(_-=I-v,I=v,T=null);var D=new xr({shape:{points:wv(m,0,I,y,b===w.length-1,0===b)},style:C(i.getItemStyle(),{lineJoin:"bevel",text:T,textFill:n.getTextColor(),textFont:n.getFont()}),z:10,onclick:N(a,M)});this.group.add(D),p=t,g=M,D.eventData={componentType:"series",componentSubType:"treemap",seriesIndex:p.componentIndex,seriesName:p.name,seriesType:"treemap",selfType:"breadcrumb",nodeData:{dataIndex:g&&g.dataIndex,name:g&&g.name},treePathInfo:g&&yv(g,p)},m+=I+8;}},remove:function remove(){this.group.removeAll();}};var bv=S,Sv=ii,Mv=wr,Iv=z,Tv=["label"],Dv=["emphasis","label"],Av=["upperLabel"],Cv=["emphasis","upperLabel"],Lv=10,kv=1,Pv=2,Nv=Ca([["fill","color"],["stroke","strokeColor"],["lineWidth","strokeWidth"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"]]),Ov=function Ov(t){var e=Nv(t);return e.stroke=e.fill=e.lineWidth=null,e;};function Ev(d,c,f,p,g,i,m,t,e,n){if(m){var v=m.getLayout();if(v&&v.isInView){var s=v.width,l=v.height,h=v.borderWidth,y=v.invisible,x=m.getRawIndex(),_=t&&t.getRawIndex(),a=m.viewChildren,u=v.upperHeight,o=a&&a.length,w=m.getModel("itemStyle"),b=m.getModel("emphasis.itemStyle"),r=D("nodeGroup",Sv);if(r){if(e.add(r),r.attr("position",[v.x||0,v.y||0]),r.__tmNodeWidth=s,r.__tmNodeHeight=l,v.isAboveViewRoot)return r;var S=D("background",Mv,n,kv);if(S&&function(t,n,a){n.dataIndex=m.dataIndex,n.seriesIndex=d.seriesIndex,n.setShape({x:0,y:0,width:s,height:l});var o=m.getVisual("borderColor",!0),r=b.get("borderColor");I(n,function(){var t=Ov(w);t.fill=o;var e=Nv(b);if(e.fill=r,a){var i=s-2*h;T(t,e,o,i,u,{x:h,y:0,width:i,height:u});}else t.text=e.text=null;n.setStyle(t),as(n,e);}),t.add(n);}(r,S,o&&v.upperHeight),!o){var M=D("content",Mv,n,Pv);M&&function(t,i){i.dataIndex=m.dataIndex,i.seriesIndex=d.seriesIndex;var n=Math.max(s-2*h,0),a=Math.max(l-2*h,0);i.culling=!0,i.setShape({x:h,y:h,width:n,height:a});var o=m.getVisual("color",!0);I(i,function(){var t=Ov(w);t.fill=o;var e=Nv(b);T(t,e,o,n,a),i.setStyle(t),as(i,e);}),t.add(i);}(r,M);}return r;}}}function I(t,e){y?!t.invisible&&i.push(t):(e(),t.__tmWillVisible||(t.invisible=!1));}function T(t,e,i,n,a,o){var r=m.getModel(),s=W(d.getFormattedLabel(m.dataIndex,"normal",null,null,o?"upperLabel":"label"),r.get("name"));if(!o&&v.isLeafRoot){var l=d.get("drillDownIcon",!0);s=l?l+" "+s:s;}var h=r.getModel(o?Av:Tv),u=r.getModel(o?Cv:Dv),c=h.getShallow("show");os(t,e,h,u,{defaultText:c?s:null,autoColor:i,isRectText:!0}),o&&(t.textRect=A(o)),t.truncate=c&&h.get("ellipsis")?{outerWidth:n,outerHeight:a,minChar:2}:null;}function D(t,e,i,n){var a,o,r,s,l,h=null!=_&&f[t][_],u=g[t];return h?(f[t][_]=null,s=h,l=t,(u[x]={}).old="nodeGroup"===l?s.position.slice():k({},s.shape)):y||((h=new e({z:(a=i,o=n,r=a*Lv+o,(r-1)/r)})).__tmDepth=i,function(t,e,i){var n=t[x]={},a=m.parentNode;if(a&&(!p||"drillDown"===p.direction)){var o=0,r=0,s=g.background[a.getRawIndex()];!p&&s&&s.old&&(o=s.old.width,r=s.old.height),n.old="nodeGroup"===i?[0,r]:{x:o,y:r,width:0,height:0};}n.fadein="nodeGroup"!==i;}(u,0,h.__tmStorageName=t)),c[t][x]=h;}}Jc({type:"treemap",init:function init(t,e){this._containerGroup,this._storage={nodeGroup:[],background:[],content:[]},this._oldTree,this._breadcrumb,this._controller,this._state="ready";},render:function render(t,e,i,n){if(!(L(e.findComponents({mainType:"series",subType:"treemap",query:n}),t)<0)){this.seriesModel=t,this.api=i,this.ecModel=e;var a=gv(n,["treemapZoomToNode","treemapRootToNode"],t),o=n&&n.type,r=t.layoutInfo,s=!this._oldTree,l=this._storage,h="treemapRootToNode"===o&&a&&l?{rootNodeGroup:l.nodeGroup[a.node.getRawIndex()],direction:n.direction}:null,u=this._giveContainerGroup(r),c=this._doRender(u,t,h);s||o&&"treemapZoomToNode"!==o&&"treemapRootToNode"!==o?c.renderFinally():this._doAnimation(u,c,t,h),this._resetController(i),this._renderBreadcrumb(t,i,a);}},_giveContainerGroup:function _giveContainerGroup(t){var e=this._containerGroup;return e||(e=this._containerGroup=new Sv(),this._initEvents(e),this.group.add(e)),e.attr("position",[t.x,t.y]),e;},_doRender:function _doRender(t,e,i){var n=e.getData().tree,a=this._oldTree,o={nodeGroup:[],background:[],content:[]},r={nodeGroup:[],background:[],content:[]},s=this._storage,l=[],c=N(Ev,e,r,s,i,o,l);!function o(r,s,l,h,u){h?Iv(s=r,function(t,e){!t.isRemoved()&&i(e,e);}):new ed(s,r,t,t).add(i).update(i).remove(N(i,null)).execute();function t(t){return t.getId();}function i(t,e){var i=null!=t?r[t]:null,n=null!=e?s[e]:null,a=c(i,n,l,u);a&&o(i&&i.viewChildren||[],n&&n.viewChildren||[],a,h,u+1);}}(n.root?[n.root]:[],a&&a.root?[a.root]:[],t,n===a||!a,0);var h,u,d=(u={nodeGroup:[],background:[],content:[]},(h=s)&&Iv(h,function(t,e){var i=u[e];Iv(t,function(t){t&&(i.push(t),t.__tmWillDelete=1);});}),u);return this._oldTree=n,this._storage=r,{lastsForAnimation:o,willDeleteEls:d,renderFinally:function renderFinally(){Iv(d,function(t){Iv(t,function(t){t.parent&&t.parent.remove(t);});}),Iv(l,function(t){t.invisible=!0,t.dirty();});}};},_doAnimation:function _doAnimation(t,o,e,s){if(e.get("animation")){var r,l,h,u=e.get("animationDurationUpdate"),c=e.get("animationEasing"),d=(l=[],h={},{add:function add(t,e,i,n,a){return D(n)&&(a=n,n=0),!h[t.id]&&(h[t.id]=1,l.push({el:t,target:e,time:i,delay:n,easing:a}),!0);},done:function done(t){return r=t,this;},start:function start(){for(var t=l.length,e=0,i=l.length;e<i;e++){var n=l[e];n.el.animateTo(n.target,n.time,n.delay,n.easing,a);}return this;function a(){--t||(l.length=0,h={},r&&r());}}});Iv(o.willDeleteEls,function(t,r){Iv(t,function(t,e){if(!t.invisible){var i,n=t.parent;if(s&&"drillDown"===s.direction)i=n===s.rootNodeGroup?{shape:{x:0,y:0,width:n.__tmNodeWidth,height:n.__tmNodeHeight},style:{opacity:0}}:{style:{opacity:0}};else{var a=0,o=0;n.__tmWillDelete||(a=n.__tmNodeWidth/2,o=n.__tmNodeHeight/2),i="nodeGroup"===r?{position:[a,o],style:{opacity:0}}:{shape:{x:a,y:o,width:0,height:0},style:{opacity:0}};}i&&d.add(t,i,u,c);}});}),Iv(this._storage,function(t,a){Iv(t,function(t,e){var i=o.lastsForAnimation[a][e],n={};i&&("nodeGroup"===a?i.old&&(n.position=t.position.slice(),t.attr("position",i.old)):(i.old&&(n.shape=k({},t.shape),t.setShape(i.old)),i.fadein?(t.setStyle("opacity",0),n.style={opacity:1}):1!==t.style.opacity&&(n.style={opacity:1})),d.add(t,n,u,c));});},this),this._state="animating",d.done(bv(function(){this._state="ready",o.renderFinally();},this)).start();}},_resetController:function _resetController(t){var e=this._controller;e||((e=this._controller=new Tm(t.getZr())).enable(this.seriesModel.get("roam")),e.on("pan",bv(this._onPan,this)),e.on("zoom",bv(this._onZoom,this)));var n=new ei(0,0,t.getWidth(),t.getHeight());e.setPointerChecker(function(t,e,i){return n.contain(e,i);});},_clearController:function _clearController(){var t=this._controller;t&&(t.dispose(),t=null);},_onPan:function _onPan(t,e){if("animating"!==this._state&&(3<Math.abs(t)||3<Math.abs(e))){var i=this.seriesModel.getData().tree.root;if(!i)return;var n=i.getLayout();if(!n)return;this.api.dispatchAction({type:"treemapMove",from:this.uid,seriesId:this.seriesModel.id,rootRect:{x:n.x+t,y:n.y+e,width:n.width,height:n.height}});}},_onZoom:function _onZoom(t,e,i){if("animating"!==this._state){var n=this.seriesModel.getData().tree.root;if(!n)return;var a=n.getLayout();if(!a)return;var o=new ei(a.x,a.y,a.width,a.height),r=this.seriesModel.layoutInfo;e-=r.x,i-=r.y;var s=Et();Vt(s,s,[-e,-i]),Wt(s,s,[t,t]),Vt(s,s,[e,i]),o.applyTransform(s),this.api.dispatchAction({type:"treemapRender",from:this.uid,seriesId:this.seriesModel.id,rootRect:{x:o.x,y:o.y,width:o.width,height:o.height}});}},_initEvents:function _initEvents(t){t.on("click",function(t){if("ready"===this._state){var e=this.seriesModel.get("nodeClick",!0);if(e){var i=this.findTarget(t.offsetX,t.offsetY);if(i){var n=i.node;if(n.getLayout().isLeafRoot)this._rootToNode(i);else if("zoomToNode"===e)this._zoomToNode(i);else if("link"===e){var a=n.hostTree.data.getItemModel(n.dataIndex),o=a.get("link",!0),r=a.get("target",!0)||"blank";o&&window.open(o,r);}}}}},this);},_renderBreadcrumb:function _renderBreadcrumb(e,t,i){i||(i=null!=e.get("leafDepth",!0)?{node:e.getViewRoot()}:this.findTarget(t.getWidth()/2,t.getHeight()/2))||(i={node:e.getData().tree.root}),(this._breadcrumb||(this._breadcrumb=new _v(this.group))).render(e,t,i.node,bv(function(t){"animating"!==this._state&&(vv(e.getViewRoot(),t)?this._rootToNode({node:t}):this._zoomToNode({node:t}));},this));},remove:function remove(){this._clearController(),this._containerGroup&&this._containerGroup.removeAll(),this._storage={nodeGroup:[],background:[],content:[]},this._state="ready",this._breadcrumb&&this._breadcrumb.remove();},dispose:function dispose(){this._clearController();},_zoomToNode:function _zoomToNode(t){this.api.dispatchAction({type:"treemapZoomToNode",from:this.uid,seriesId:this.seriesModel.id,targetNode:t.node});},_rootToNode:function _rootToNode(t){this.api.dispatchAction({type:"treemapRootToNode",from:this.uid,seriesId:this.seriesModel.id,targetNode:t.node});},findTarget:function findTarget(a,o){var r;return this.seriesModel.getViewRoot().eachNode({attr:"viewChildren",order:"preorder"},function(t){var e=this._storage.background[t.getRawIndex()];if(e){var i=e.transformCoordToLocal(a,o),n=e.shape;if(!(n.x<=i[0]&&i[0]<=n.x+n.width&&n.y<=i[1]&&i[1]<=n.y+n.height))return!1;r={node:t,offsetX:i[0],offsetY:i[1]};}},this),r;}});for(var Rv=function Rv(){},zv=["treemapZoomToNode","treemapRender","treemapMove"],Bv=0;Bv<zv.length;Bv++){Hc({type:zv[Bv],update:"updateView"},Rv);}Hc({type:"treemapRootToNode",update:"updateView"},function(a,t){t.eachComponent({mainType:"series",subType:"treemap",query:a},function(t,e){var i=gv(a,["treemapZoomToNode","treemapRootToNode"],t);if(i){var n=t.getViewRoot();n&&(a.direction=vv(n,i.node)?"rollUp":"drillDown"),t.resetViewRoot(i.node);}});});var Vv=z,Gv=R,Wv=-1,Fv=function Fv(t){var e=t.mappingMethod,i=t.type,n=this.option=A(t);this.type=i,this.mappingMethod=e,this._normalizeData=Qv[e];var a,o,r=Hv[i];this.applyVisual=r.applyVisual,this.getColorMapper=r.getColorMapper,this._doMap=r._doMap[e],"piecewise"===e?(Zv(n),o=(a=n).pieceList,a.hasSpecialVisual=!1,z(o,function(t,e){t.originIndex=e,null!=t.visual&&(a.hasSpecialVisual=!0);})):"category"===e?n.categories?function(t){var e=t.categories,i=t.visual,n=t.categoryMap={};if(Vv(e,function(t,e){n[t]=e;}),!E(i)){var a=[];R(i)?Vv(i,function(t,e){var i=n[e];a[null!=i?i:Wv]=t;}):a[Wv]=i,i=Jv(t,a);}for(var o=e.length-1;0<=o;o--){null==i[o]&&(delete n[e[o]],e.pop());}}(n):Zv(n,!0):(j("linear"!==e||n.dataExtent),Zv(n));};Fv.prototype={constructor:Fv,mapValueToVisual:function mapValueToVisual(t){var e=this._normalizeData(t);return this._doMap(e,t);},getNormalizer:function getNormalizer(){return S(this._normalizeData,this);}};var Hv=Fv.visualHandlers={color:{applyVisual:Xv("color"),getColorMapper:function getColorMapper(){var a=this.option;return S("category"===a.mappingMethod?function(t,e){return!e&&(t=this._normalizeData(t)),Yv.call(this,t);}:function(t,e,i){var n=!!i;return!e&&(t=this._normalizeData(t)),i=_e(t,a.parsedVisual,i),n?i:Te(i,"rgba");},this);},_doMap:{linear:function linear(t){return Te(_e(t,this.option.parsedVisual),"rgba");},category:Yv,piecewise:function piecewise(t,e){var i=$v.call(this,e);return null==i&&(i=Te(_e(t,this.option.parsedVisual),"rgba")),i;},fixed:qv}},colorHue:Uv(function(t,e){return Me(t,e);}),colorSaturation:Uv(function(t,e){return Me(t,null,e);}),colorLightness:Uv(function(t,e){return Me(t,null,null,e);}),colorAlpha:Uv(function(t,e){return Ie(t,e);}),opacity:{applyVisual:Xv("opacity"),_doMap:Kv([0,1])},symbol:{applyVisual:function applyVisual(t,e,i){var n=this.mapValueToVisual(t);if(D(n))i("symbol",n);else if(Gv(n))for(var a in n){n.hasOwnProperty(a)&&i(a,n[a]);}},_doMap:{linear:jv,category:Yv,piecewise:function piecewise(t,e){var i=$v.call(this,e);return null==i&&(i=jv.call(this,t)),i;},fixed:qv}},symbolSize:{applyVisual:Xv("symbolSize"),_doMap:Kv([0,1])}};function Zv(t,e){var i=t.visual,n=[];R(i)?Vv(i,function(t){n.push(t);}):null!=i&&n.push(i);e||1!==n.length||{color:1,symbol:1}.hasOwnProperty(t.type)||(n[1]=n[0]),Jv(t,n);}function Uv(n){return{applyVisual:function applyVisual(t,e,i){t=this.mapValueToVisual(t),i("color",n(e("color"),t));},_doMap:Kv([0,1])};}function jv(t){var e=this.option.visual;return e[Math.round(Os(t,[0,1],[0,e.length-1],!0))]||{};}function Xv(n){return function(t,e,i){i(n,this.mapValueToVisual(t));};}function Yv(t){var e=this.option.visual;return e[this.option.loop&&t!==Wv?t%e.length:t];}function qv(){return this.option.visual[0];}function Kv(n){return{linear:function linear(t){return Os(t,n,this.option.visual,!0);},category:Yv,piecewise:function piecewise(t,e){var i=$v.call(this,e);return null==i&&(i=Os(t,n,this.option.visual,!0)),i;},fixed:qv};}function $v(t){var e=this.option,i=e.pieceList;if(e.hasSpecialVisual){var n=i[Fv.findPieceIndex(t,i)];if(n&&n.visual)return n.visual[this.type];}}function Jv(t,e){return t.visual=e,"color"===t.type&&(t.parsedVisual=P(e,function(t){return me(t);})),e;}var Qv={linear:function linear(t){return Os(t,this.option.dataExtent,[0,1],!0);},piecewise:function piecewise(t){var e=this.option.pieceList,i=Fv.findPieceIndex(t,e,!0);if(null!=i)return Os(i,[0,e.length-1],[0,1],!0);},category:function category(t){var e=this.option.categories?this.option.categoryMap[t]:t;return null==e?Wv:e;},fixed:tt};function ty(t,e,i){return t?e<=i:e<i;}Fv.listVisualTypes=function(){var i=[];return z(Hv,function(t,e){i.push(e);}),i;},Fv.addVisualHandler=function(t,e){Hv[t]=e;},Fv.isValidType=function(t){return Hv.hasOwnProperty(t);},Fv.eachVisual=function(t,e,i){R(t)?z(t,e,i):e.call(i,t);},Fv.mapVisual=function(t,n,a){var o,r=E(t)?[]:R(t)?{}:(o=!0,null);return Fv.eachVisual(t,function(t,e){var i=n.call(a,t,e);o?r=i:r[e]=i;}),r;},Fv.retrieveVisuals=function(i){var n,a={};return i&&Vv(Hv,function(t,e){i.hasOwnProperty(e)&&(a[e]=i[e],n=!0);}),n?a:null;},Fv.prepareVisualTypes=function(t){if(Gv(t)){var i=[];Vv(t,function(t,e){i.push(e);}),t=i;}else{if(!E(t))return[];t=t.slice();}return t.sort(function(t,e){return"color"===e&&"color"!==t&&0===t.indexOf("color")?1:-1;}),t;},Fv.dependsOn=function(t,e){return"color"===e?!(!t||0!==t.indexOf(e)):t===e;},Fv.findPieceIndex=function(n,t,e){for(var a,o=1/0,i=0,r=t.length;i<r;i++){var s=t[i].value;if(null!=s){if(s===n||"string"==typeof s&&s===n+"")return i;e&&c(s,i);}}for(i=0,r=t.length;i<r;i++){var l=t[i],h=l.interval,u=l.close;if(h){if(h[0]===-1/0){if(ty(u[1],n,h[1]))return i;}else if(h[1]===1/0){if(ty(u[0],h[0],n))return i;}else if(ty(u[0],h[0],n)&&ty(u[1],n,h[1]))return i;e&&c(h[0],i),e&&c(h[1],i);}}if(e)return n===1/0?t.length-1:n===-1/0?0:a;function c(t,e){var i=Math.abs(t-n);i<o&&(o=i,a=e);}};var ey=E,iy="itemStyle",ny={seriesType:"treemap",reset:function reset(t,e,i,n){var a=t.getData().tree,o=a.root,r=t.getModel(iy);o.isRemoved()||function n(t,e,a,o,r,s){var l=t.getModel();var i=t.getLayout();if(!i||i.invisible||!i.isInView)return;var h=t.getModel(iy);var u=a[t.depth];var c=(d=h,f=e,p=u,g=o,m=k({},f),z(["color","colorAlpha","colorSaturation"],function(t){var e=d.get(t,!0);null==e&&p&&(e=p[t]),null==e&&(e=f[t]),null==e&&(e=g.get(t)),null!=e&&(m[t]=e);}),m);var d,f,p,g,m;var v=h.get("borderColor");var y=h.get("borderColorSaturation");var x;null!=y&&(x=ay(c),_=y,v=null!=(w=x)?Me(w,null,null,_):null);var _,w;t.setVisual("borderColor",v);var b=t.viewChildren;if(b&&b.length){var S=function(t,e,i,n,a,o){if(!o||!o.length)return;var r=ry(e,"color")||null!=a.color&&"none"!==a.color&&(ry(e,"colorAlpha")||ry(e,"colorSaturation"));if(!r)return;var s=e.get("visualMin"),l=e.get("visualMax"),h=i.dataExtent.slice();null!=s&&s<h[0]&&(h[0]=s),null!=l&&l>h[1]&&(h[1]=l);var u=e.get("colorMappingBy"),c={type:r.name,dataExtent:h,visual:r.range};"color"!==c.type||"index"!==u&&"id"!==u?c.mappingMethod="linear":(c.mappingMethod="category",c.loop=!0);var d=new Fv(c);return d.__drColorMappingBy=u,d;}(0,l,i,0,c,b);z(b,function(t,e){if(t.depth>=r.length||t===r[t.depth]){var i=function(t,e,i,n,a,o){var r=k({},e);if(a){var s=a.type,l="color"===s&&a.__drColorMappingBy,h="index"===l?n:"id"===l?o.mapIdToIndex(i.getId()):i.getValue(t.get("visualDimension"));r[s]=a.mapValueToVisual(h);}return r;}(l,c,t,e,S,s);n(t,i,a,o,r,s);}});}else x=ay(c),t.setVisual("color",x);}(o,{},P(a.levelModels,function(t){return t?t.get(iy):null;}),r,t.getViewRoot().getAncestors(),t);}};function ay(t){var e=oy(t,"color");if(e){var i=oy(t,"colorAlpha"),n=oy(t,"colorSaturation");return n&&(e=Me(e,null,null,n)),i&&(e=Ie(e,i)),e;}}function oy(t,e){var i=t[e];if(null!=i&&"none"!==i)return i;}function ry(t,e){var i=t.get(e);return ey(i)&&i.length?{name:e,range:i}:null;}var sy=Math.max,ly=Math.min,hy=W,uy=z,cy=["itemStyle","borderWidth"],dy=["itemStyle","gapWidth"],fy=["upperLabel","show"],py=["upperLabel","height"],gy={seriesType:"treemap",reset:function reset(t,e,i,n){var a=i.getWidth(),o=i.getHeight(),r=t.option,s=wl(t.getBoxLayoutParams(),{width:i.getWidth(),height:i.getHeight()}),l=r.size||[],h=Es(hy(s.width,l[0]),a),u=Es(hy(s.height,l[1]),o),c=n&&n.type,d=gv(n,["treemapZoomToNode","treemapRootToNode"],t),f="treemapRender"===c||"treemapMove"===c?n.rootRect:null,p=t.getViewRoot(),g=mv(p);if("treemapMove"!==c){var m="treemapZoomToNode"===c?function(t,e,i,n,a){var o,r=(e||{}).node,s=[n,a];if(!r||r===i)return s;var l=n*a,h=l*t.option.zoomToNodeRatio;for(;o=r.parentNode;){for(var u=0,c=o.children,d=0,f=c.length;d<f;d++){u+=c[d].getValue();}var p=r.getValue();if(0===p)return s;h*=u/p;var g=o.getModel(),m=g.get(cy),v=Math.max(m,yy(g));h+=4*m*m+(3*m+v)*Math.pow(h,.5),Fs<h&&(h=Fs),r=o;}h<l&&(h=l);var y=Math.pow(h/l,.5);return[n*y,a*y];}(t,d,p,h,u):f?[f.width,f.height]:[h,u],v=r.sort;v&&"asc"!==v&&"desc"!==v&&(v="desc");var y={squareRatio:r.squareRatio,sort:v,leafDepth:r.leafDepth};p.hostTree.clearLayouts();var x={x:0,y:0,width:m[0],height:m[1],area:m[0]*m[1]};p.setLayout(x),function t(e,i,n,a){var o;var r;if(e.isRemoved())return;var s=e.getLayout();o=s.width;r=s.height;var l=e.getModel();var h=l.get(cy);var u=l.get(dy)/2;var c=yy(l);var d=Math.max(h,c);var f=h-u;var p=d-u;var l=e.getModel();e.setLayout({borderWidth:h,upperHeight:d,upperLabelHeight:c},!0);o=sy(o-2*f,0);r=sy(r-f-p,0);var g=o*r;var m=function(t,e,i,n,a,o){var r=t.children||[],s=n.sort;"asc"!==s&&"desc"!==s&&(s=null);var l=null!=n.leafDepth&&n.leafDepth<=o;if(a&&!l)return t.viewChildren=[];h=r=T(r,function(t){return!t.isRemoved();}),u=s,!void(u&&h.sort(function(t,e){var i="asc"===u?t.getValue()-e.getValue():e.getValue()-t.getValue();return 0===i?"asc"===u?t.dataIndex-e.dataIndex:e.dataIndex-t.dataIndex:i;}));var h,u;var c=function(t,e,i){for(var n=0,a=0,o=e.length;a<o;a++){n+=e[a].getValue();}var r=t.get("visualDimension");if(e&&e.length){if("value"===r&&i)s=[e[e.length-1].getValue(),e[0].getValue()],"asc"===i&&s.reverse();else{var s=[1/0,-1/0];uy(e,function(t){var e=t.getValue(r);e<s[0]&&(s[0]=e),e>s[1]&&(s[1]=e);});}}else s=[NaN,NaN];return{sum:n,dataExtent:s};}(e,r,s);if(0===c.sum)return t.viewChildren=[];if(c.sum=function(t,e,i,n,a){if(!n)return i;for(var o=t.get("visibleMin"),r=a.length,s=r,l=r-1;0<=l;l--){var h=a["asc"===n?r-l-1:l].getValue();h/i*e<o&&(s=l,i-=h);}return"asc"===n?a.splice(0,r-s):a.splice(s,r-s),i;}(e,i,c.sum,s,r),0===c.sum)return t.viewChildren=[];for(var d=0,f=r.length;d<f;d++){var p=r[d].getValue()/c.sum*i;r[d].setLayout({area:p});}l&&(r.length&&t.setLayout({isLeafRoot:!0},!0),r.length=0);return t.viewChildren=r,t.setLayout({dataExtent:c.dataExtent},!0),r;}(e,l,g,i,n,a);if(!m.length)return;var v={x:f,y:p,width:o,height:r};var y=ly(o,r);var x=1/0;var _=[];_.area=0;for(var w=0,b=m.length;w<b;){var S=m[w];_.push(S),_.area+=S.getLayout().area;var M=my(_,y,i.squareRatio);M<=x?(w++,x=M):(_.area-=_.pop().getLayout().area,vy(_,y,v,u,!1),y=ly(v.width,v.height),_.length=_.area=0,x=1/0);}_.length&&vy(_,y,v,u,!0);if(!n){var I=l.get("childrenVisibleMin");null!=I&&g<I&&(n=!0);}for(var w=0,b=m.length;w<b;w++){t(m[w],i,n,a+1);}}(p,y,!1,0);x=p.getLayout();uy(g,function(t,e){var i=(g[e+1]||p).getValue();t.setLayout(k({dataExtent:[i,i],borderWidth:0,upperHeight:0},x));});}var _=t.getData().tree.root;_.setLayout(function(t,e,i){if(e)return{x:e.x,y:e.y};var n={x:0,y:0};if(!i)return n;var a=i.node,o=a.getLayout();if(!o)return n;var r=[o.width/2,o.height/2],s=a;for(;s;){var l=s.getLayout();r[0]+=l.x,r[1]+=l.y,s=s.parentNode;}return{x:t.width/2-r[0],y:t.height/2-r[1]};}(s,f,d),!0),t.setLayoutInfo(s),function e(t,i,n,a,o){var r=t.getLayout();var s=n[o];var l=s&&s===t;if(s&&!l||o===n.length&&t!==a)return;t.setLayout({isInView:!0,invisible:!l&&!i.intersect(r),isAboveViewRoot:l},!0);var h=new ei(i.x-r.x,i.y-r.y,i.width,i.height);uy(t.viewChildren||[],function(t){e(t,h,n,a,o+1);});}(_,new ei(-s.x,-s.y,a,o),g,p,0);}};function my(t,e,i){for(var n,a=0,o=1/0,r=0,s=t.length;r<s;r++){(n=t[r].getLayout().area)&&(n<o&&(o=n),a<n&&(a=n));}var l=t.area*t.area,h=e*e*i;return l?sy(h*a/l,l/(h*o)):1/0;}function vy(t,e,i,n,a){var o=e===i.width?0:1,r=1-o,s=["x","y"],l=["width","height"],h=i[s[o]],u=e?t.area/e:0;(a||u>i[l[r]])&&(u=i[l[r]]);for(var c=0,d=t.length;c<d;c++){var f=t[c],p={},g=u?f.getLayout().area/u:0,m=p[l[r]]=sy(u-2*n,0),v=i[s[o]]+i[l[o]]-h,y=c===d-1||v<g?v:g,x=p[l[o]]=sy(y-2*n,0);p[s[r]]=i[s[r]]+ly(n,m/2),p[s[o]]=h+ly(n,x/2),h+=y,f.setLayout(p,!0);}i[s[r]]+=u,i[l[r]]-=u;}function yy(t){return t.get(fy)?t.get(py):0;}function xy(t){return"_EC_"+t;}jc(ny),Uc(gy);var _y=function _y(t){this._directed=t||!1,this.nodes=[],this.edges=[],this._nodesMap={},this._edgesMap={},this.data,this.edgeData;},wy=_y.prototype;function by(t,e){this.id=null==t?"":t,this.inEdges=[],this.outEdges=[],this.edges=[],this.hostGraph,this.dataIndex=null==e?-1:e;}function Sy(t,e,i){this.node1=t,this.node2=e,this.dataIndex=null==i?-1:i;}wy.type="graph",wy.isDirected=function(){return this._directed;},wy.addNode=function(t,e){t=t||""+e;var i=this._nodesMap;if(!i[xy(t)]){var n=new by(t,e);return(n.hostGraph=this).nodes.push(n),i[xy(t)]=n;}},wy.getNodeByIndex=function(t){var e=this.data.getRawIndex(t);return this.nodes[e];},wy.getNodeById=function(t){return this._nodesMap[xy(t)];},wy.addEdge=function(t,e,i){var n=this._nodesMap,a=this._edgesMap;if("number"==typeof t&&(t=this.nodes[t]),"number"==typeof e&&(e=this.nodes[e]),by.isInstance(t)||(t=n[xy(t)]),by.isInstance(e)||(e=n[xy(e)]),t&&e){var o=t.id+"-"+e.id;if(!a[o]){var r=new Sy(t,e,i);return(r.hostGraph=this)._directed&&(t.outEdges.push(r),e.inEdges.push(r)),t.edges.push(r),t!==e&&e.edges.push(r),this.edges.push(r),a[o]=r;}}},wy.getEdgeByIndex=function(t){var e=this.edgeData.getRawIndex(t);return this.edges[e];},wy.getEdge=function(t,e){by.isInstance(t)&&(t=t.id),by.isInstance(e)&&(e=e.id);var i=this._edgesMap;return this._directed?i[t+"-"+e]:i[t+"-"+e]||i[e+"-"+t];},wy.eachNode=function(t,e){for(var i=this.nodes,n=i.length,a=0;a<n;a++){0<=i[a].dataIndex&&t.call(e,i[a],a);}},wy.eachEdge=function(t,e){for(var i=this.edges,n=i.length,a=0;a<n;a++){0<=i[a].dataIndex&&0<=i[a].node1.dataIndex&&0<=i[a].node2.dataIndex&&t.call(e,i[a],a);}},wy.breadthFirstTraverse=function(t,e,i,n){if(by.isInstance(e)||(e=this._nodesMap[xy(e)]),e){for(var a="out"===i?"outEdges":"in"===i?"inEdges":"edges",o=0;o<this.nodes.length;o++){this.nodes[o].__visited=!1;}if(!t.call(n,e,null))for(var r=[e];r.length;){var s=r.shift(),l=s[a];for(o=0;o<l.length;o++){var h=l[o],u=h.node1===s?h.node2:h.node1;if(!u.__visited){if(t.call(n,u,s))return;r.push(u),u.__visited=!0;}}}}},wy.update=function(){for(var t=this.data,i=this.edgeData,e=this.nodes,n=this.edges,a=0,o=e.length;a<o;a++){e[a].dataIndex=-1;}for(a=0,o=t.count();a<o;a++){e[t.getRawIndex(a)].dataIndex=a;}i.filterSelf(function(t){var e=n[i.getRawIndex(t)];return 0<=e.node1.dataIndex&&0<=e.node2.dataIndex;});for(a=0,o=n.length;a<o;a++){n[a].dataIndex=-1;}for(a=0,o=i.count();a<o;a++){n[i.getRawIndex(a)].dataIndex=a;}},wy.clone=function(){for(var t=new _y(this._directed),e=this.nodes,i=this.edges,n=0;n<e.length;n++){t.addNode(e[n].id,e[n].dataIndex);}for(n=0;n<i.length;n++){var a=i[n];t.addEdge(a.node1.id,a.node2.id,a.dataIndex);}return t;},by.prototype={constructor:by,degree:function degree(){return this.edges.length;},inDegree:function inDegree(){return this.inEdges.length;},outDegree:function outDegree(){return this.outEdges.length;},getModel:function getModel(t){if(!(this.dataIndex<0))return this.hostGraph.data.getItemModel(this.dataIndex).getModel(t);}},Sy.prototype.getModel=function(t){if(!(this.dataIndex<0))return this.hostGraph.edgeData.getItemModel(this.dataIndex).getModel(t);};var My=function My(i,n){return{getValue:function getValue(t){var e=this[i][n];return e.get(e.getDimension(t||"value"),this.dataIndex);},setVisual:function setVisual(t,e){0<=this.dataIndex&&this[i][n].setItemVisual(this.dataIndex,t,e);},getVisual:function getVisual(t,e){return this[i][n].getItemVisual(this.dataIndex,t,e);},setLayout:function setLayout(t,e){0<=this.dataIndex&&this[i][n].setItemLayout(this.dataIndex,t,e);},getLayout:function getLayout(){return this[i][n].getItemLayout(this.dataIndex);},getGraphicEl:function getGraphicEl(){return this[i][n].getItemGraphicEl(this.dataIndex);},getRawIndex:function getRawIndex(){return this[i][n].getRawIndex(this.dataIndex);}};};w(by,My("hostGraph","data")),w(Sy,My("hostGraph","edgeData")),_y.Node=by,_y.Edge=Sy,Ia(by),Ia(Sy);var Iy=function Iy(t,e,i,n,a){for(var o=new _y(n),r=0;r<t.length;r++){o.addNode(W(t[r].id,t[r].name,r),r);}var s=[],l=[],h=0;for(r=0;r<e.length;r++){var u=e[r],c=u.source,d=u.target;o.addEdge(c,d,h)&&(l.push(u),s.push(W(u.id,c+" > "+d)),h++);}var f,p=i.get("coordinateSystem");if("cartesian2d"===p||"polar"===p)f=Ld(t,i);else{var g=ah.get(p),m=g&&"view"!==g.type&&g.dimensions||[];L(m,"value")<0&&m.concat(["value"]);var v=Dd(t,{coordDimensions:m});(f=new pd(v,i)).initData(t);}var y=new pd(["value"],i);return y.initData(l,s),a&&a(f,y),Um({mainData:f,struct:o,structAttr:"graph",datas:{node:f,edge:y},datasAttr:{node:"data",edge:"edgeData"}}),o.update(),o;},Ty=$c({type:"series.graph",init:function init(t){Ty.superApply(this,"init",arguments),this.legendDataProvider=function(){return this._categoriesData;},this.fillDataTextStyle(t.edges||t.links),this._updateCategoriesData();},mergeOption:function mergeOption(t){Ty.superApply(this,"mergeOption",arguments),this.fillDataTextStyle(t.edges||t.links),this._updateCategoriesData();},mergeDefaultAndTheme:function mergeDefaultAndTheme(t){Ty.superApply(this,"mergeDefaultAndTheme",arguments),sa(t,["edgeLabel"],["show"]);},getInitialData:function getInitialData(t,s){var e=t.edges||t.links||[],i=t.data||t.nodes||[],l=this;if(i&&e)return Iy(i,e,this,!0,function(t,e){t.wrapMethod("getItemModel",function(t){var e=l._categoriesModels,i=t.getShallow("category"),n=e[i];return n&&(n.parentModel=t.parentModel,t.parentModel=n),t;});var i=l.getModel("edgeLabel"),n=new As({label:i.option},i.parentModel,s),a=l.getModel("emphasis.edgeLabel"),o=new As({emphasis:{label:a.option}},a.parentModel,s);function r(t){return(t=this.parsePath(t))&&"label"===t[0]?n:t&&"emphasis"===t[0]&&"label"===t[1]?o:this.parentModel;}e.wrapMethod("getItemModel",function(t){return t.customizeGetParent(r),t;});}).data;},getGraph:function getGraph(){return this.getData().graph;},getEdgeData:function getEdgeData(){return this.getGraph().edgeData;},getCategoriesData:function getCategoriesData(){return this._categoriesData;},formatTooltip:function formatTooltip(t,e,i){if("edge"===i){var n=this.getData(),a=this.getDataParams(t,i),o=n.graph.getEdgeByIndex(t),r=n.getName(o.node1.dataIndex),s=n.getName(o.node2.dataIndex),l=[];return null!=r&&l.push(r),null!=s&&l.push(s),l=al(l.join(" > ")),a.value&&(l+=" : "+al(a.value)),l;}return Ty.superApply(this,"formatTooltip",arguments);},_updateCategoriesData:function _updateCategoriesData(){var t=P(this.option.categories||[],function(t){return null!=t.value?t:k({value:0},t);}),e=new pd(["value"],this);e.initData(t),this._categoriesData=e,this._categoriesModels=e.mapArray(function(t){return e.getItemModel(t,!0);});},setZoom:function setZoom(t){this.option.zoom=t;},setCenter:function setCenter(t){this.option.center=t;},isAnimationEnabled:function isAnimationEnabled(){return Ty.superCall(this,"isAnimationEnabled")&&!("force"===this.get("layout")&&this.get("force.layoutAnimation"));},defaultOption:{zlevel:0,z:2,coordinateSystem:"view",legendHoverLink:!0,hoverAnimation:!0,layout:null,focusNodeAdjacency:!1,circular:{rotateLabel:!1},force:{initLayout:null,repulsion:[0,50],gravity:.1,edgeLength:30,layoutAnimation:!0},left:"center",top:"center",symbol:"circle",symbolSize:10,edgeSymbol:["none","none"],edgeSymbolSize:10,edgeLabel:{position:"middle"},draggable:!1,roam:!1,center:null,zoom:1,nodeScaleRatio:.6,label:{show:!1,formatter:"{b}"},itemStyle:{},lineStyle:{color:"#aaa",width:1,curveness:0,opacity:.5},emphasis:{label:{show:!0}}}}),Dy=br.prototype,Ay=Ir.prototype;function Cy(t){return isNaN(+t.cpx1)||isNaN(+t.cpy1);}var Ly=zr({type:"ec-line",style:{stroke:"#000",fill:null},shape:{x1:0,y1:0,x2:0,y2:0,percent:1,cpx1:null,cpy1:null},buildPath:function buildPath(t,e){(Cy(e)?Dy:Ay).buildPath(t,e);},pointAt:function pointAt(t){return Cy(this.shape)?Dy.pointAt.call(this,t):Ay.pointAt.call(this,t);},tangentAt:function tangentAt(t){var e=this.shape,i=Cy(e)?[e.x2-e.x1,e.y2-e.y1]:Ay.tangentAt.call(this,t);return gt(i,i);}}),ky=["fromSymbol","toSymbol"];function Py(t){return"_"+t+"Type";}function Ny(t,e,i){var n=e.getItemVisual(i,"color"),a=e.getItemVisual(i,t),o=e.getItemVisual(i,t+"Size");if(a&&"none"!==a){E(o)||(o=[o,o]);var r=Cf(a,-o[0]/2,-o[1]/2,o[0],o[1],n);return r.name=t,r;}}function Oy(t,e){var i=e[0],n=e[1],a=e[2];t.x1=i[0],t.y1=i[1],t.x2=n[0],t.y2=n[1],t.percent=1,a?(t.cpx1=a[0],t.cpy1=a[1]):(t.cpx1=NaN,t.cpy1=NaN);}function Ey(t,e,i){ii.call(this),this._createLine(t,e,i);}var Ry=Ey.prototype;function zy(t){this._ctor=t||Ey,this.group=new ii();}Ry.beforeUpdate=function(){var t=this.childOfName("fromSymbol"),e=this.childOfName("toSymbol"),i=this.childOfName("label");if(t||e||!i.ignore){for(var n=1,a=this.parent;a;){a.scale&&(n/=a.scale[0]),a=a.parent;}var o=this.childOfName("line");if(this.__dirty||o.__dirty){var r=o.shape.percent,s=o.pointAt(0),l=o.pointAt(r),h=ht([],l,s);if(gt(h,h),t){t.attr("position",s);var u=o.tangentAt(0);t.attr("rotation",Math.PI/2-Math.atan2(u[1],u[0])),t.attr("scale",[n*r,n*r]);}if(e&&(e.attr("position",l),u=o.tangentAt(1),e.attr("rotation",-Math.PI/2-Math.atan2(u[1],u[0])),e.attr("scale",[n*r,n*r])),!i.ignore){var c,d,f;i.attr("position",l);var p=5*n;if("end"===i.__position)c=[h[0]*p+l[0],h[1]*p+l[1]],d=.8<h[0]?"left":h[0]<-.8?"right":"center",f=.8<h[1]?"top":h[1]<-.8?"bottom":"middle";else if("middle"===i.__position){var g=r/2,m=[(u=o.tangentAt(g))[1],-u[0]],v=o.pointAt(g);0<m[1]&&(m[0]=-m[0],m[1]=-m[1]),c=[v[0]+m[0]*p,v[1]+m[1]*p],d="center",f="bottom";var y=-Math.atan2(u[1],u[0]);l[0]<s[0]&&(y=Math.PI+y),i.attr("rotation",y);}else c=[-h[0]*p+s[0],-h[1]*p+s[1]],d=.8<h[0]?"right":h[0]<-.8?"left":"center",f=.8<h[1]?"bottom":h[1]<-.8?"top":"middle";i.attr({style:{textVerticalAlign:i.__verticalAlign||f,textAlign:i.__textAlign||d},position:c,scale:[n,n]});}}}},Ry._createLine=function(i,n,t){var e,a,o=i.hostModel,r=i.getItemLayout(n),s=(e=r,Oy((a=new Ly({name:"line"})).shape,e),a);s.shape.percent=0,ps(s,{shape:{percent:1}},o,n),this.add(s);var l=new hr({name:"label"});this.add(l),z(ky,function(t){var e=Ny(t,i,n);this.add(e),this[Py(t)]=i.getItemVisual(n,t);},this),this._updateCommonStl(i,n,t);},Ry.updateData=function(a,o,t){var e=a.hostModel,i=this.childOfName("line"),n=a.getItemLayout(o),r={shape:{}};Oy(r.shape,n),fs(i,r,e,o),z(ky,function(t){var e=a.getItemVisual(o,t),i=Py(t);if(this[i]!==e){this.remove(this.childOfName(t));var n=Ny(t,a,o);this.add(n);}this[i]=e;},this),this._updateCommonStl(a,o,t);},Ry._updateCommonStl=function(t,e,i){var n=t.hostModel,a=this.childOfName("line"),o=i&&i.lineStyle,r=i&&i.hoverLineStyle,s=i&&i.labelModel,l=i&&i.hoverLabelModel;if(!i||t.hasItemOption){var h=t.getItemModel(e);o=h.getModel("lineStyle").getLineStyle(),r=h.getModel("emphasis.lineStyle").getLineStyle(),s=h.getModel("label"),l=h.getModel("emphasis.label");}var u=t.getItemVisual(e,"color"),c=H(t.getItemVisual(e,"opacity"),o.opacity,1);a.useStyle(C({strokeNoScale:!0,fill:"none",stroke:u,opacity:c},o)),a.hoverStyle=r,z(ky,function(t){var e=this.childOfName(t);e&&(e.setColor(u),e.setStyle({opacity:c}));},this);var d,f,p=s.getShallow("show"),g=l.getShallow("show"),m=this.childOfName("label");if((p||g)&&(d=u||"#000",null==(f=n.getFormattedLabel(e,"normal",t.dataType)))){var v=n.getRawValue(e);f=null==v?t.getName(e):isFinite(v)?Rs(v):v;}var y=p?f:null,x=g?F(n.getFormattedLabel(e,"emphasis",t.dataType),f):null,_=m.style;null==y&&null==x||(rs(m.style,s,{text:y},{autoColor:d}),m.__textAlign=_.textAlign,m.__verticalAlign=_.textVerticalAlign,m.__position=s.get("position")||"middle"),m.hoverStyle=null!=x?{text:x,textFill:l.getTextColor(!0),fontStyle:l.getShallow("fontStyle"),fontWeight:l.getShallow("fontWeight"),fontSize:l.getShallow("fontSize"),fontFamily:l.getShallow("fontFamily")}:{text:null},m.ignore=!p&&!g,as(this);},Ry.highlight=function(){this.trigger("emphasis");},Ry.downplay=function(){this.trigger("normal");},Ry.updateLayout=function(t,e){this.setLinePoints(t.getItemLayout(e));},Ry.setLinePoints=function(t){var e=this.childOfName("line");Oy(e.shape,t),e.dirty();},_(Ey,ii);var By=zy.prototype;function Vy(t){var e=t.hostModel;return{lineStyle:e.getModel("lineStyle").getLineStyle(),hoverLineStyle:e.getModel("emphasis.lineStyle").getLineStyle(),labelModel:e.getModel("label"),hoverLabelModel:e.getModel("emphasis.label")};}function Gy(t){return isNaN(t[0])||isNaN(t[1]);}function Wy(t){return!Gy(t[0])&&!Gy(t[1]);}By.isPersistent=function(){return!0;},By.updateData=function(i){var n=this,e=n.group,a=n._lineData;n._lineData=i,a||e.removeAll();var o=Vy(i);i.diff(a).add(function(t){!function(t,e,i,n){if(!Wy(e.getItemLayout(i)))return;var a=new t._ctor(e,i,n);e.setItemGraphicEl(i,a),t.group.add(a);}(n,i,t,o);}).update(function(t,e){!function(t,e,i,n,a,o){var r=e.getItemGraphicEl(n);if(!Wy(i.getItemLayout(a)))return t.group.remove(r);r?r.updateData(i,a,o):r=new t._ctor(i,a,o);i.setItemGraphicEl(a,r),t.group.add(r);}(n,a,i,e,t,o);}).remove(function(t){e.remove(a.getItemGraphicEl(t));}).execute();},By.updateLayout=function(){var i=this._lineData;i.eachItemGraphicEl(function(t,e){t.updateLayout(i,e);},this);},By.incrementalPrepareUpdate=function(t){this._seriesScope=Vy(t),this._lineData=null,this.group.removeAll();},By.incrementalUpdate=function(t,e){function i(t){t.isGroup||(t.incremental=t.useHoverLayer=!0);}for(var n=t.start;n<t.end;n++){if(Wy(e.getItemLayout(n))){var a=new this._ctor(e,n,this._seriesScope);a.traverse(i),this.group.add(a);}}},By.remove=function(){this._clearIncremental(),this._incremental=null,this.group.removeAll();},By._clearIncremental=function(){var t=this._incremental;t&&t.clearDisplaybles();};var Fy=[],Hy=[],Zy=[],Uy=qa,jy=xt,Xy=Math.abs;function Yy(t,e,i){for(var n,a=t[0],o=t[1],r=t[2],s=1/0,l=i*i,h=.1,u=.1;u<=.9;u+=.1){Fy[0]=Uy(a[0],o[0],r[0],u),Fy[1]=Uy(a[1],o[1],r[1],u),(f=Xy(jy(Fy,e)-l))<s&&(s=f,n=u);}for(var c=0;c<32;c++){var d=n+h;Hy[0]=Uy(a[0],o[0],r[0],n),Hy[1]=Uy(a[1],o[1],r[1],n),Zy[0]=Uy(a[0],o[0],r[0],d),Zy[1]=Uy(a[1],o[1],r[1],d);var f=jy(Hy,e)-l;if(Xy(f)<.01)break;var p=jy(Zy,e)-l;h/=2,f<0?0<=p?n+=h:n-=h:0<=p?n-=h:n+=h;}return n;}var qy=function qy(t,l){var h=[],u=Ja,c=[[],[],[]],d=[[],[]],f=[];function p(t){var e=t.getVisual("symbolSize");return e instanceof Array&&(e=(e[0]+e[1])/2),e;}l/=2,t.eachEdge(function(t,e){var i=t.getLayout(),n=t.getVisual("fromSymbol"),a=t.getVisual("toSymbol");i.__original||(i.__original=[ot(i[0]),ot(i[1])],i[2]&&i.__original.push(ot(i[2])));var o=i.__original;if(null!=i[2]){if(at(c[0],o[0]),at(c[1],o[2]),at(c[2],o[1]),n&&"none"!=n){var r=p(t.node1),s=Yy(c,o[0],r*l);u(c[0][0],c[1][0],c[2][0],s,h),c[0][0]=h[3],c[1][0]=h[4],u(c[0][1],c[1][1],c[2][1],s,h),c[0][1]=h[3],c[1][1]=h[4];}if(a&&"none"!=a){r=p(t.node2),s=Yy(c,o[1],r*l);u(c[0][0],c[1][0],c[2][0],s,h),c[1][0]=h[1],c[2][0]=h[2],u(c[0][1],c[1][1],c[2][1],s,h),c[1][1]=h[1],c[2][1]=h[2];}at(i[0],c[0]),at(i[1],c[2]),at(i[2],c[1]);}else{if(at(d[0],o[0]),at(d[1],o[1]),ht(f,d[1],d[0]),gt(f,f),n&&"none"!=n){r=p(t.node1);lt(d[0],d[0],f,r*l);}if(a&&"none"!=a){r=p(t.node2);lt(d[1],d[1],f,-r*l);}at(i[0],d[0]),at(i[1],d[1]);}});},Ky=["itemStyle","opacity"],$y=["lineStyle","opacity"];function Jy(t,e){return t.getVisual("opacity")||t.getModel().get(e);}function Qy(t,e,i){var n=t.getGraphicEl(),a=Jy(t,e);null!=i&&(null==a&&(a=1),a*=i),n.downplay&&n.downplay(),n.traverse(function(t){"group"!==t.type&&t.setStyle("opacity",a);});}function tx(t,e){var i=Jy(t,e),n=t.getGraphicEl();n.highlight&&n.highlight(),n.traverse(function(t){"group"!==t.type&&t.setStyle("opacity",i);});}Jc({type:"graph",init:function init(t,e){var i=new Qf(),n=new zy(),a=this.group;this._controller=new Tm(e.getZr()),this._controllerHost={target:a},a.add(i.group),a.add(n.group),this._symbolDraw=i,this._lineDraw=n,this._firstRender=!0;},render:function render(a,t,o){var e=a.coordinateSystem;this._model=a,this._nodeScaleRatio=a.get("nodeScaleRatio");var i=this._symbolDraw,n=this._lineDraw,r=this.group;if("view"===e.type){var s={position:e.position,scale:e.scale};this._firstRender?r.attr(s):fs(r,s,a);}qy(a.getGraph(),this._getNodeGlobalScale(a));var l=a.getData();i.updateData(l);var h=a.getEdgeData();n.updateData(h),this._updateNodeAndLinkScale(),this._updateController(a,t,o),clearTimeout(this._layoutTimeout);var u=a.forceLayout,c=a.get("force.layoutAnimation");u&&this._startForceLayoutIteration(u,c),l.eachItemGraphicEl(function(t,e){var i=l.getItemModel(e);t.off("drag").off("dragend");var n=l.getItemModel(e).get("draggable");n&&t.on("drag",function(){u&&(u.warmUp(),!this._layouting&&this._startForceLayoutIteration(u,c),u.setFixed(e),l.setItemLayout(e,t.position));},this).on("dragend",function(){u&&u.setUnfixed(e);},this),t.setDraggable(n&&u),t.off("mouseover",t.__focusNodeAdjacency),t.off("mouseout",t.__unfocusNodeAdjacency),i.get("focusNodeAdjacency")&&(t.on("mouseover",t.__focusNodeAdjacency=function(){o.dispatchAction({type:"focusNodeAdjacency",seriesId:a.id,dataIndex:t.dataIndex});}),t.on("mouseout",t.__unfocusNodeAdjacency=function(){o.dispatchAction({type:"unfocusNodeAdjacency",seriesId:a.id});}));},this),l.graph.eachEdge(function(t){var e=t.getGraphicEl();e.off("mouseover",e.__focusNodeAdjacency),e.off("mouseout",e.__unfocusNodeAdjacency),t.getModel().get("focusNodeAdjacency")&&(e.on("mouseover",e.__focusNodeAdjacency=function(){o.dispatchAction({type:"focusNodeAdjacency",seriesId:a.id,edgeDataIndex:t.dataIndex});}),e.on("mouseout",e.__unfocusNodeAdjacency=function(){o.dispatchAction({type:"unfocusNodeAdjacency",seriesId:a.id});}));});var d="circular"===a.get("layout")&&a.get("circular.rotateLabel"),f=l.getLayout("cx"),p=l.getLayout("cy");l.eachItemGraphicEl(function(t,e){var i=t.getSymbolPath();if(d){var n=l.getItemLayout(e),a=Math.atan2(n[1]-p,n[0]-f);a<0&&(a=2*Math.PI+a);var o=n[0]<f;o&&(a-=Math.PI);var r=o?"left":"right";i.setStyle({textRotation:-a,textPosition:r,textOrigin:"center"}),i.hoverStyle&&(i.hoverStyle.textPosition=r);}else i.setStyle({textRotation:0});}),this._firstRender=!1;},dispose:function dispose(){this._controller&&this._controller.dispose(),this._controllerHost={};},focusNodeAdjacency:function focusNodeAdjacency(t,e,i,n){var a=this._model.getData().graph,o=n.dataIndex,r=n.edgeDataIndex,s=a.getNodeByIndex(o),l=a.getEdgeByIndex(r);(s||l)&&(a.eachNode(function(t){Qy(t,Ky,.1);}),a.eachEdge(function(t){Qy(t,$y,.1);}),s&&(tx(s,Ky),z(s.edges,function(t){t.dataIndex<0||(tx(t,$y),tx(t.node1,Ky),tx(t.node2,Ky));})),l&&(tx(l,$y),tx(l.node1,Ky),tx(l.node2,Ky)));},unfocusNodeAdjacency:function unfocusNodeAdjacency(t,e,i,n){var a=this._model.getData().graph;a.eachNode(function(t){Qy(t,Ky);}),a.eachEdge(function(t){Qy(t,$y);});},_startForceLayoutIteration:function _startForceLayoutIteration(t,i){var n=this;!function e(){t.step(function(t){n.updateLayout(n._model),(n._layouting=!t)&&(i?n._layoutTimeout=setTimeout(e,16):e());});}();},_updateController:function _updateController(a,t,o){var e=this._controller,n=this._controllerHost,r=this.group;e.setPointerChecker(function(t,e,i){var n=r.getBoundingRect();return n.applyTransform(r.transform),n.contain(e,i)&&!zm(t,o,a);}),"view"===a.coordinateSystem.type?(e.enable(a.get("roam")),n.zoomLimit=a.get("scaleLimit"),n.zoom=a.coordinateSystem.getZoom(),e.off("pan").off("zoom").on("pan",function(t,e){Om(n,t,e),o.dispatchAction({seriesId:a.id,type:"graphRoam",dx:t,dy:e});}).on("zoom",function(t,e,i){Em(n,t,e,i),o.dispatchAction({seriesId:a.id,type:"graphRoam",zoom:t,originX:e,originY:i}),this._updateNodeAndLinkScale(),qy(a.getGraph(),this._getNodeGlobalScale(a)),this._lineDraw.updateLayout();},this)):e.disable();},_updateNodeAndLinkScale:function _updateNodeAndLinkScale(){var t=this._model,e=t.getData(),i=this._getNodeGlobalScale(t),n=[i,i];e.eachItemGraphicEl(function(t,e){t.attr("scale",n);});},_getNodeGlobalScale:function _getNodeGlobalScale(t){var e=t.coordinateSystem;if("view"!==e.type)return 1;var i=this._nodeScaleRatio,n=e.scale,a=n&&n[0]||1;return((e.getZoom()-1)*i+1)/a;},updateLayout:function updateLayout(t){qy(t.getGraph(),this._getNodeGlobalScale(t)),this._symbolDraw.updateLayout(),this._lineDraw.updateLayout();},remove:function remove(t,e){this._symbolDraw&&this._symbolDraw.remove(),this._lineDraw&&this._lineDraw.remove();}});Hc({type:"graphRoam",event:"graphRoam",update:"none"},function(i,t){t.eachComponent({mainType:"series",query:i},function(t){var e=Wm(t.coordinateSystem,i);t.setCenter&&t.setCenter(e.center),t.setZoom&&t.setZoom(e.zoom);});}),Hc({type:"focusNodeAdjacency",event:"focusNodeAdjacency",update:"series.graph:focusNodeAdjacency"},function(){}),Hc({type:"unfocusNodeAdjacency",event:"unfocusNodeAdjacency",update:"series.graph:unfocusNodeAdjacency"},function(){});function ex(t){return t instanceof Array||(t=[t,t]),t;}function ix(t){var e=t.coordinateSystem;if(!e||"view"===e.type){var i=t.getGraph();i.eachNode(function(t){var e=t.getModel();t.setLayout([+e.get("x"),+e.get("y")]);}),nx(i);}}function nx(t){t.eachEdge(function(t){var e=t.getModel().get("lineStyle.curveness")||0,i=ot(t.node1.getLayout()),n=ot(t.node2.getLayout()),a=[i,n];+e&&a.push([(i[0]+n[0])/2-(i[1]-n[1])*e,(i[1]+n[1])/2-(n[0]-i[0])*e]),t.setLayout(a);});}function ax(t){var e=t.coordinateSystem;if(!e||"view"===e.type){var i=e.getBoundingRect(),n=t.getData(),a=n.graph,o=0,r=n.getSum("value"),s=2*Math.PI/(r||n.count()),l=i.width/2+i.x,h=i.height/2+i.y,u=Math.min(i.width,i.height)/2;a.eachNode(function(t){var e=t.getValue("value");o+=s*(r?e:1)/2,t.setLayout([u*Math.cos(o)+l,u*Math.sin(o)+h]),o+=s*(r?e:1)/2;}),n.setLayout({cx:l,cy:h}),a.eachEdge(function(t){var e,i=t.getModel().get("lineStyle.curveness")||0,n=ot(t.node1.getLayout()),a=ot(t.node2.getLayout()),o=(n[0]+a[0])/2,r=(n[1]+a[1])/2;+i&&(e=[l*(i*=3)+o*(1-i),h*i+r*(1-i)]),t.setLayout([n,a,e]);});}}var ox=lt;Fc(function(t){var o=t.findComponents({mainType:"legend"});o&&o.length&&t.eachSeriesByType("graph",function(t){var e=t.getCategoriesData(),n=t.getGraph().data,a=e.mapArray(e.getName);n.filterSelf(function(t){var e=n.getItemModel(t).getShallow("category");if(null!=e){"number"==typeof e&&(e=a[e]);for(var i=0;i<o.length;i++){if(!o[i].isSelected(e))return!1;}}return!0;});},this);}),jc(Tp("graph","circle",null)),jc(function(t){var r={};t.eachSeriesByType("graph",function(n){var a=n.getCategoriesData(),i=n.getData(),o={};a.each(function(t){var e=a.getName(t);o["ec-"+e]=t;var i=a.getItemModel(t).get("itemStyle.color")||n.getColorFromPalette(e,r);a.setItemVisual(t,"color",i);}),a.count()&&i.each(function(t){var e=i.getItemModel(t).getShallow("category");null!=e&&("string"==typeof e&&(e=o["ec-"+e]),i.getItemVisual(t,"color",!0)||i.setItemVisual(t,"color",a.getItemVisual(e,"color")));});});}),jc(function(t){t.eachSeriesByType("graph",function(t){var s=t.getGraph(),l=t.getEdgeData(),e=ex(t.get("edgeSymbol")),i=ex(t.get("edgeSymbolSize")),h="lineStyle.color".split("."),u="lineStyle.opacity".split(".");l.setVisual("fromSymbol",e&&e[0]),l.setVisual("toSymbol",e&&e[1]),l.setVisual("fromSymbolSize",i&&i[0]),l.setVisual("toSymbolSize",i&&i[1]),l.setVisual("color",t.get(h)),l.setVisual("opacity",t.get(u)),l.each(function(t){var e=l.getItemModel(t),i=s.getEdgeByIndex(t),n=ex(e.getShallow("symbol",!0)),a=ex(e.getShallow("symbolSize",!0)),o=e.get(h),r=e.get(u);switch(o){case"source":o=i.node1.getVisual("color");break;case"target":o=i.node2.getVisual("color");}n[0]&&i.setVisual("fromSymbol",n[0]),n[1]&&i.setVisual("toSymbol",n[1]),a[0]&&i.setVisual("fromSymbolSize",a[0]),a[1]&&i.setVisual("toSymbolSize",a[1]),i.setVisual("color",o),i.setVisual("opacity",r);});});}),Uc(function(t,e){t.eachSeriesByType("graph",function(t){var e=t.get("layout"),i=t.coordinateSystem;if(i&&"view"!==i.type){var n=t.getData(),a=[];z(i.dimensions,function(t){a=a.concat(n.mapDimension(t,!0));});for(var o=0;o<n.count();o++){for(var r=[],s=!1,l=0;l<a.length;l++){var h=n.get(a[l],o);isNaN(h)||(s=!0),r.push(h);}s?n.setItemLayout(o,i.dataToPoint(r)):n.setItemLayout(o,[NaN,NaN]);}nx(n.graph);}else e&&"none"!==e||ix(t);});}),Uc(function(t){t.eachSeriesByType("graph",function(t){"circular"===t.get("layout")&&ax(t);});}),Uc(function(t){t.eachSeriesByType("graph",function(t){if(!(l=t.coordinateSystem)||"view"===l.type)if("force"===t.get("layout")){var c=t.preservedPoints||{},d=t.getGraph(),f=d.data,e=d.edgeData,i=t.getModel("force"),n=i.get("initLayout");t.preservedPoints?f.each(function(t){var e=f.getId(t);f.setItemLayout(t,c[e]||[NaN,NaN]);}):n&&"none"!==n?"circular"===n&&ax(t):ix(t);var a=f.getDataExtent("value"),o=e.getDataExtent("value"),r=i.get("repulsion"),s=i.get("edgeLength");E(r)||(r=[r,r]),E(s)||(s=[s,s]),s=[s[1],s[0]];var l,h=f.mapArray("value",function(t,e){var i=f.getItemLayout(e),n=Os(t,a,r);return isNaN(n)&&(n=(r[0]+r[1])/2),{w:n,rep:n,fixed:f.getItemModel(e).get("fixed"),p:!i||isNaN(i[0])||isNaN(i[1])?null:i};}),u=e.mapArray("value",function(t,e){var i=d.getEdgeByIndex(e),n=Os(t,o,s);return isNaN(n)&&(n=(s[0]+s[1])/2),{n1:h[i.node1.dataIndex],n2:h[i.node2.dataIndex],d:n,curveness:i.getModel().get("lineStyle.curveness")||0};}),p=(l=t.coordinateSystem).getBoundingRect(),g=function(f,p,t){for(var e=t.rect,i=e.width,n=e.height,g=[e.x+i/2,e.y+n/2],m=null==t.gravity?.1:t.gravity,a=0;a<f.length;a++){var o=f[a];o.p||(o.p=nt(i*(Math.random()-.5)+g[0],n*(Math.random()-.5)+g[1])),o.pp=ot(o.p),o.edges=null;}var v=.6;return{warmUp:function warmUp(){v=.5;},setFixed:function setFixed(t){f[t].fixed=!0;},setUnfixed:function setUnfixed(t){f[t].fixed=!1;},step:function step(t){for(var e=[],i=f.length,n=0;n<p.length;n++){var a=p[n],o=a.n1;ht(e,(h=a.n2).p,o.p);var r=ut(e)-a.d,s=h.w/(o.w+h.w);isNaN(s)&&(s=0),gt(e,e),!o.fixed&&ox(o.p,o.p,e,s*r*v),!h.fixed&&ox(h.p,h.p,e,-(1-s)*r*v);}for(n=0;n<i;n++){(d=f[n]).fixed||(ht(e,g,d.p),ox(d.p,d.p,e,m*v));}for(n=0;n<i;n++){o=f[n];for(var l=n+1;l<i;l++){var h;ht(e,(h=f[l]).p,o.p),0===(r=ut(e))&&(rt(e,Math.random()-.5,Math.random()-.5),r=1);var u=(o.rep+h.rep)/r/r;!o.fixed&&ox(o.pp,o.pp,e,u),!h.fixed&&ox(h.pp,h.pp,e,-u);}}var c=[];for(n=0;n<i;n++){var d;(d=f[n]).fixed||(ht(c,d.p,d.pp),ox(d.p,d.p,c,v),at(d.pp,d.p));}v*=.992,t&&t(f,p,v<.01);}};}(h,u,{rect:p,gravity:i.get("gravity")}),m=g.step;g.step=function(u){for(var t=0,e=h.length;t<e;t++){h[t].fixed&&at(h[t].p,d.getNodeByIndex(t).getLayout());}m(function(t,e,i){for(var n=0,a=t.length;n<a;n++){t[n].fixed||d.getNodeByIndex(n).setLayout(t[n].p),c[f.getId(n)]=t[n].p;}for(n=0,a=e.length;n<a;n++){var o=e[n],r=d.getEdgeByIndex(n),s=o.n1.p,l=o.n2.p,h=r.getLayout();(h=h?h.slice():[])[0]=h[0]||[],h[1]=h[1]||[],at(h[0],s),at(h[1],l),+o.curveness&&(h[2]=[(s[0]+l[0])/2-(s[1]-l[1])*o.curveness,(s[1]+l[1])/2-(l[0]-s[0])*o.curveness]),r.setLayout(h);}u&&u(i);});},t.forceLayout=g,t.preservedPoints=c,g.step();}else t.forceLayout=null;});}),Zc("graphView",{create:function create(t,g){var m=[];return t.eachSeriesByType("graph",function(t){var e,i,n,a=t.get("coordinateSystem");if(!a||"view"===a){var o=t.getData(),r=[],s=[];so(o.mapArray(function(t){var e=o.getItemModel(t);return[+e.get("x"),+e.get("y")];}),r,s),s[0]-r[0]==0&&(s[0]+=1,r[0]-=1),s[1]-r[1]==0&&(s[1]+=1,r[1]-=1);var l=(s[0]-r[0])/(s[1]-r[1]),h=(e=g,i=l,(n=t.getBoxLayoutParams()).aspect=i,wl(n,{width:e.getWidth(),height:e.getHeight()}));isNaN(l)&&(r=[h.x,h.y],s=[h.x+h.width,h.y+h.height]);var u=s[0]-r[0],c=s[1]-r[1],d=h.width,f=h.height,p=t.coordinateSystem=new sm();p.zoomLimit=t.get("scaleLimit"),p.setBoundingRect(r[0],r[1],u,c),p.setViewRect(h.x,h.y,d,f),p.setCenter(t.get("center")),p.setZoom(t.get("zoom")),m.push(p);}}),m;}});Xh.extend({type:"series.gauge",getInitialData:function getInitialData(t,e){var i=t.data||[];return E(i)||(i=[i]),t.data=i,Rg(this,["value"]);},defaultOption:{zlevel:0,z:2,center:["50%","50%"],legendHoverLink:!0,radius:"75%",startAngle:225,endAngle:-45,clockwise:!0,min:0,max:100,splitNumber:10,axisLine:{show:!0,lineStyle:{color:[[.2,"#91c7ae"],[.8,"#63869e"],[1,"#c23531"]],width:30}},splitLine:{show:!0,length:30,lineStyle:{color:"#eee",width:2,type:"solid"}},axisTick:{show:!0,splitNumber:5,length:8,lineStyle:{color:"#eee",width:1,type:"solid"}},axisLabel:{show:!0,distance:5,color:"auto"},pointer:{show:!0,length:"80%",width:8},itemStyle:{color:"auto"},title:{show:!0,offsetCenter:[0,"-40%"],color:"#333",fontSize:15},detail:{show:!0,backgroundColor:"rgba(0,0,0,0)",borderWidth:0,borderColor:"#ccc",width:100,height:null,padding:[5,10],offsetCenter:[0,"40%"],color:"auto",fontSize:30}}});var rx=Xo.extend({type:"echartsGaugePointer",shape:{angle:0,width:10,r:10,x:0,y:0},buildPath:function buildPath(t,e){var i=Math.cos,n=Math.sin,a=e.r,o=e.width,r=e.angle,s=e.x-i(r)*o*(a/3<=o?1:2),l=e.y-n(r)*o*(a/3<=o?1:2);r=e.angle-Math.PI/2,t.moveTo(s,l),t.lineTo(e.x+i(r)*o,e.y+n(r)*o),t.lineTo(e.x+i(e.angle)*a,e.y+n(e.angle)*a),t.lineTo(e.x-i(r)*o,e.y-n(r)*o),t.lineTo(s,l);}});function sx(t,e){return e&&("string"==typeof e?t=e.replace("{value}",null!=t?t:""):"function"==typeof e&&(t=e(t))),t;}var lx=2*Math.PI,hx=(ru.extend({type:"gauge",render:function render(t,e,i){this.group.removeAll();var n,a,o,r,s,l,h=t.get("axisLine.lineStyle.color"),u=(a=i,o=(n=t).get("center"),r=a.getWidth(),s=a.getHeight(),l=Math.min(r,s),{cx:Es(o[0],a.getWidth()),cy:Es(o[1],a.getHeight()),r:Es(n.get("radius"),l/2)});this._renderMain(t,e,i,h,u);},dispose:function dispose(){},_renderMain:function _renderMain(t,e,i,n,a){for(var o=this.group,r=t.getModel("axisLine").getModel("lineStyle"),s=t.get("clockwise"),l=-t.get("startAngle")/180*Math.PI,h=((f=-t.get("endAngle")/180*Math.PI)-l)%lx,u=l,c=r.get("width"),d=0;d<n.length;d++){var f,p=Math.min(Math.max(n[d][0],0),1),g=new fr({shape:{startAngle:u,endAngle:f=l+h*p,cx:a.cx,cy:a.cy,clockwise:s,r0:a.r-c,r:a.r},silent:!0});g.setStyle({fill:n[d][1]}),g.setStyle(r.getLineStyle(["color","borderWidth","borderColor"])),o.add(g),u=f;}var m=function m(t){if(t<=0)return n[0][1];for(var e=0;e<n.length;e++){if(n[e][0]>=t&&(0===e?0:n[e-1][0])<t)return n[e][1];}return n[e-1][1];};if(!s){var v=l;l=f,f=v;}this._renderTicks(t,e,i,m,a,l,f,s),this._renderPointer(t,e,i,m,a,l,f,s),this._renderTitle(t,e,i,m,a),this._renderDetail(t,e,i,m,a);},_renderTicks:function _renderTicks(t,e,i,n,a,o,r,s){for(var l=this.group,h=a.cx,u=a.cy,c=a.r,d=+t.get("min"),f=+t.get("max"),p=t.getModel("splitLine"),g=t.getModel("axisTick"),m=t.getModel("axisLabel"),v=t.get("splitNumber"),y=g.get("splitNumber"),x=Es(p.get("length"),c),_=Es(g.get("length"),c),w=o,b=(r-o)/v,S=b/y,M=p.getModel("lineStyle").getLineStyle(),I=g.getModel("lineStyle").getLineStyle(),T=0;T<=v;T++){var D=Math.cos(w),A=Math.sin(w);if(p.get("show")){var C=new br({shape:{x1:D*c+h,y1:A*c+u,x2:D*(c-x)+h,y2:A*(c-x)+u},style:M,silent:!0});"auto"===M.stroke&&C.setStyle({stroke:n(T/v)}),l.add(C);}if(m.get("show")){var L=sx(Rs(T/v*(f-d)+d),m.get("formatter")),k=m.get("distance"),P=n(T/v);l.add(new hr({style:rs({},m,{text:L,x:D*(c-x-k)+h,y:A*(c-x-k)+u,textVerticalAlign:A<-.4?"top":.4<A?"bottom":"middle",textAlign:D<-.4?"left":.4<D?"right":"center"},{autoColor:P}),silent:!0}));}if(g.get("show")&&T!==v){for(var N=0;N<=y;N++){D=Math.cos(w),A=Math.sin(w);var O=new br({shape:{x1:D*c+h,y1:A*c+u,x2:D*(c-_)+h,y2:A*(c-_)+u},silent:!0,style:I});"auto"===I.stroke&&O.setStyle({stroke:n((T+N/y)/v)}),l.add(O),w+=S;}w-=S;}else w+=b;}},_renderPointer:function _renderPointer(n,t,e,a,o,i,r,s){var l=this.group,h=this._data;if(n.get("pointer.show")){var u=[+n.get("min"),+n.get("max")],c=[i,r],d=n.getData(),f=d.mapDimension("value");d.diff(h).add(function(t){var e=new rx({shape:{angle:i}});ps(e,{shape:{angle:Os(d.get(f,t),u,c,!0)}},n),l.add(e),d.setItemGraphicEl(t,e);}).update(function(t,e){var i=h.getItemGraphicEl(e);fs(i,{shape:{angle:Os(d.get(f,t),u,c,!0)}},n),l.add(i),d.setItemGraphicEl(t,i);}).remove(function(t){var e=h.getItemGraphicEl(t);l.remove(e);}).execute(),d.eachItemGraphicEl(function(t,e){var i=d.getItemModel(e),n=i.getModel("pointer");t.setShape({x:o.cx,y:o.cy,width:Es(n.get("width"),o.r),r:Es(n.get("length"),o.r)}),t.useStyle(i.getModel("itemStyle").getItemStyle()),"auto"===t.style.fill&&t.setStyle("fill",a(Os(d.get(f,e),u,[0,1],!0))),as(t,i.getModel("emphasis.itemStyle").getItemStyle());}),this._data=d;}else h&&h.eachItemGraphicEl(function(t){l.remove(t);});},_renderTitle:function _renderTitle(t,e,i,n,a){var o=t.getData(),r=o.mapDimension("value"),s=t.getModel("title");if(s.get("show")){var l=s.get("offsetCenter"),h=a.cx+Es(l[0],a.r),u=a.cy+Es(l[1],a.r),c=+t.get("min"),d=+t.get("max"),f=n(Os(t.getData().get(r,0),[c,d],[0,1],!0));this.group.add(new hr({silent:!0,style:rs({},s,{x:h,y:u,text:o.getName(0),textAlign:"center",textVerticalAlign:"middle"},{autoColor:f,forceRich:!0})}));}},_renderDetail:function _renderDetail(t,e,i,n,a){var o=t.getModel("detail"),r=+t.get("min"),s=+t.get("max");if(o.get("show")){var l=o.get("offsetCenter"),h=a.cx+Es(l[0],a.r),u=a.cy+Es(l[1],a.r),c=Es(o.get("width"),a.r),d=Es(o.get("height"),a.r),f=t.getData(),p=f.get(f.mapDimension("value"),0),g=n(Os(p,[r,s],[0,1],!0));this.group.add(new hr({silent:!0,style:rs({},o,{x:h,y:u,text:sx(p,o.get("formatter")),textWidth:isNaN(c)?null:c,textHeight:isNaN(d)?null:d,textAlign:"center",textVerticalAlign:"middle"},{autoColor:g,forceRich:!0})}));}}}),$c({type:"series.funnel",init:function init(t){hx.superApply(this,"init",arguments),this.legendDataProvider=function(){return this.getRawData();},this._defaultLabelLine(t);},getInitialData:function getInitialData(t,e){return Rg(this,["value"]);},_defaultLabelLine:function _defaultLabelLine(t){sa(t,"labelLine",["show"]);var e=t.labelLine,i=t.emphasis.labelLine;e.show=e.show&&t.label.show,i.show=i.show&&t.emphasis.label.show;},getDataParams:function getDataParams(t){var e=this.getData(),i=hx.superCall(this,"getDataParams",t),n=e.mapDimension("value"),a=e.getSum(n);return i.percent=a?+(e.get(n,t)/a*100).toFixed(2):0,i.$vars.push("percent"),i;},defaultOption:{zlevel:0,z:2,legendHoverLink:!0,left:80,top:60,right:80,bottom:60,minSize:"0%",maxSize:"100%",sort:"descending",gap:0,funnelAlign:"center",label:{show:!0,position:"outer"},labelLine:{show:!0,length:20,lineStyle:{width:1,type:"solid"}},itemStyle:{borderColor:"#fff",borderWidth:1},emphasis:{label:{show:!0}}}}));function ux(t,e){ii.call(this);var i=new xr(),n=new _r(),a=new hr();function o(){n.ignore=n.hoverIgnore,a.ignore=a.hoverIgnore;}function r(){n.ignore=n.normalIgnore,a.ignore=a.normalIgnore;}this.add(i),this.add(n),this.add(a),this.updateData(t,e,!0),this.on("emphasis",o).on("normal",r).on("mouseover",o).on("mouseout",r);}var cx=ux.prototype,dx=["itemStyle","opacity"];cx.updateData=function(t,e,i){var n=this.childAt(0),a=t.hostModel,o=t.getItemModel(e),r=t.getItemLayout(e),s=t.getItemModel(e).get(dx);s=null==s?1:s,n.useStyle({}),i?(n.setShape({points:r.points}),n.setStyle({opacity:0}),ps(n,{style:{opacity:s}},a,e)):fs(n,{style:{opacity:s},shape:{points:r.points}},a,e);var l=o.getModel("itemStyle"),h=t.getItemVisual(e,"color");n.setStyle(C({lineJoin:"round",fill:h},l.getItemStyle(["opacity"]))),n.hoverStyle=l.getModel("emphasis").getItemStyle(),this._updateLabel(t,e),as(this);},cx._updateLabel=function(t,e){var i=this.childAt(1),n=this.childAt(2),a=t.hostModel,o=t.getItemModel(e),r=t.getItemLayout(e).label,s=t.getItemVisual(e,"color");fs(i,{shape:{points:r.linePoints||r.linePoints}},a,e),fs(n,{style:{x:r.x,y:r.y}},a,e),n.attr({rotation:r.rotation,origin:[r.x,r.y],z2:10});var l=o.getModel("label"),h=o.getModel("emphasis.label"),u=o.getModel("labelLine"),c=o.getModel("emphasis.labelLine");s=t.getItemVisual(e,"color");os(n.style,n.hoverStyle={},l,h,{labelFetcher:t.hostModel,labelDataIndex:e,defaultText:t.getName(e),autoColor:s,useInsideStyle:!!r.inside},{textAlign:r.textAlign,textVerticalAlign:r.verticalAlign}),n.ignore=n.normalIgnore=!l.get("show"),n.hoverIgnore=!h.get("show"),i.ignore=i.normalIgnore=!u.get("show"),i.hoverIgnore=!c.get("show"),i.setStyle({stroke:s}),i.setStyle(u.getModel("lineStyle").getLineStyle()),i.hoverStyle=c.getModel("lineStyle").getLineStyle();},_(ux,ii);ru.extend({type:"funnel",render:function render(t,e,i){var n=t.getData(),a=this._data,o=this.group;n.diff(a).add(function(t){var e=new ux(n,t);n.setItemGraphicEl(t,e),o.add(e);}).update(function(t,e){var i=a.getItemGraphicEl(e);i.updateData(n,t),o.add(i),n.setItemGraphicEl(t,i);}).remove(function(t){var e=a.getItemGraphicEl(t);o.remove(e);}).execute(),this._data=n;},remove:function remove(){this.group.removeAll(),this._data=null;},dispose:function dispose(){}});jc(Zg("funnel")),Uc(function(t,S,e){t.eachSeriesByType("funnel",function(t){var e,a=t.getData(),o=a.mapDimension("value"),i=t.get("sort"),r=(e=S,wl(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()})),n=function(t,e){for(var i=t.mapDimension("value"),n=t.mapArray(i,function(t){return t;}),a=[],o="ascending"===e,r=0,s=t.count();r<s;r++){a[r]=r;}return"function"==typeof e?a.sort(e):"none"!==e&&a.sort(function(t,e){return o?n[t]-n[e]:n[e]-n[t];}),a;}(a,i),s=[Es(t.get("minSize"),r.width),Es(t.get("maxSize"),r.width)],l=a.getDataExtent(o),h=t.get("min"),u=t.get("max");null==h&&(h=Math.min(l[0],0)),null==u&&(u=l[1]);var g,c=t.get("funnelAlign"),d=t.get("gap"),f=(r.height-d*(a.count()-1))/a.count(),p=r.y,m=function m(t,e){var i,n=Os(a.get(o,t)||0,[h,u],s,!0);switch(c){case"left":i=r.x;break;case"center":i=r.x+(r.width-n)/2;break;case"right":i=r.x+r.width-n;}return[[i,e],[i+n,e]];};"ascending"===i&&(f=-f,d=-d,p+=r.height,n=n.reverse());for(var v=0;v<n.length;v++){var y=n[v],x=n[v+1],_=a.getItemModel(y).get("itemStyle.height");null==_?_=f:(_=Es(_,r.height),"ascending"===i&&(_=-_));var w=m(y,p),b=m(x,p+_);p+=_+d,a.setItemLayout(y,{points:w.concat(b.slice().reverse())});}(g=a).each(function(t){var e,i,n,a,o=g.getItemModel(t),r=o.getModel("label").get("position"),s=o.getModel("labelLine"),l=g.getItemLayout(t),h=l.points,u="inner"===r||"inside"===r||"center"===r;if(u)e="center",a=[[i=(h[0][0]+h[1][0]+h[2][0]+h[3][0])/4,n=(h[0][1]+h[1][1]+h[2][1]+h[3][1])/4],[i,n]];else{var c,d,f,p=s.get("length");"left"===r?(c=(h[3][0]+h[0][0])/2,d=(h[3][1]+h[0][1])/2,i=(f=c-p)-5,e="right"):(c=(h[1][0]+h[2][0])/2,d=(h[1][1]+h[2][1])/2,i=(f=c+p)+5,e="left"),a=[[c,d],[f,d]],n=d;}l.label={linePoints:a,x:i,y:n,verticalAlign:"middle",textAlign:e,inside:u};});});}),Fc(qg("funnel"));var fx=function fx(t,e,i,n,a){Wf.call(this,t,e,i),this.type=n||"value",this.axisIndex=a;};fx.prototype={constructor:fx,model:null,isHorizontal:function isHorizontal(){return"horizontal"!==this.coordinateSystem.getModel().get("layout");}},_(fx,Wf);var px=function px(t,e,i,n,a,o){e[0]=mx(e[0],i),e[1]=mx(e[1],i),t=t||0;var r=i[1]-i[0];null!=a&&(a=mx(a,[0,r])),null!=o&&(o=Math.max(o,null!=a?a:0)),"all"===n&&(a=o=Math.abs(e[1]-e[0]),n=0);var s=gx(e,n);e[n]+=t;var l=a||0,h=i.slice();s.sign<0?h[0]+=l:h[1]-=l,e[n]=mx(e[n],h);var u=gx(e,n);null!=a&&(u.sign!==s.sign||u.span<a)&&(e[1-n]=e[n]+s.sign*a);u=gx(e,n);return null!=o&&u.span>o&&(e[1-n]=e[n]+u.sign*o),e;};function gx(t,e){var i=t[e]-t[1-e];return{span:Math.abs(i),sign:0<i?-1:i<0?1:e?-1:1};}function mx(t,e){return Math.min(e[1],Math.max(e[0],t));}var vx=z,yx=Math.min,xx=Math.max,_x=Math.floor,bx=Math.ceil,Sx=Rs,Mx=Math.PI;function Ix(t,e,i){this._axesMap=J(),this._axesLayout={},this.dimensions=t.dimensions,this._rect,this._model=t,this._init(t,e,i);}function Tx(t,e){return yx(xx(t,e[0]),e[1]);}Ix.prototype={type:"parallel",constructor:Ix,_init:function _init(t,r,e){var i=t.dimensions,s=t.parallelAxisIndex;vx(i,function(t,e){var i=s[e],n=r.getComponent("parallelAxis",i),a=this._axesMap.set(t,new fx(t,mf(n),[0,0],n.get("type"),i)),o="category"===a.type;a.onBand=o&&n.get("boundaryGap"),a.inverse=n.get("inverse"),(n.axis=a).model=n,a.coordinateSystem=n.coordinateSystem=this;},this);},update:function update(t,e){this._updateAxesFromSeries(this._model,t);},containPoint:function containPoint(t){var e=this._makeLayoutInfo(),i=e.axisBase,n=e.layoutBase,a=e.pixelDimIndex,o=t[1-a],r=t[a];return i<=o&&o<=i+e.axisLength&&n<=r&&r<=n+e.layoutLength;},getModel:function getModel(){return this._model;},_updateAxesFromSeries:function _updateAxesFromSeries(e,n){n.eachSeries(function(t){if(e.contains(t,n)){var i=t.getData();vx(this.dimensions,function(t){var e=this._axesMap.get(t);e.scale.unionExtentFromData(i,i.mapDimension(t)),gf(e.scale,e.model);},this);}},this);},resize:function resize(t,e){this._rect=wl(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()}),this._layoutAxes();},getRect:function getRect(){return this._rect;},_makeLayoutInfo:function _makeLayoutInfo(){var t,e=this._model,i=this._rect,n=["x","y"],a=["width","height"],o=e.get("layout"),r="horizontal"===o?0:1,s=i[a[r]],l=[0,s],h=this.dimensions.length,u=Tx(e.get("axisExpandWidth"),l),c=Tx(e.get("axisExpandCount")||0,[0,h]),d=e.get("axisExpandable")&&3<h&&c<h&&1<c&&0<u&&0<s,f=e.get("axisExpandWindow");f?(t=Tx(f[1]-f[0],l),f[1]=f[0]+t):(t=Tx(u*(c-1),l),(f=[u*(e.get("axisExpandCenter")||_x(h/2))-t/2])[1]=f[0]+t);var p=(s-t)/(h-c);p<3&&(p=0);var g=[_x(Sx(f[0]/u,1))+1,bx(Sx(f[1]/u,1))-1],m=p/u*f[0];return{layout:o,pixelDimIndex:r,layoutBase:i[n[r]],layoutLength:s,axisBase:i[n[1-r]],axisLength:i[a[1-r]],axisExpandable:d,axisExpandWidth:u,axisCollapseWidth:p,axisExpandWindow:f,axisCount:h,winInnerIndices:g,axisExpandWindow0Pos:m};},_layoutAxes:function _layoutAxes(){var l=this._rect,h=this._axesMap,t=this.dimensions,u=this._makeLayoutInfo(),c=u.layout;h.each(function(t){var e=[0,u.axisLength],i=t.inverse?1:0;t.setExtent(e[i],e[1-i]);}),vx(t,function(t,e){var i=(u.axisExpandable?function(t,e){var i,n,a=e.layoutLength,o=e.axisExpandWidth,r=e.axisCount,s=e.axisCollapseWidth,l=e.winInnerIndices,h=s,u=!1;t<l[0]?(i=t*s,n=s):t<=l[1]?(i=e.axisExpandWindow0Pos+t*o-e.axisExpandWindow[0],h=o,u=!0):(i=a-(r-1-t)*s,n=s);return{position:i,axisNameAvailableWidth:h,axisLabelShow:u,nameTruncateMaxWidth:n};}:function(t,e){var i=e.layoutLength/(e.axisCount-1);return{position:i*t,axisNameAvailableWidth:i,axisLabelShow:!0};})(e,u),n={horizontal:{x:i.position,y:u.axisLength},vertical:{x:0,y:i.position}},a={horizontal:Mx/2,vertical:0},o=[n[c].x+l.x,n[c].y+l.y],r=a[c],s=Et();Gt(s,s,r),Vt(s,s,o),this._axesLayout[t]={position:o,rotation:r,transform:s,axisNameAvailableWidth:i.axisNameAvailableWidth,axisLabelShow:i.axisLabelShow,nameTruncateMaxWidth:i.nameTruncateMaxWidth,tickDirection:1,labelDirection:1,labelInterval:h.get(t).getLabelInterval()};},this);},getAxis:function getAxis(t){return this._axesMap.get(t);},dataToPoint:function dataToPoint(t,e){return this.axisCoordToPoint(this._axesMap.get(e).dataToCoord(t),e);},eachActiveState:function eachActiveState(e,t,i,n){null==i&&(i=0),null==n&&(n=e.count());var a=this._axesMap,o=this.dimensions,r=[],s=[];z(o,function(t){r.push(e.mapDimension(t)),s.push(a.get(t).model);});for(var l=this.hasAxisBrushed(),h=i;h<n;h++){var u;if(l){u="active";for(var c=e.getValues(r,h),d=0,f=o.length;d<f;d++){if("inactive"===s[d].getActiveState(c[d])){u="inactive";break;}}}else u="normal";t(u,h);}},hasAxisBrushed:function hasAxisBrushed(){for(var t=this.dimensions,e=this._axesMap,i=!1,n=0,a=t.length;n<a;n++){"normal"!==e.get(t[n]).model.getActiveState()&&(i=!0);}return i;},axisCoordToPoint:function axisCoordToPoint(t,e){return ms([t,0],this._axesLayout[e].transform);},getAxisLayout:function getAxisLayout(t){return A(this._axesLayout[t]);},getSlidedAxisExpandWindow:function getSlidedAxisExpandWindow(t){var e=this._makeLayoutInfo(),i=e.pixelDimIndex,n=e.axisExpandWindow.slice(),a=n[1]-n[0],o=[0,e.axisExpandWidth*(e.axisCount-1)];if(!this.containPoint(t))return{behavior:"none",axisExpandWindow:n};var r,s=t[i]-e.layoutBase-e.axisExpandWindow0Pos,l="slide",h=e.axisCollapseWidth,u=this._model.get("axisExpandSlideTriggerArea"),c=null!=u[0];if(h)c&&h&&s<a*u[0]?(l="jump",r=s-a*u[2]):c&&h&&s>a*(1-u[0])?(l="jump",r=s-a*(1-u[2])):0<=(r=s-a*u[1])&&(r=s-a*(1-u[1]))<=0&&(r=0),(r*=e.axisExpandWidth/h)?px(r,n,o,"all"):l="none";else{a=n[1]-n[0];(n=[xx(0,o[1]*s/a-a/2)])[1]=yx(o[1],n[0]+a),n[0]=n[1]-a;}return{axisExpandWindow:n,behavior:l};}},ah.register("parallel",{create:function create(n,a){var o=[];return n.eachComponent("parallel",function(t,e){var i=new Ix(t,n,a);i.name="parallel_"+e,i.resize(t,a),(t.coordinateSystem=i).model=t,o.push(i);}),n.eachSeries(function(t){if("parallel"===t.get("coordinateSystem")){var e=n.queryComponents({mainType:"parallel",index:t.get("parallelIndex"),id:t.get("parallelId")})[0];t.coordinateSystem=e.coordinateSystem;}}),o;}});var Dx=Cl.extend({type:"baseParallelAxis",axis:null,activeIntervals:[],getAreaSelectStyle:function getAreaSelectStyle(){return Ca([["fill","color"],["lineWidth","borderWidth"],["stroke","borderColor"],["width","width"],["opacity","opacity"]])(this.getModel("areaSelectStyle"));},setActiveIntervals:function setActiveIntervals(t){var e=this.activeIntervals=A(t);if(e)for(var i=e.length-1;0<=i;i--){zs(e[i]);}},getActiveState:function getActiveState(t){var e=this.activeIntervals;if(!e.length)return"normal";if(null==t||isNaN(t))return"inactive";if(1===e.length){var i=e[0];if(i[0]<=t&&t<=i[1])return"active";}else for(var n=0,a=e.length;n<a;n++){if(e[n][0]<=t&&t<=e[n][1])return"active";}return"inactive";}});g(Dx.prototype,_f),zp("parallel",Dx,function(t,e){return e.type||(e.data?"category":"value");},{type:"value",dim:null,areaSelectStyle:{width:20,borderWidth:1,borderColor:"rgba(160,197,232)",color:"rgba(160,197,232)",opacity:.3},realtime:!0,z:10}),Cl.extend({type:"parallel",dependencies:["parallelAxis"],coordinateSystem:null,dimensions:null,parallelAxisIndex:null,layoutMode:"box",defaultOption:{zlevel:0,z:0,left:80,top:60,right:80,bottom:60,layout:"horizontal",axisExpandable:!1,axisExpandCenter:null,axisExpandCount:0,axisExpandWidth:50,axisExpandRate:17,axisExpandDebounce:50,axisExpandSlideTriggerArea:[-.15,.05,.4],axisExpandTriggerOn:"click",parallelAxisDefault:null},init:function init(){Cl.prototype.init.apply(this,arguments),this.mergeOption({});},mergeOption:function mergeOption(t){var e=this.option;t&&g(e,t,!0),this._initDimensions();},contains:function contains(t,e){var i=t.get("parallelIndex");return null!=i&&e.getComponent("parallel",i)===this;},setAxisExpand:function setAxisExpand(e){z(["axisExpandable","axisExpandCenter","axisExpandCount","axisExpandWidth","axisExpandWindow"],function(t){e.hasOwnProperty(t)&&(this.option[t]=e[t]);},this);},_initDimensions:function _initDimensions(){var e=this.dimensions=[],i=this.parallelAxisIndex=[];z(T(this.dependentModels.parallelAxis,function(t){return(t.get("parallelIndex")||0)===this.componentIndex;},this),function(t){e.push("dim"+t.get("dim")),i.push(t.componentIndex);});}});Hc({type:"axisAreaSelect",event:"axisAreaSelected"},function(e,t){t.eachComponent({mainType:"parallelAxis",query:e},function(t){t.axis.model.setActiveIntervals(e.intervals);});}),Hc("parallelAxisExpand",function(e,t){t.eachComponent({mainType:"parallel",query:e},function(t){t.setAxisExpand(e);});});var Ax=N,Cx=z,Lx=P,kx=Math.min,Px=Math.max,Nx=Math.pow,Ox=1e4,Ex=6,Rx=6,zx="globalPan",Bx={w:[0,0],e:[0,1],n:[1,0],s:[1,1]},Vx={w:"ew",e:"ew",n:"ns",s:"ns",ne:"nesw",sw:"nesw",nw:"nwse",se:"nwse"},Gx={brushStyle:{lineWidth:2,stroke:"rgba(0,0,0,0.3)",fill:"rgba(0,0,0,0.1)"},transformable:!0,brushMode:"single",removeOnClick:!1},Wx=0;function Fx(t){At.call(this),this._zr=t,this.group=new ii(),this._brushType,this._brushOption,this._panels,this._track=[],this._dragging,this._covers=[],this._creatingCover,this._creatingPanel,this._enableGlobalPan,this._uid="brushController_"+Wx++,this._handlers={},Cx(p_,function(t,e){this._handlers[e]=S(t,this);},this);}function Hx(t,e){var i=m_[e.brushType].createCover(t,e);return i.__brushOption=e,jx(i,e),t.group.add(i),i;}function Zx(t,e){var i=Yx(e);return i.endCreating&&(i.endCreating(t,e),jx(e,e.__brushOption)),e;}function Ux(t,e){var i=e.__brushOption;Yx(e).updateCoverShape(t,e,i.range,i);}function jx(t,e){var i=e.z;null==i&&(i=Ox),t.traverse(function(t){t.z=i,t.z2=i;});}function Xx(t,e){Yx(e).updateCommon(t,e),Ux(t,e);}function Yx(t){return m_[t.__brushOption.brushType];}function qx(t,e,i){var n,a=t._panels;if(!a)return!0;var o=t._transform;return Cx(a,function(t){t.isTargetByCursor(e,i,o)&&(n=t);}),n;}function Kx(t,e){var i=t._panels;if(!i)return!0;var n=e.__brushOption.panelId;return null==n||i[n];}function $x(e){var t=e._covers,i=t.length;return Cx(t,function(t){e.group.remove(t);},e),t.length=0,!!i;}function Jx(t,e){var i=Lx(t._covers,function(t){var e=t.__brushOption,i=A(e.range);return{brushType:e.brushType,panelId:e.panelId,range:i};});t.trigger("brush",i,{isEnd:!!e.isEnd,removeOnClick:!!e.removeOnClick});}function Qx(t){var e=t.length-1;return e<0&&(e=0),[t[0],t[e]];}function t_(e,i,t,n){var a=new ii();return a.add(new wr({name:"main",style:a_(t),silent:!0,draggable:!0,cursor:"move",drift:Ax(e,i,a,"nswe"),ondragend:Ax(Jx,i,{isEnd:!0})})),Cx(n,function(t){a.add(new wr({name:t,style:{opacity:0},draggable:!0,silent:!0,invisible:!0,drift:Ax(e,i,a,t),ondragend:Ax(Jx,i,{isEnd:!0})}));}),a;}function e_(t,e,i,n){var a=n.brushStyle.lineWidth||0,o=Px(a,Rx),r=i[0][0],s=i[1][0],l=r-a/2,h=s-a/2,u=i[0][1],c=i[1][1],d=u-o+a/2,f=c-o+a/2,p=u-r,g=c-s,m=p+a,v=g+a;n_(t,e,"main",r,s,p,g),n.transformable&&(n_(t,e,"w",l,h,o,v),n_(t,e,"e",d,h,o,v),n_(t,e,"n",l,h,m,o),n_(t,e,"s",l,f,m,o),n_(t,e,"nw",l,h,o,o),n_(t,e,"ne",d,h,o,o),n_(t,e,"sw",l,f,o,o),n_(t,e,"se",d,f,o,o));}function i_(n,a){var t=a.__brushOption,o=t.transformable,e=a.childAt(0);e.useStyle(a_(t)),e.attr({silent:!o,cursor:o?"move":"default"}),Cx(["w","e","n","s","se","sw","ne","nw"],function(t){var e=a.childOfName(t),i=function t(e,i){{if(1<i.length){i=i.split("");var n=[t(e,i[0]),t(e,i[1])];return("e"===n[0]||"w"===n[0])&&n.reverse(),n.join("");}var n=vs({w:"left",e:"right",n:"top",s:"bottom"}[i],gs(e.group));return{left:"w",right:"e",top:"n",bottom:"s"}[n];}}(n,t);e&&e.attr({silent:!o,invisible:!o,cursor:o?Vx[i]+"-resize":null});});}function n_(t,e,i,n,a,o,r){var s,l,h,u,c,d=e.childOfName(i);d&&d.setShape((s=h_(t,e,[[n,a],[n+o,a+r]]),l=kx(s[0][0],s[1][0]),h=kx(s[0][1],s[1][1]),u=Px(s[0][0],s[1][0]),c=Px(s[0][1],s[1][1]),{x:l,y:h,width:u-l,height:c-h}));}function a_(t){return C({strokeNoScale:!0},t.brushStyle);}function o_(t,e,i,n){var a=[kx(t,i),kx(e,n)],o=[Px(t,i),Px(e,n)];return[[a[0],o[0]],[a[1],o[1]]];}function r_(t,e,i,n,a,o,r,s){var l=n.__brushOption,h=t(l.range),u=l_(i,o,r);Cx(a.split(""),function(t){var e=Bx[t];h[e[0]][e[1]]+=u[e[0]];}),l.range=e(o_(h[0][0],h[1][0],h[0][1],h[1][1])),Xx(i,n),Jx(i,{isEnd:!1});}function s_(t,e,i,n,a){var o=e.__brushOption.range,r=l_(t,i,n);Cx(o,function(t){t[0]+=r[0],t[1]+=r[1];}),Xx(t,e),Jx(t,{isEnd:!1});}function l_(t,e,i){var n=t.group,a=n.transformCoordToLocal(e,i),o=n.transformCoordToLocal(0,0);return[a[0]-o[0],a[1]-o[1]];}function h_(t,e,i){var n=Kx(t,e);return n&&!0!==n?n.clipPath(i,t._transform):A(i);}function u_(t){var e=t.event;e.preventDefault&&e.preventDefault();}function c_(t,e,i){return t.childOfName("main").contain(e,i);}function d_(t,e,i,n){var a,o=t._creatingCover,r=t._creatingPanel,s=t._brushOption;if(t._track.push(i.slice()),function(t){var e=t._track;if(!e.length)return!1;var i=e[e.length-1],n=e[0],a=i[0]-n[0],o=i[1]-n[1],r=Nx(a*a+o*o,.5);return Ex<r;}(t)||o){if(r&&!o){"single"===s.brushMode&&$x(t);var l=A(s);l.brushType=f_(l.brushType,r),l.panelId=!0===r?null:r.panelId,o=t._creatingCover=Hx(t,l),t._covers.push(o);}if(o){var h=m_[f_(t._brushType,r)];o.__brushOption.range=h.getCreatingRange(h_(t,o,t._track)),n&&(Zx(t,o),h.updateCommon(t,o)),Ux(t,o),a={isEnd:n};}}else n&&"single"===s.brushMode&&s.removeOnClick&&qx(t,e,i)&&$x(t)&&(a={isEnd:n,removeOnClick:!0});return a;}function f_(t,e){return"auto"===t?e.defaultBrushType:t;}Fx.prototype={constructor:Fx,enableBrush:function enableBrush(t){var e,i,n,a,o,r;return this._brushType&&(i=(e=this)._zr,n=i,a=zx,o=e._uid,(r=Im(n))[a]===o&&(r[a]=null),Cx(e._handlers,function(t,e){i.off(e,t);}),e._brushType=e._brushOption=null),t.brushType&&function(t,e){var i=t._zr;t._enableGlobalPan||(n=i,a=zx,o=t._uid,Im(n)[a]=o);var n,a,o;Cx(t._handlers,function(t,e){i.on(e,t);}),t._brushType=e.brushType,t._brushOption=g(A(Gx),e,!0);}(this,t),this;},setPanels:function setPanels(t){if(t&&t.length){var e=this._panels={};z(t,function(t){e[t.panelId]=A(t);});}else this._panels=null;return this;},mount:function mount(t){t=t||{},this._enableGlobalPan=t.enableGlobalPan;var e=this.group;return this._zr.add(e),e.attr({position:t.position||[0,0],rotation:t.rotation||0,scale:t.scale||[1,1]}),this._transform=e.getLocalTransform(),this;},eachCover:function eachCover(t,e){Cx(this._covers,t,e);},updateCovers:function updateCovers(a){a=P(a,function(t){return g(A(Gx),t,!0);});var i="\0-brush-index-",o=this._covers,r=this._covers=[],s=this,l=this._creatingCover;return new ed(o,a,function(t,e){return n(t.__brushOption,e);},n).add(t).update(t).remove(function(t){o[t]!==l&&s.group.remove(o[t]);}).execute(),this;function n(t,e){return(null!=t.id?t.id:i+e)+"-"+t.brushType;}function t(t,e){var i=a[t];if(null!=e&&o[e]===l)r[t]=o[e];else{var n=r[t]=null!=e?(o[e].__brushOption=i,o[e]):Zx(s,Hx(s,i));Xx(s,n);}}},unmount:function unmount(){return this.enableBrush(!1),$x(this),this._zr.remove(this.group),this;},dispose:function dispose(){this.unmount(),this.off();}},w(Fx,At);var p_={mousedown:function mousedown(t){if(this._dragging)g_.call(this,t);else if(!t.target||!t.target.draggable){u_(t);var e=this.group.transformCoordToLocal(t.offsetX,t.offsetY);this._creatingCover=null,(this._creatingPanel=qx(this,t,e))&&(this._dragging=!0,this._track=[e.slice()]);}},mousemove:function mousemove(t){var e=this.group.transformCoordToLocal(t.offsetX,t.offsetY);if(function(t,e,i){if(t._brushType){var n=t._zr,a=t._covers,o=qx(t,e,i);if(!t._dragging)for(var r=0;r<a.length;r++){var s=a[r].__brushOption;if(o&&(!0===o||s.panelId===o.panelId)&&m_[s.brushType].contain(a[r],i[0],i[1]))return;}o&&n.setCursorStyle("crosshair");}}(this,t,e),this._dragging){u_(t);var i=d_(this,t,e,!1);i&&Jx(this,i);}},mouseup:g_};function g_(t){if(this._dragging){u_(t);var e=d_(this,t,this.group.transformCoordToLocal(t.offsetX,t.offsetY),!0);this._dragging=!1,this._track=[],this._creatingCover=null,e&&Jx(this,e);}}var m_={lineX:v_(0),lineY:v_(1),rect:{createCover:function createCover(t,e){return t_(Ax(r_,function(t){return t;},function(t){return t;}),t,e,["w","e","n","s","se","sw","ne","nw"]);},getCreatingRange:function getCreatingRange(t){var e=Qx(t);return o_(e[1][0],e[1][1],e[0][0],e[0][1]);},updateCoverShape:function updateCoverShape(t,e,i,n){e_(t,e,i,n);},updateCommon:i_,contain:c_},polygon:{createCover:function createCover(t,e){var i=new ii();return i.add(new _r({name:"main",style:a_(e),silent:!0})),i;},getCreatingRange:function getCreatingRange(t){return t;},endCreating:function endCreating(t,e){e.remove(e.childAt(0)),e.add(new xr({name:"main",draggable:!0,drift:Ax(s_,t,e),ondragend:Ax(Jx,t,{isEnd:!0})}));},updateCoverShape:function updateCoverShape(t,e,i,n){e.childAt(0).setShape({points:h_(t,e,i)});},updateCommon:i_,contain:c_}};function v_(l){return{createCover:function createCover(t,e){return t_(Ax(r_,function(t){var e=[t,[0,100]];return l&&e.reverse(),e;},function(t){return t[l];}),t,e,[["w","e"],["n","s"]][l]);},getCreatingRange:function getCreatingRange(t){var e=Qx(t);return[kx(e[0][l],e[1][l]),Px(e[0][l],e[1][l])];},updateCoverShape:function updateCoverShape(t,e,i,n){var a,o=Kx(t,e);if(!0!==o&&o.getLinearBrushOtherExtent)a=o.getLinearBrushOtherExtent(l,t._transform);else{var r=t._zr;a=[0,[r.getWidth(),r.getHeight()][1-l]];}var s=[i,a];l&&s.reverse(),e_(t,e,s,n);},updateCommon:i_,contain:c_};}function y_(i){return i=w_(i),function(t,e){return xs(t,i);};}function x_(a,o){return a=w_(a),function(t){var e=null!=o?o:t,i=e?a.width:a.height,n=e?a.x:a.y;return[n,n+(i||0)];};}function __(n,a,o){return n=w_(n),function(t,e,i){return n.contain(e[0],e[1])&&!zm(t,a,o);};}function w_(t){return ei.create(t);}var b_=["axisLine","axisTickLabel","axisName"],S_=Kc({type:"parallelAxis",init:function init(t,e){S_.superApply(this,"init",arguments),(this._brushController=new Fx(e.getZr())).on("brush",S(this._onBrush,this));},render:function render(t,e,i,n){if(a=t,o=e,!(r=n)||"axisAreaSelect"!==r.type||o.findComponents({mainType:"parallelAxis",query:r})[0]!==a){var a,o,r;this.axisModel=t,this.api=i,this.group.removeAll();var s=this._axisGroup;if(this._axisGroup=new ii(),this.group.add(this._axisGroup),t.get("show")){var l,h=(l=t,e.getComponent("parallel",l.get("parallelIndex"))),u=h.coordinateSystem,c=t.getAreaSelectStyle(),d=c.width,f=t.axis.dim,p=k({strokeContainThreshold:d},u.getAxisLayout(f)),g=new tg(t,p);z(b_,g.add,g),this._axisGroup.add(g.getGroup()),this._refreshBrushController(p,c,t,h,d,i);var m=n&&!1===n.animation?null:t;ys(s,this._axisGroup,m);}}},_refreshBrushController:function _refreshBrushController(t,e,i,n,a,o){var r,s,l=i.axis.getExtent(),h=l[1]-l[0],u=Math.min(30,.1*Math.abs(h)),c=ei.create({x:l[0],y:-a/2,width:h,height:a});c.x-=u,c.width+=2*u,this._brushController.mount({enableGlobalPan:!0,rotation:t.rotation,position:t.position}).setPanels([{panelId:"pl",clipPath:y_(c),isTargetByCursor:__(c,o,n),getLinearBrushOtherExtent:x_(c,0)}]).enableBrush({brushType:"lineX",brushStyle:e,removeOnClick:!0}).updateCovers((s=(r=i).axis,P(r.activeIntervals,function(t){return{brushType:"lineX",panelId:"pl",range:[s.dataToCoord(t[0],!0),s.dataToCoord(t[1],!0)]};})));},_onBrush:function _onBrush(t,e){var i=this.axisModel,n=i.axis,a=P(t,function(t){return[n.coordToData(t.range[0],!0),n.coordToData(t.range[1],!0)];});(!i.option.realtime===e.isEnd||e.removeOnClick)&&this.api.dispatchAction({type:"axisAreaSelect",parallelAxisId:i.id,intervals:a});},dispose:function dispose(){this._brushController.dispose();}});Kc({type:"parallel",render:function render(t,e,i){this._model=t,this._api=i,this._handlers||(this._handlers={},z(M_,function(t,e){i.getZr().on(e,this._handlers[e]=S(t,this));},this)),vu(this,"_throttledDispatchExpand",t.get("axisExpandRate"),"fixRate");},dispose:function dispose(t,i){z(this._handlers,function(t,e){i.getZr().off(e,t);}),this._handlers=null;},_throttledDispatchExpand:function _throttledDispatchExpand(t){this._dispatchExpand(t);},_dispatchExpand:function _dispatchExpand(t){t&&this._api.dispatchAction(k({type:"parallelAxisExpand"},t));}});var M_={mousedown:function mousedown(t){I_(this,"click")&&(this._mouseDownPoint=[t.offsetX,t.offsetY]);},mouseup:function mouseup(t){var e=this._mouseDownPoint;if(I_(this,"click")&&e){var i=[t.offsetX,t.offsetY];if(5<Math.pow(e[0]-i[0],2)+Math.pow(e[1]-i[1],2))return;var n=this._model.coordinateSystem.getSlidedAxisExpandWindow([t.offsetX,t.offsetY]);"none"!==n.behavior&&this._dispatchExpand({axisExpandWindow:n.axisExpandWindow});}this._mouseDownPoint=null;},mousemove:function mousemove(t){if(!this._mouseDownPoint&&I_(this,"mousemove")){var e=this._model,i=e.coordinateSystem.getSlidedAxisExpandWindow([t.offsetX,t.offsetY]),n=i.behavior;"jump"===n&&this._throttledDispatchExpand.debounceNextCall(e.get("axisExpandDebounce")),this._throttledDispatchExpand("none"===n?null:{axisExpandWindow:i.axisExpandWindow,animation:"jump"===n&&null});}}};function I_(t,e){var i=t._model;return i.get("axisExpandable")&&i.get("axisExpandTriggerOn")===e;}Wc(function(t){var n;!function(t){if(!t.parallel){var e=!1;z(t.series,function(t){t&&"parallel"===t.type&&(e=!0);}),e&&(t.parallel=[{}]);}}(t),z(ra((n=t).parallelAxis),function(t){if(R(t)){var e=t.parallelIndex||0,i=ra(n.parallel)[e];i&&i.parallelAxisDefault&&g(t,i.parallelAxisDefault,!1);}});}),Xh.extend({type:"series.parallel",dependencies:["parallel"],visualColorAccessPath:"lineStyle.color",getInitialData:function getInitialData(t,e){this.option.progressive&&(this.option.animation=!1);var i=this.getSource();return function(t,e){if(t.encodeDefine)return;var i=e.ecModel.getComponent("parallel",e.get("parallelIndex"));if(!i)return;var n=t.encodeDefine=J();z(i.dimensions,function(t){var e=+t.replace("dim","");n.set(t,e);});}(i,this),Ld(i,this);},getRawIndicesByActiveState:function getRawIndicesByActiveState(i){var t=this.coordinateSystem,n=this.getData(),a=[];return t.eachActiveState(n,function(t,e){i===t&&a.push(n.getRawIndex(e));}),a;},defaultOption:{zlevel:0,z:2,coordinateSystem:"parallel",parallelIndex:0,label:{show:!1},inactiveOpacity:.05,activeOpacity:1,lineStyle:{width:1,opacity:.45,type:"solid"},emphasis:{label:{show:!1}},progressive:!1,smooth:!1,animationEasing:"linear"}});var T_=.3;ru.extend({type:"parallel",init:function init(){this._dataGroup=new ii(),this.group.add(this._dataGroup),this._data,this._initialized;},render:function render(o,t,e,r){var i,n,a,s,l,h,u,c=this._dataGroup,d=o.getData(),f=this._data,p=o.coordinateSystem,g=p.dimensions,m=C_(o);if(d.diff(f).add(function(t){L_(A_(d,c,t,g,p),d,t,m);}).update(function(t,e){var i=f.getItemGraphicEl(e),n=D_(d,t,g,p);d.setItemGraphicEl(t,i);var a=r&&!1===r.animation?null:o;fs(i,{shape:{points:n}},a,t),L_(i,d,t,m);}).remove(function(t){var e=f.getItemGraphicEl(t);c.remove(e);}).execute(),!this._initialized){this._initialized=!0;var v=(n=o,a=function a(){setTimeout(function(){c.removeClipPath();});},s=(i=p).model,l=i.getRect(),h=new wr({shape:{x:l.x,y:l.y,width:l.width,height:l.height}}),u="horizontal"===s.get("layout")?"width":"height",h.setShape(u,0),ps(h,{shape:{width:l.width,height:l.height}},n,a),h);c.setClipPath(v);}this._data=d;},incrementalPrepareRender:function incrementalPrepareRender(t,e,i){this._initialized=!0,this._data=null,this._dataGroup.removeAll();},incrementalRender:function incrementalRender(t,e,i){for(var n=e.getData(),a=e.coordinateSystem,o=a.dimensions,r=C_(e),s=t.start;s<t.end;s++){var l=A_(n,this._dataGroup,s,o,a);l.incremental=!0,L_(l,n,s,r);}},dispose:function dispose(){},remove:function remove(){this._dataGroup&&this._dataGroup.removeAll(),this._data=null;}});function D_(t,e,i,n){for(var a,o=[],r=0;r<i.length;r++){var s=i[r],l=t.get(t.mapDimension(s),e);a=l,("category"===n.getAxis(s).type?null==a:null==a||isNaN(a))||o.push(n.dataToPoint(l,s));}return o;}function A_(t,e,i,n,a){var o=D_(t,i,n,a),r=new _r({shape:{points:o},silent:!0,z2:10});return e.add(r),t.setItemGraphicEl(i,r),r;}function C_(t){var e=t.get("smooth",!0);return!0===e&&(e=T_),{lineStyle:t.getModel("lineStyle").getLineStyle(),smooth:null!=e?e:T_};}function L_(t,e,i,n){var a=n.lineStyle;e.hasItemOption&&(a=e.getItemModel(i).getModel("lineStyle").getLineStyle());t.useStyle(a);var o=t.style;o.fill=null,o.stroke=e.getItemVisual(i,"color"),o.opacity=e.getItemVisual(i,"opacity"),n.smooth&&(t.shape.smooth=n.smooth);}var k_=["lineStyle","normal","opacity"];jc({seriesType:"parallel",reset:function reset(t,e,i){var n=t.getModel("itemStyle"),a=t.getModel("lineStyle"),o=e.get("color"),r=a.get("color")||n.get("color")||o[t.seriesIndex%o.length],s=t.get("inactiveOpacity"),l=t.get("activeOpacity"),h=t.getModel("lineStyle").getLineStyle(),u=t.coordinateSystem,c=t.getData(),d={normal:h.opacity,active:l,inactive:s};return c.setVisual("color",r),{progress:function progress(t,a){u.eachActiveState(a,function(t,e){var i=d[t];if("normal"===t&&a.hasItemOption){var n=a.getItemModel(e).get(k_,!0);null!=n&&(i=n);}a.setItemVisual(e,"opacity",i);},t.start,t.end);}};}});var P_=Xh.extend({type:"series.sankey",layoutInfo:null,getInitialData:function getInitialData(t){var e=t.edges||t.links,i=t.data||t.nodes;if(i&&e)return Iy(i,e,this,!0).data;},getGraph:function getGraph(){return this.getData().graph;},getEdgeData:function getEdgeData(){return this.getGraph().edgeData;},formatTooltip:function formatTooltip(t,e,i){if("edge"===i){var n=this.getDataParams(t,i),a=n.data,o=a.source+" -- "+a.target;return n.value&&(o+=" : "+n.value),al(o);}return P_.superCall(this,"formatTooltip",t,e);},defaultOption:{zlevel:0,z:2,coordinateSystem:"view",layout:null,left:"5%",top:"5%",right:"20%",bottom:"5%",nodeWidth:20,nodeGap:8,layoutIterations:32,label:{show:!0,position:"right",color:"#000",fontSize:12},itemStyle:{borderWidth:1,borderColor:"#333"},lineStyle:{color:"#314656",opacity:.2,curveness:.5},emphasis:{label:{show:!0},lineStyle:{opacity:.6}},animationEasing:"linear",animationDuration:1e3}}),N_=zr({shape:{x1:0,y1:0,x2:0,y2:0,cpx1:0,cpy1:0,cpx2:0,cpy2:0,extent:0},buildPath:function buildPath(t,e){var i=e.extent/2;t.moveTo(e.x1,e.y1-i),t.bezierCurveTo(e.cpx1,e.cpy1-i,e.cpx2,e.cpy2-i,e.x2,e.y2-i),t.lineTo(e.x2,e.y2+i),t.bezierCurveTo(e.cpx2,e.cpy2+i,e.cpx1,e.cpy1+i,e.x1,e.y1+i),t.closePath();}});function O_(){var u=[],e=[];return{key:function key(t){return u.push(t),this;},sortKeys:function sortKeys(t){return e[u.length-1]=t,this;},entries:function entries(t){return function i(t,n){if(n>=u.length)return t;var a=[],o=e[n++];return z(t,function(t,e){a.push({key:e,values:i(t,n)});}),o?a.sort(function(t,e){return o(t.key,e.key);}):a;}(function i(t,n){if(n>=u.length)return t;for(var e=-1,a=t.length,o=u[n++],r={},s={};++e<a;){var l=o(t[e]),h=s[l];h?h.push(t[e]):s[l]=[t[e]];}return z(s,function(t,e){r[e]=i(t,n);}),r;}(t,0),0);}};}Jc({type:"sankey",_model:null,render:function render(g,t,e){var i,n,a,o,r=g.getGraph(),m=this.group,s=g.layoutInfo,l=g.getData(),v=g.getData("edge");this._model=g,m.removeAll(),m.attr("position",[s.x,s.y]),r.eachEdge(function(t){var e=new N_();e.dataIndex=t.dataIndex,e.seriesIndex=g.seriesIndex,e.dataType="edge";var i=t.getModel("lineStyle"),n=i.get("curveness"),a=t.node1.getLayout(),o=t.node2.getLayout(),r=t.getLayout();e.shape.extent=Math.max(1,r.dy);var s=a.x+a.dx,l=a.y+r.sy+r.dy/2,h=o.x,u=o.y+r.ty+r.dy/2,c=s*(1-n)+h*n,d=l,f=s*n+h*(1-n),p=u;switch(e.setShape({x1:s,y1:l,x2:h,y2:u,cpx1:c,cpy1:d,cpx2:f,cpy2:p}),e.setStyle(i.getItemStyle()),e.style.fill){case"source":e.style.fill=t.node1.getVisual("color");break;case"target":e.style.fill=t.node2.getVisual("color");}as(e,t.getModel("emphasis.lineStyle").getItemStyle()),m.add(e),v.setItemGraphicEl(t.dataIndex,e);}),r.eachNode(function(t){var e=t.getLayout(),i=t.getModel(),n=i.getModel("label"),a=i.getModel("emphasis.label"),o=new wr({shape:{x:e.x,y:e.y,width:t.getLayout().dx,height:t.getLayout().dy},style:i.getModel("itemStyle").getItemStyle()}),r=t.getModel("emphasis.itemStyle").getItemStyle();os(o.style,r,n,a,{labelFetcher:g,labelDataIndex:t.dataIndex,defaultText:t.id,isRectText:!0}),o.setStyle("fill",t.getVisual("color")),as(o,r),m.add(o),l.setItemGraphicEl(t.dataIndex,o),o.dataType="node";}),!this._data&&g.get("animation")&&m.setClipPath((i=m.getBoundingRect(),n=g,a=function a(){m.removeClipPath();},ps(o=new wr({shape:{x:i.x-10,y:i.y-10,width:0,height:i.height+20}}),{shape:{width:i.width+20,height:i.height+20}},n,a),o)),this._data=g.getData();},dispose:function dispose(){}});function E_(t,s,l){z(t,function(t){var e,i,n,a=0,o=t.length;for(t.sort(Z_),n=0;n<o;n++){if(0<(i=a-(e=t[n]).getLayout().y)){var r=e.getLayout().y+i;e.setLayout({y:r},!0);}a=e.getLayout().y+e.getLayout().dy+s;}if(0<(i=a-s-l)){r=e.getLayout().y-i;for(e.setLayout({y:r},!0),a=e.getLayout().y,n=o-2;0<=n;--n){0<(i=(e=t[n]).getLayout().y+e.getLayout().dy+s-a)&&(r=e.getLayout().y-i,e.setLayout({y:r},!0)),a=e.getLayout().y;}}});}function R_(t,n){z(t.slice().reverse(),function(t){z(t,function(t){if(t.outEdges.length){var e=F_(t.outEdges,z_)/F_(t.outEdges,j_),i=t.getLayout().y+(e-H_(t))*n;t.setLayout({y:i},!0);}});});}function z_(t){return H_(t.node2)*t.getValue();}function B_(t,n){z(t,function(t){z(t,function(t){if(t.inEdges.length){var e=F_(t.inEdges,V_)/F_(t.inEdges,j_),i=t.getLayout().y+(e-H_(t))*n;t.setLayout({y:i},!0);}});});}function V_(t){return H_(t.node1)*t.getValue();}function G_(t,e){return t.node2.getLayout().y-e.node2.getLayout().y;}function W_(t,e){return t.node1.getLayout().y-e.node1.getLayout().y;}function F_(t,e){for(var i=0,n=t.length,a=-1;++a<n;){var o=+e.call(t,t[a],a);isNaN(o)||(i+=o);}return i;}function H_(t){return t.getLayout().y+t.getLayout().dy/2;}function Z_(t,e){return t.getLayout().y-e.getLayout().y;}function U_(t,e){return t<e?-1:e<t?1:t===e?0:NaN;}function j_(t){return t.getValue();}Uc(function(t,v,e){t.eachSeriesByType("sankey",function(t){var e,i=t.get("nodeWidth"),n=t.get("nodeGap"),a=(e=v,wl(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()})),o=(t.layoutInfo=a).width,r=a.height,s=t.getGraph(),l=s.nodes,h=s.edges;z(l,function(t){var e=F_(t.outEdges,j_),i=F_(t.inEdges,j_),n=Math.max(e,i);t.setLayout({value:n},!0);});var u,c,d,f,p,g,m=0!==T(l,function(t){return 0===t.getLayout().value;}).length?0:t.get("layoutIterations");c=h,d=n,f=r,p=m,function(t,e,i){for(var n,a,o=t,r=null,s=0;o.length;){r=[];for(var l=0,h=o.length;l<h;l++){var u=o[l];u.setLayout({x:s},!0),u.setLayout({dx:e},!0);for(var c=0,d=u.outEdges.length;c<d;c++){r.push(u.outEdges[c].node2);}}o=r,++s;}a=s,z(t,function(t){t.outEdges.length||t.setLayout({x:a-1},!0);}),n=(i-e)/(s-1),z(t,function(t){var e=t.getLayout().x*n;t.setLayout({x:e},!0);});}(u=l,i,o),function(t,e,i,n,a){var o=O_().key(function(t){return t.getLayout().x;}).sortKeys(U_).entries(t).map(function(t){return t.values;});(function(t,e,i,a,o){var r=[];z(e,function(t){var e=t.length,i=0;z(t,function(t){i+=t.getLayout().value;});var n=(a-(e-1)*o)/i;r.push(n);}),r.sort(function(t,e){return t-e;});var n=r[0];z(e,function(t){z(t,function(t,e){t.setLayout({y:e},!0);var i=t.getLayout().value*n;t.setLayout({dy:i},!0);});}),z(i,function(t){var e=+t.getValue()*n;t.setLayout({dy:e},!0);});})(0,o,e,i,n),E_(o,n,i);for(var r=1;0<a;a--){R_(o,r*=.99),E_(o,n,i),B_(o,r),E_(o,n,i);}}(u,c,f,d,p),z(g=u,function(t){t.outEdges.sort(G_),t.inEdges.sort(W_);}),z(g,function(t){var e=0,i=0;z(t.outEdges,function(t){t.setLayout({sy:e},!0),e+=t.getLayout().dy;}),z(t.inEdges,function(t){t.setLayout({ty:i},!0),i+=t.getLayout().dy;});});});}),jc(function(t,e){t.eachSeriesByType("sankey",function(n){var t=n.getGraph().nodes;t.sort(function(t,e){return t.getLayout().value-e.getLayout().value;});var a=t[0].getLayout().value,o=t[t.length-1].getLayout().value;z(t,function(t){var e=new Fv({type:"color",mappingMethod:"linear",dataExtent:[a,o],visual:n.get("color")}).mapValueToVisual(t.getLayout().value);t.setVisual("color",e);var i=t.getModel().get("itemStyle.color");null!=i&&t.setVisual("color",i);});});});var X_=Xo.extend({type:"whiskerInBox",shape:{},buildPath:function buildPath(t,e){for(var i in e){if(e.hasOwnProperty(i)&&0===i.indexOf("ends")){var n=e[i];t.moveTo(n[0][0],n[0][1]),t.lineTo(n[1][0],n[1][1]);}}}}),Y_=0,q_=1;function K_(t,e,i,n){var a=new ii(),o=t.getItemLayout(e),r="horizontal"===o.chartLayout?1:0;a.add(new xr({shape:{points:n?J_(o.bodyEnds,r,o):o.bodyEnds},style:{strokeNoScale:!0},z2:100}));var s=P(o.whiskerEnds,function(t){return n?J_(t,r,o):t;});return a.add(new X_({shape:Q_(s),style:{strokeNoScale:!0},z2:100})),$_(a,t,e,i,n),a;}function $_(t,e,i,n,a){var o=t._seriesModel=e.hostModel,r=e.getItemLayout(i),s=ws[a?"initProps":"updateProps"],l=t.childAt(q_),h=t.childAt(Y_);s(h,{shape:{points:r.bodyEnds}},o,i),s(l,{shape:Q_(r.whiskerEnds)},o,i),n(e,i,t,l,h);}function J_(t,e,i){return P(t,function(t){return(t=t.slice())[e]=i.initBaseline,t;});}function Q_(t){var i={};return z(t,function(t,e){i["ends"+e]=t;}),i;}var tw=["itemStyle"],ew=["emphasis","itemStyle"];function iw(t,e,i,n){var a=new br({shape:nw(e,i,n)});return a.__largeWhiskerBox=!0,aw(a,t,i),a;}function nw(t,e,i){var n=5*(e-(i||0));return{x1:t[n+1],y1:t[n+2],x2:t[n+3],y2:t[n+4]};}function aw(t,e,i){var n=e.getItemModel(i),a=n.getModel(tw),o=e.getItemVisual(i,"color"),r=e.getItemVisual(i,"borderColor")||o,s=a.getItemStyle(["color","color0","borderColor","borderColor0"]);t.useStyle(s),t.style.stroke=r,as(t,n.getModel(ew).getItemStyle());}function ow(t){this.group=new ii(),this.styleUpdater=t;}var rw=ow.prototype;rw.updateData=function(r){var s=this.group,l=this._data,h=this.styleUpdater,u=r.hostModel.pipelineContext.large,c=u&&r.getLayout("largePoints");this._data||s.removeAll(),r.diff(l).add(function(t){if(r.hasValue(t)){var e=u?iw(r,c,t):K_(r,t,h,!0);r.setItemGraphicEl(t,e),s.add(e);}}).update(function(t,e){var i,n,a,o=l.getItemGraphicEl(e);r.hasValue(t)?(o&&o.__largeWhiskerBox^u&&(s.remove(o),o=null),o?u?(a=t,fs(i=o,{shape:nw((n=r).getLayout("largePoints"),a,0)},n.hostModel,a),aw(i,n,a)):$_(o,r,t,h):o=u?iw(r,c,t):K_(r,t,h),s.add(o),r.setItemGraphicEl(t,o)):s.remove(o);}).remove(function(t){var e=l.getItemGraphicEl(t);e&&s.remove(e);}).execute(),this._data=r;},rw.incrementalPrepareUpdate=function(t,e,i){this.group.removeAll(),this._data=null;},rw.incrementalUpdate=function(t,e,i,n){for(var a=e.getData(),o=e.pipelineContext.large,r=o&&a.getLayout("largePoints"),s=t.start;s<t.end;s++){var l=o?iw(a,r,s,t.start):K_(a,s,this.styleUpdater,!0);l.incremental=!0,this.group.add(l);}},rw.remove=function(){var e=this.group,t=this._data;this._data=null,t&&t.eachItemGraphicEl(function(t){t&&e.remove(t);});};var sw={_baseAxisDim:null,getInitialData:function getInitialData(t,e){var i,n,a=e.getComponent("xAxis",this.get("xAxisIndex")),o=e.getComponent("yAxis",this.get("yAxisIndex")),r=a.get("type"),s=o.get("type");"category"===r?(t.layout="horizontal",i=a.getOrdinalMeta(),n=!0):"category"===s?(t.layout="vertical",i=o.getOrdinalMeta(),n=!0):t.layout=t.layout||"horizontal";var l=["x","y"],h="horizontal"===t.layout?0:1,u=this._baseAxisDim=l[h],c=l[1-h],d=[a,o],f=d[h].get("type"),p=d[1-h].get("type"),g=t.data;if(g&&n){var m=[];z(g,function(t,e){var i;t.value&&E(t.value)?(i=t.value.slice(),t.value.unshift(e)):E(t)?(i=t.slice(),t.unshift(e)):i=t,m.push(i);}),t.data=m;}var v=this.defaultValueDimensions;return Rg(this,{coordDimensions:[{name:u,type:ad(f),ordinalMeta:i,otherDims:{tooltip:!1,itemName:0},dimsDef:["base"]},{name:c,type:ad(p),dimsDef:v.slice()}],dimensionsCount:v.length+1});},getBaseAxis:function getBaseAxis(){var t=this._baseAxisDim;return this.ecModel.getComponent(t+"Axis",this.get(t+"AxisIndex")).axis;}},lw={init:function init(){var t=this._whiskerBoxDraw=new ow(this.getStyleUpdater());this.group.add(t.group);},render:function render(t,e,i){this._whiskerBoxDraw.updateData(t.getData());},incrementalPrepareRender:function incrementalPrepareRender(t,e,i){this._whiskerBoxDraw.incrementalPrepareUpdate(t,e,i);},incrementalRender:function incrementalRender(t,e,i,n){this._whiskerBoxDraw.incrementalUpdate(t,e,i,n);},remove:function remove(t){this._whiskerBoxDraw.remove();}};w(Xh.extend({type:"series.boxplot",dependencies:["xAxis","yAxis","grid"],defaultValueDimensions:["min","Q1","median","Q3","max"],dimensions:null,defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,hoverAnimation:!0,layout:null,boxWidth:[7,50],itemStyle:{color:"#fff",borderWidth:1},emphasis:{itemStyle:{borderWidth:2,shadowBlur:5,shadowOffsetX:2,shadowOffsetY:2,shadowColor:"rgba(0,0,0,0.4)"}},animationEasing:"elasticOut",animationDuration:800}}),sw,!0),w(ru.extend({type:"boxplot",getStyleUpdater:function getStyleUpdater(){return cw;},dispose:tt}),lw,!0);var hw=["itemStyle"],uw=["emphasis","itemStyle"];function cw(t,e,i,n,a){var o=t.getItemModel(e),r=o.getModel(hw),s=t.getItemVisual(e,"color"),l=r.getItemStyle(["borderColor"]);n.style.set(l),n.style.stroke=s,n.dirty(),a.style.set(l),a.style.stroke=s,a.dirty(),as(i,o.getModel(uw).getItemStyle());}var dw=["itemStyle","borderColor"],fw=z;jc(function(n,t){var a=n.get("color");n.eachRawSeriesByType("boxplot",function(t){var e=a[t.seriesIndex%a.length],i=t.getData();i.setVisual({legendSymbol:"roundRect",color:t.get(dw)||e}),n.isSeriesFiltered(t)||i.each(function(t){var e=i.getItemModel(t);i.setItemVisual(t,{color:e.get(dw,!0)});});});}),Uc(function(t){var n,a,e=(n=[],a=[],t.eachSeriesByType("boxplot",function(t){var e=t.getBaseAxis(),i=L(a,e);i<0&&(i=a.length,a[i]=e,n[i]={axis:e,seriesModels:[]}),n[i].seriesModels.push(t);}),n);fw(e,function(r){var t=r.seriesModels;t.length&&(function(t){var e,i,n=t.axis,a=t.seriesModels,o=a.length,r=t.boxWidthList=[],s=t.boxOffsetList=[],l=[];if("category"===n.type)i=n.getBandWidth();else{var h=0;fw(a,function(t){h=Math.max(h,t.getData().count());}),e=n.getExtent(),Math.abs(e[1]-e[0]);}fw(a,function(t){var e=t.get("boxWidth");E(e)||(e=[e,e]),l.push([Es(e[0],i)||0,Es(e[1],i)||0]);});var u=.8*i-2,c=u/o*.3,d=(u-c*(o-1))/o,f=d/2-u/2;fw(a,function(t,e){s.push(f),f+=c+d,r.push(Math.min(Math.max(d,l[e][0]),l[e][1]));});}(r),fw(t,function(t,e){var i,c,n,a,d,f,p,g,m,v,o,y;i=t,c=r.boxOffsetList[e],n=r.boxWidthList[e],d=i.coordinateSystem,f=i.getData(),p=n/2,g=i.get("layout"),v=1-(m="horizontal"===g?0:1),o=["x","y"],y=[],z(f.dimensions,function(t){var e=f.getDimensionInfo(t).coordDim;e===o[v]?y.push(t):e===o[m]&&(a=t);}),null==a||y.length<5||f.each([a].concat(y),function(){var t=arguments,n=t[0],e=t[y.length+1],i=l(t[3]),a=l(t[1]),o=l(t[5]),r=[[a,l(t[2])],[o,l(t[4])]];u(a),u(o),u(i);var s=[];function l(t){var e,i=[];return i[m]=n,i[v]=t,isNaN(n)||isNaN(t)?e=[NaN,NaN]:(e=d.dataToPoint(i))[m]+=c,e;}function h(t,e){var i=t.slice(),n=t.slice();i[m]+=p,n[m]-=p,e?s.push(i,n):s.push(n,i);}function u(t){var e=[t.slice(),t.slice()];e[0][m]-=p,e[1][m]+=p,r.push(e);}h(r[0][1],0),h(r[1][1],1),f.setItemLayout(e,{chartLayout:g,initBaseline:i[v],median:i,bodyEnds:s,whiskerEnds:r});});}));});}),w(Xh.extend({type:"series.candlestick",dependencies:["xAxis","yAxis","grid"],defaultValueDimensions:["open","close","lowest","highest"],dimensions:null,defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,hoverAnimation:!0,layout:null,itemStyle:{color:"#c23531",color0:"#314656",borderWidth:1,borderColor:"#c23531",borderColor0:"#314656"},emphasis:{itemStyle:{borderWidth:2}},barMaxWidth:null,barMinWidth:null,barWidth:null,large:!0,largeThreshold:500,animationUpdate:!1,animationEasing:"linear",animationDuration:300},getShadowDim:function getShadowDim(){return"open";},brushSelector:function brushSelector(t,e,i){var n=e.getItemLayout(t);return n&&i.rect(n.brushRect);}}),sw,!0),w(ru.extend({type:"candlestick",getStyleUpdater:function getStyleUpdater(){return mw;},dispose:tt}),lw,!0);var pw=["itemStyle"],gw=["emphasis","itemStyle"];function mw(t,e,i,n,a){var o=t.getItemModel(e),r=o.getModel(pw),s=t.getItemVisual(e,"color"),l=t.getItemVisual(e,"borderColor")||s,h=r.getItemStyle(["color","color0","borderColor","borderColor0"]);n.useStyle(h),n.style.stroke=l,a.useStyle(h),a.style.fill=s,a.style.stroke=l,as(i,o.getModel(gw).getItemStyle());}var vw=["itemStyle","borderColor"],yw=["itemStyle","borderColor0"],xw=["itemStyle","color"],_w=["itemStyle","color0"],ww={seriesType:"candlestick",plan:nu(),performRawSeries:!0,reset:function reset(t,e){var i=t.getData(),o=t.pipelineContext.large,r=o&&i.getLayout("largePoints");if(i.setVisual({legendSymbol:"roundRect"}),!e.isSeriesFiltered(t))return{progress:function progress(t,e){for(var i=t.start;i<t.end;i++){var n=e.getItemModel(i),a=o?r[5*(i-t.start)]:e.getItemLayout(i).sign;e.setItemVisual(i,{color:n.get(0<a?xw:_w),borderColor:n.get(0<a?vw:yw)});}}};}};var bw="undefined"!=typeof Float32Array?Float32Array:Array,Sw={seriesType:"candlestick",plan:nu(),reset:function reset(t){var e,i,n,a,o,r,s,l,h=t.pipelineContext.large,p=t.coordinateSystem,u=t.getData(),S=(i=u,a=(e=t).getBaseAxis(),o="category"===a.type?a.getBandWidth():(n=a.getExtent(),Math.abs(n[1]-n[0])/i.count()),r=Es(F(e.get("barMaxWidth"),o),o),s=Es(F(e.get("barMinWidth"),1),o),null!=(l=e.get("barWidth"))?Es(l,o):Math.max(Math.min(o/2,r),s)),M=t.get("layout"),I="horizontal"===M?0:1,T=1-I,c=["x","y"],D=u.mapDimension(c[I]),d=u.mapDimension(c[T],!0),A=d[0],C=d[1],L=d[2],k=d[3];if(!(null==D||d.length<4))return{progress:h?function(t,e){for(var i,n=t.end-t.start,a=new bw(5*n),o=t.start,r=0,s=[],l=[];o<t.end;o++){var h=e.get(D,o),u=e.get(A,o),c=e.get(C,o),d=e.get(L,o),f=e.get(k,o);isNaN(h)||isNaN(d)||isNaN(f)?(a[r++]=NaN,r+=4):(a[r++]=Mw(e,o,u,c,C),s[I]=h,s[T]=d,i=p.dataToPoint(s,null,l),a[r++]=i?i[0]:NaN,a[r++]=i?i[1]:NaN,s[T]=f,i=p.dataToPoint(s,null,l),a[r++]=i?i[0]:NaN,a[r++]=i?i[1]:NaN);}e.setLayout("largePoints",a),e.setLayout("candleWidth",S),e.setLayout("candleWidth",S);}:function(t,x){for(var e=t.start;e<t.end;e++){i(e);}function i(t){var e,i,n,a,o,r=x.get(D,t),s=x.get(A,t),l=x.get(C,t),h=x.get(L,t),u=x.get(k,t),c=Math.min(s,l),d=Math.max(s,l),f=_(c,r),p=_(d,r),g=_(h,r),m=_(u,r),v=[[b(m),b(p)],[b(g),b(f)]],y=[];w(y,p,0),w(y,f,1),x.setItemLayout(t,{chartLayout:M,sign:Mw(x,t,s,l,C),initBaseline:l<s?p[T]:f[T],bodyEnds:y,whiskerEnds:v,brushRect:(e=h,i=u,n=r,a=_(e,n),o=_(i,n),a[I]-=S/2,o[I]-=S/2,{x:a[0],y:a[1],width:T?S:o[0]-a[0],height:T?o[1]-a[1]:S})});}function _(t,e){var i=[];return i[I]=e,i[T]=t,isNaN(e)||isNaN(t)?[NaN,NaN]:p.dataToPoint(i);}function w(t,e,i){var n=e.slice(),a=e.slice();n[I]=Ur(n[I]+S/2,1,!1),a[I]=Ur(a[I]-S/2,1,!0),i?t.push(n,a):t.push(a,n);}function b(t){return t[I]=Ur(t[I],1),t;}}};}};function Mw(t,e,i,n,a){return n<i?-1:i<n?1:0<e?t.get(a,e-1)<=n?1:-1:1;}Wc(function(t){t&&E(t.series)&&z(t.series,function(t){R(t)&&"k"===t.type&&(t.type="candlestick");});}),jc(ww),Uc(Sw),Xh.extend({type:"series.effectScatter",dependencies:["grid","polar"],getInitialData:function getInitialData(t,e){return Ld(this.getSource(),this);},brushSelector:"point",defaultOption:{coordinateSystem:"cartesian2d",zlevel:0,z:2,legendHoverLink:!0,effectType:"ripple",progressive:0,showEffectOn:"render",rippleEffect:{period:4,scale:2.5,brushType:"fill"},symbolSize:10}});function Iw(t,e){t.eachChild(function(t){t.attr({z:e.z,zlevel:e.zlevel,style:{stroke:"stroke"===e.brushType?e.color:null,fill:"fill"===e.brushType?e.color:null}});});}function Tw(t,e){ii.call(this);var i=new jf(t,e),n=new ii();this.add(i),this.add(n),n.beforeUpdate=function(){this.attr(i.getScale());},this.updateData(t,e);}var Dw=Tw.prototype;Dw.stopEffectAnimation=function(){this.childAt(1).removeAll();},Dw.startEffectAnimation=function(t){for(var e=t.symbolType,i=t.color,n=this.childAt(1),a=0;a<3;a++){var o=Cf(e,-1,-1,2,2,i);o.attr({style:{strokeNoScale:!0},z2:99,silent:!0,scale:[.5,.5]});var r=-a/3*t.period+t.effectOffset;o.animate("",!0).when(t.period,{scale:[t.rippleScale/2,t.rippleScale/2]}).delay(r).start(),o.animateStyle(!0).when(t.period,{opacity:0}).delay(r).start(),n.add(o);}Iw(n,t);},Dw.updateEffectAnimation=function(t){for(var e=this._effectCfg,i=this.childAt(1),n=["symbolType","period","rippleScale"],a=0;a<n.length;a++){var o=n[a];if(e[o]!==t[o])return this.stopEffectAnimation(),void this.startEffectAnimation(t);}Iw(i,t);},Dw.highlight=function(){this.trigger("emphasis");},Dw.downplay=function(){this.trigger("normal");},Dw.updateData=function(t,e){var i=t.hostModel;this.childAt(0).updateData(t,e);var n,a=this.childAt(1),o=t.getItemModel(e),r=t.getItemVisual(e,"symbol"),s=(E(n=t.getItemVisual(e,"symbolSize"))||(n=[+n,+n]),n),l=t.getItemVisual(e,"color");a.attr("scale",s),a.traverse(function(t){t.attr({fill:l});});var h=o.getShallow("symbolOffset");if(h){var u=a.position;u[0]=Es(h[0],s[0]),u[1]=Es(h[1],s[1]);}a.rotation=(o.getShallow("symbolRotate")||0)*Math.PI/180||0;var c={};if(c.showEffectOn=i.get("showEffectOn"),c.rippleScale=o.get("rippleEffect.scale"),c.brushType=o.get("rippleEffect.brushType"),c.period=1e3*o.get("rippleEffect.period"),c.effectOffset=e/t.count(),c.z=o.getShallow("z")||0,c.zlevel=o.getShallow("zlevel")||0,c.symbolType=r,c.color=l,this.off("mouseover").off("mouseout").off("emphasis").off("normal"),"render"===c.showEffectOn)this._effectCfg?this.updateEffectAnimation(c):this.startEffectAnimation(c),this._effectCfg=c;else{this._effectCfg=null,this.stopEffectAnimation();var d=this.childAt(0),f=function f(){d.highlight(),"render"!==c.showEffectOn&&this.startEffectAnimation(c);},p=function p(){d.downplay(),"render"!==c.showEffectOn&&this.stopEffectAnimation();};this.on("mouseover",f,this).on("mouseout",p,this).on("emphasis",f,this).on("normal",p,this);}this._effectCfg=c;},Dw.fadeOut=function(t){this.off("mouseover").off("mouseout").off("emphasis").off("normal"),t&&t();},_(Tw,ii),Jc({type:"effectScatter",init:function init(){this._symbolDraw=new Qf(Tw);},render:function render(t,e,i){var n=t.getData(),a=this._symbolDraw;a.updateData(n),this.group.add(a.group);},updateTransform:function updateTransform(t,e,i){var n=t.getData();this.group.dirty();var a=Dp().reset(t);a.progress&&a.progress({start:0,end:n.count()},n),this._symbolDraw.updateLayout(n);},_updateGroupTransform:function _updateGroupTransform(t){var e=t.coordinateSystem;e&&e.getRoamTransform&&(this.group.transform=Ht(e.getRoamTransform()),this.group.decomposeTransform());},remove:function remove(t,e){this._symbolDraw&&this._symbolDraw.remove(e);},dispose:function dispose(){}}),jc(Tp("effectScatter","circle")),Uc(Dp("effectScatter"));var Aw="undefined"==typeof Uint32Array?Array:Uint32Array,Cw="undefined"==typeof Float64Array?Array:Float64Array;function Lw(t){var e=t.data;e&&e[0]&&e[0][0]&&e[0][0].coord&&(t.data=P(e,function(t){var e={coords:[t[0].coord,t[1].coord]};return t[0].name&&(e.fromName=t[0].name),t[1].name&&(e.toName=t[1].name),p([e,t[0],t[1]]);}));}var kw=Xh.extend({type:"series.lines",dependencies:["grid","polar"],visualColorAccessPath:"lineStyle.color",init:function init(t){t.data=t.data||[],Lw(t);var e=this._processFlatCoordsArray(t.data);this._flatCoords=e.flatCoords,this._flatCoordsOffset=e.flatCoordsOffset,e.flatCoords&&(t.data=new Float32Array(e.count)),kw.superApply(this,"init",arguments);},mergeOption:function mergeOption(t){if(t.data=t.data||[],Lw(t),t.data){var e=this._processFlatCoordsArray(t.data);this._flatCoords=e.flatCoords,this._flatCoordsOffset=e.flatCoordsOffset,e.flatCoords&&(t.data=new Float32Array(e.count));}kw.superApply(this,"mergeOption",arguments);},appendData:function appendData(t){var e=this._processFlatCoordsArray(t.data);e.flatCoords&&(this._flatCoords?(this._flatCoords=Q(this._flatCoords,e.flatCoords),this._flatCoordsOffset=Q(this._flatCoordsOffset,e.flatCoordsOffset)):(this._flatCoords=e.flatCoords,this._flatCoordsOffset=e.flatCoordsOffset),t.data=new Float32Array(e.count)),this.getRawData().appendData(t.data);},_getCoordsFromItemModel:function _getCoordsFromItemModel(t){var e=this.getData().getItemModel(t);return e.option instanceof Array?e.option:e.getShallow("coords");},getLineCoordsCount:function getLineCoordsCount(t){return this._flatCoordsOffset?this._flatCoordsOffset[2*t+1]:this._getCoordsFromItemModel(t).length;},getLineCoords:function getLineCoords(t,e){if(this._flatCoordsOffset){for(var i=this._flatCoordsOffset[2*t],n=this._flatCoordsOffset[2*t+1],a=0;a<n;a++){e[a]=e[a]||[],e[a][0]=this._flatCoords[i+2*a],e[a][1]=this._flatCoords[i+2*a+1];}return n;}var o=this._getCoordsFromItemModel(t);for(a=0;a<o.length;a++){e[a]=e[a]||[],e[a][0]=o[a][0],e[a][1]=o[a][1];}return o.length;},_processFlatCoordsArray:function _processFlatCoordsArray(t){var e=0;if(this._flatCoords&&(e=this._flatCoords.length),"number"==typeof t[0]){for(var i=t.length,n=new Aw(i),a=new Cw(i),o=0,r=0,s=0,l=0;l<i;){s++;var h=t[l++];n[r++]=o+e,n[r++]=h;for(var u=0;u<h;u++){var c=t[l++],d=t[l++];a[o++]=c,a[o++]=d;}}return{flatCoordsOffset:new Uint32Array(n.buffer,0,r),flatCoords:a,count:s};}return{flatCoordsOffset:null,flatCoords:null,count:t.length};},getInitialData:function getInitialData(t,e){var o=new pd(["value"],this);return o.hasItemOption=!1,o.initData(t.data,[],function(t,e,i,n){if(t instanceof Array)return NaN;o.hasItemOption=!0;var a=t.value;return null!=a?a instanceof Array?a[n]:a:void 0;}),o;},formatTooltip:function formatTooltip(t){var e=this.getData().getItemModel(t),i=e.get("name");if(i)return i;var n=e.get("fromName"),a=e.get("toName"),o=[];return null!=n&&o.push(n),null!=a&&o.push(a),al(o.join(" > "));},preventIncremental:function preventIncremental(){return!!this.get("effect.show");},getProgressive:function getProgressive(){var t=this.option.progressive;return null==t?this.option.large?1e4:this.get("progressive"):t;},getProgressiveThreshold:function getProgressiveThreshold(){var t=this.option.progressiveThreshold;return null==t?this.option.large?2e4:this.get("progressiveThreshold"):t;},defaultOption:{coordinateSystem:"geo",zlevel:0,z:2,legendHoverLink:!0,hoverAnimation:!0,xAxisIndex:0,yAxisIndex:0,symbol:["none","none"],symbolSize:[10,10],geoIndex:0,effect:{show:!1,period:4,constantSpeed:0,symbol:"circle",symbolSize:3,loop:!0,trailLength:.2},large:!1,largeThreshold:2e3,polyline:!1,label:{show:!1,position:"end"},lineStyle:{opacity:.5}}});function Pw(t,e,i){ii.call(this),this.add(this.createLine(t,e,i)),this._updateEffectSymbol(t,e);}var Nw=Pw.prototype;function Ow(t,e,i){ii.call(this),this._createPolyline(t,e,i);}Nw.createLine=function(t,e,i){return new Ey(t,e,i);},Nw._updateEffectSymbol=function(t,e){var i=t.getItemModel(e).getModel("effect"),n=i.get("symbolSize"),a=i.get("symbol");E(n)||(n=[n,n]);var o=i.get("color")||t.getItemVisual(e,"color"),r=this.childAt(1);this._symbolType!==a&&(this.remove(r),(r=Cf(a,-.5,-.5,1,1,o)).z2=100,r.culling=!0,this.add(r)),r&&(r.setStyle("shadowColor",o),r.setStyle(i.getItemStyle(["color"])),r.attr("scale",n),r.setColor(o),r.attr("scale",n),this._symbolType=a,this._updateEffectAnimation(t,i,e));},Nw._updateEffectAnimation=function(e,t,i){var n=this.childAt(1);if(n){var a=this,o=e.getItemLayout(i),r=1e3*t.get("period"),s=t.get("loop"),l=t.get("constantSpeed"),h=W(t.get("delay"),function(t){return t/e.count()*r/3;}),u="function"==typeof h;if(n.ignore=!0,this.updateAnimationPoints(n,o),0<l&&(r=this.getLineLength(n)/l*1e3),r!==this._period||s!==this._loop){n.stopAnimation();var c=h;u&&(c=h(i)),0<n.__t&&(c=-r*n.__t),n.__t=0;var d=n.animate("",s).when(r,{__t:1}).delay(c).during(function(){a.updateSymbolPosition(n);});s||d.done(function(){a.remove(n);}),d.start();}this._period=r,this._loop=s;}},Nw.getLineLength=function(t){return vt(t.__p1,t.__cp1)+vt(t.__cp1,t.__p2);},Nw.updateAnimationPoints=function(t,e){t.__p1=e[0],t.__p2=e[1],t.__cp1=e[2]||[(e[0][0]+e[1][0])/2,(e[0][1]+e[1][1])/2];},Nw.updateData=function(t,e,i){this.childAt(0).updateData(t,e,i),this._updateEffectSymbol(t,e);},Nw.updateSymbolPosition=function(t){var e=t.__p1,i=t.__p2,n=t.__cp1,a=t.__t,o=t.position,r=qa,s=Ka;o[0]=r(e[0],n[0],i[0],a),o[1]=r(e[1],n[1],i[1],a);var l=s(e[0],n[0],i[0],a),h=s(e[1],n[1],i[1],a);t.rotation=-Math.atan2(h,l)-Math.PI/2,t.ignore=!1;},Nw.updateLayout=function(t,e){this.childAt(0).updateLayout(t,e);var i=t.getItemModel(e).getModel("effect");this._updateEffectAnimation(t,i,e);},_(Pw,ii);var Ew=Ow.prototype;function Rw(t,e,i){Pw.call(this,t,e,i),this._lastFrame=0,this._lastFramePercent=0;}Ew._createPolyline=function(t,e,i){var n=t.getItemLayout(e),a=new _r({shape:{points:n}});this.add(a),this._updateCommonStl(t,e,i);},Ew.updateData=function(t,e,i){var n=t.hostModel;fs(this.childAt(0),{shape:{points:t.getItemLayout(e)}},n,e),this._updateCommonStl(t,e,i);},Ew._updateCommonStl=function(t,e,i){var n=this.childAt(0),a=t.getItemModel(e),o=t.getItemVisual(e,"color"),r=i&&i.lineStyle,s=i&&i.hoverLineStyle;i&&!t.hasItemOption||(r=a.getModel("lineStyle").getLineStyle(),s=a.getModel("emphasis.lineStyle").getLineStyle()),n.useStyle(C({strokeNoScale:!0,fill:"none",stroke:o},r)),n.hoverStyle=s,as(this);},Ew.updateLayout=function(t,e){this.childAt(0).setShape("points",t.getItemLayout(e));},_(Ow,ii);var zw=Rw.prototype;zw.createLine=function(t,e,i){return new Ow(t,e,i);},zw.updateAnimationPoints=function(t,e){this._points=e;for(var i=[0],n=0,a=1;a<e.length;a++){var o=e[a-1],r=e[a];n+=vt(o,r),i.push(n);}if(0!==n){for(a=0;a<i.length;a++){i[a]/=n;}this._offsets=i,this._length=n;}},zw.getLineLength=function(t){return this._length;},zw.updateSymbolPosition=function(t){var e=t.__t,i=this._points,n=this._offsets,a=i.length;if(n){var o=this._lastFrame;if(e<this._lastFramePercent){for(r=Math.min(o+1,a-1);0<=r&&!(n[r]<=e);r--){}r=Math.min(r,a-2);}else{for(var r=o;r<a&&!(n[r]>e);r++){}r=Math.min(r-1,a-2);}_t(t.position,i[r],i[r+1],(e-n[r])/(n[r+1]-n[r]));var s=i[r+1][0]-i[r][0],l=i[r+1][1]-i[r][1];t.rotation=-Math.atan2(l,s)-Math.PI/2,this._lastFrame=r,this._lastFramePercent=e,t.ignore=!1;}},_(Rw,Pw);var Bw=zr({shape:{polyline:!1,curveness:0,segs:[]},buildPath:function buildPath(t,e){var i=e.segs,n=e.curveness;if(e.polyline)for(var a=0;a<i.length;){var o=i[a++];if(0<o){t.moveTo(i[a++],i[a++]);for(var r=1;r<o;r++){t.lineTo(i[a++],i[a++]);}}}else for(a=0;a<i.length;){var s=i[a++],l=i[a++],h=i[a++],u=i[a++];if(t.moveTo(s,l),0<n){var c=(s+h)/2-(l-u)*n,d=(l+u)/2-(h-s)*n;t.quadraticCurveTo(c,d,h,u);}else t.lineTo(h,u);}},findDataIndex:function findDataIndex(t,e){var i=this.shape,n=i.segs,a=i.curveness;if(i.polyline)for(var o=0,r=0;r<n.length;){var s=n[r++];if(0<s)for(var l=n[r++],h=n[r++],u=1;u<s;u++){if(Do(l,h,c=n[r++],d=n[r++]))return o;}o++;}else for(o=0,r=0;r<n.length;){l=n[r++],h=n[r++];var c=n[r++],d=n[r++];if(0<a){if(Co(l,h,(l+c)/2-(h-d)*a,(h+d)/2-(c-l)*a,c,d))return o;}else if(Do(l,h,c,d))return o;o++;}return-1;}});function Vw(){this.group=new ii();}var Gw=Vw.prototype;Gw.isPersistent=function(){return!this._incremental;},Gw.updateData=function(t){this.group.removeAll();var e=new Bw({rectHover:!0,cursor:"default"});e.setShape({segs:t.getLayout("linesPoints")}),this._setCommon(e,t),this.group.add(e),this._incremental=null;},Gw.incrementalPrepareUpdate=function(t){this.group.removeAll(),this._clearIncremental(),5e5<t.count()?(this._incremental||(this._incremental=new kr({silent:!0})),this.group.add(this._incremental)):this._incremental=null;},Gw.incrementalUpdate=function(t,e){var i=new Bw();i.setShape({segs:e.getLayout("linesPoints")}),this._setCommon(i,e,!!this._incremental),this._incremental?this._incremental.addDisplayable(i,!0):(i.rectHover=!0,i.cursor="default",i.__startIndex=t.start,this.group.add(i));},Gw.remove=function(){this._clearIncremental(),this._incremental=null,this.group.removeAll();},Gw._setCommon=function(i,t,e){var n=t.hostModel;i.setShape({polyline:n.get("polyline"),curveness:n.get("lineStyle.curveness")}),i.useStyle(n.getModel("lineStyle").getLineStyle()),i.style.strokeNoScale=!0;var a=t.getVisual("color");a&&i.setStyle("stroke",a),i.setStyle("fill"),e||(i.seriesIndex=n.seriesIndex,i.on("mousemove",function(t){i.dataIndex=null;var e=i.findDataIndex(t.offsetX,t.offsetY);0<e&&(i.dataIndex=e+i.__startIndex);}));},Gw._clearIncremental=function(){var t=this._incremental;t&&t.clearDisplaybles();};var Ww={seriesType:"lines",plan:nu(),reset:function reset(g){var m=g.coordinateSystem,v=g.get("polyline"),y=g.pipelineContext.large;return{progress:function progress(t,e){var i=[];if(y){var n,a=t.end-t.start;if(v){for(var o=0,r=t.start;r<t.end;r++){o+=g.getLineCoordsCount(r);}n=new Float32Array(a+2*o);}else n=new Float32Array(2*a);var s=0,l=[];for(r=t.start;r<t.end;r++){var h=g.getLineCoords(r,i);v&&(n[s++]=h);for(var u=0;u<h;u++){l=m.dataToPoint(i[u],!1,l),n[s++]=l[0],n[s++]=l[1];}}e.setLayout("linesPoints",n);}else for(r=t.start;r<t.end;r++){var c=e.getItemModel(r),d=(h=g.getLineCoords(r,i),[]);if(v)for(var f=0;f<h;f++){d.push(m.dataToPoint(i[f]));}else{d[0]=m.dataToPoint(i[0]),d[1]=m.dataToPoint(i[1]);var p=c.get("lineStyle.curveness");+p&&(d[2]=[(d[0][0]+d[1][0])/2-(d[0][1]-d[1][1])*p,(d[0][1]+d[1][1])/2-(d[1][0]-d[0][0])*p]);}e.setItemLayout(r,d);}}};}};function Fw(t){return t instanceof Array||(t=[t,t]),t;}Jc({type:"lines",init:function init(){},render:function render(t,e,i){var n=t.getData(),a=this._updateLineDraw(n,t),o=t.get("zlevel"),r=t.get("effect.trailLength"),s=i.getZr(),l="svg"===s.painter.getType();l||s.painter.getLayer(o).clear(!0),null==this._lastZlevel||l||s.configLayer(this._lastZlevel,{motionBlur:!1}),this._showEffect(t)&&r&&(l||s.configLayer(o,{motionBlur:!0,lastFrameAlpha:Math.max(Math.min(r/10+.9,1),0)})),a.updateData(n),this._lastZlevel=o,this._finished=!0;},incrementalPrepareRender:function incrementalPrepareRender(t,e,i){var n=t.getData();this._updateLineDraw(n,t).incrementalPrepareUpdate(n),this._clearLayer(i),this._finished=!1;},incrementalRender:function incrementalRender(t,e,i){this._lineDraw.incrementalUpdate(t,e.getData()),this._finished=t.end===e.getData().count();},updateTransform:function updateTransform(t,e,i){var n=t.getData();if(!this._finished||t.pipelineContext.large)return{update:!0};var a=Ww.reset(t);a.progress&&a.progress({start:0,end:n.count()},n),this._lineDraw.updateLayout(),this._clearLayer(i);},_updateLineDraw:function _updateLineDraw(t,e){var i=this._lineDraw,n=this._showEffect(e),a=!!e.get("polyline"),o=e.pipelineContext.large;return i&&n===this._hasEffet&&a===this._isPolyline&&o===this._isLargeDraw||(i&&i.remove(),i=this._lineDraw=o?new Vw():new zy(a?n?Rw:Ow:n?Pw:Ey),this._hasEffet=n,this._isPolyline=a,this._isLargeDraw=o,this.group.removeAll()),this.group.add(i.group),i;},_showEffect:function _showEffect(t){return!!t.get("effect.show");},_clearLayer:function _clearLayer(t){var e=t.getZr();"svg"===e.painter.getType()||null==this._lastZlevel||e.painter.getLayer(this._lastZlevel).clear(!0);},remove:function remove(t,e){this._lineDraw&&this._lineDraw.remove(),this._lineDraw=null,this._clearLayer(e);},dispose:function dispose(){}});var Hw="lineStyle.opacity".split("."),Zw={seriesType:"lines",reset:function reset(t,e,i){var n=Fw(t.get("symbol")),a=Fw(t.get("symbolSize")),o=t.getData();return o.setVisual("fromSymbol",n&&n[0]),o.setVisual("toSymbol",n&&n[1]),o.setVisual("fromSymbolSize",a&&a[0]),o.setVisual("toSymbolSize",a&&a[1]),o.setVisual("opacity",t.get(Hw)),{dataEach:o.hasItemOption?function(t,e){var i=t.getItemModel(e),n=Fw(i.getShallow("symbol",!0)),a=Fw(i.getShallow("symbolSize",!0)),o=i.get(Hw);n[0]&&t.setItemVisual(e,"fromSymbol",n[0]),n[1]&&t.setItemVisual(e,"toSymbol",n[1]),a[0]&&t.setItemVisual(e,"fromSymbolSize",a[0]),a[1]&&t.setItemVisual(e,"toSymbolSize",a[1]),t.setItemVisual(e,"opacity",o);}:null};}};Uc(Ww),jc(Zw),Xh.extend({type:"series.heatmap",getInitialData:function getInitialData(t,e){return Ld(this.getSource(),this,{generateCoord:"value"});},preventIncremental:function preventIncremental(){var t=ah.get(this.get("coordinateSystem"));if(t&&t.dimensions)return"lng"===t.dimensions[0]&&"lat"===t.dimensions[1];},defaultOption:{coordinateSystem:"cartesian2d",zlevel:0,z:2,geoIndex:0,blurSize:30,pointSize:20,maxOpacity:1,minOpacity:0}});function Uw(){var t=y();this.canvas=t,this.blurSize=30,this.pointSize=20,this.maxOpacity=1,this.minOpacity=0,this._gradientPixels={};}Uw.prototype={update:function update(t,e,i,n,a,o){var r=this._getBrush(),s=this._getGradient(t,a,"inRange"),l=this._getGradient(t,a,"outOfRange"),h=this.pointSize+this.blurSize,u=this.canvas,c=u.getContext("2d"),d=t.length;u.width=e,u.height=i;for(var f=0;f<d;++f){var p=t[f],g=p[0],m=p[1],v=n(p[2]);c.globalAlpha=v,c.drawImage(r,g-h,m-h);}if(!u.width||!u.height)return u;for(var y=c.getImageData(0,0,u.width,u.height),x=y.data,_=0,w=x.length,b=this.minOpacity,S=this.maxOpacity-b;_<w;){v=x[_+3]/256;var M=4*Math.floor(255*v);if(0<v){var I=o(v)?s:l;0<v&&(v=v*S+b),x[_++]=I[M],x[_++]=I[M+1],x[_++]=I[M+2],x[_++]=I[M+3]*v*256;}else _+=4;}return c.putImageData(y,0,0),u;},_getBrush:function _getBrush(){var t=this._brushCanvas||(this._brushCanvas=y()),e=this.pointSize+this.blurSize,i=2*e;t.width=i,t.height=i;var n=t.getContext("2d");return n.clearRect(0,0,i,i),n.shadowOffsetX=i,n.shadowBlur=this.blurSize,n.shadowColor="#000",n.beginPath(),n.arc(-e,e,this.pointSize,0,2*Math.PI,!0),n.closePath(),n.fill(),t;},_getGradient:function _getGradient(t,e,i){for(var n=this._gradientPixels,a=n[i]||(n[i]=new Uint8ClampedArray(1024)),o=[0,0,0,0],r=0,s=0;s<256;s++){e[i](s/255,!0,o),a[r++]=o[0],a[r++]=o[1],a[r++]=o[2],a[r++]=o[3];}return a;}},Jc({type:"heatmap",render:function render(i,t,e){var n;t.eachComponent("visualMap",function(e){e.eachTargetSeries(function(t){t===i&&(n=e);});}),this.group.removeAll(),this._incrementalDisplayable=null;var a,o=i.coordinateSystem;"cartesian2d"===o.type||"calendar"===o.type?this._renderOnCartesianAndCalendar(i,e,0,i.getData().count()):"lng"===(a=o.dimensions)[0]&&"lat"===a[1]&&this._renderOnGeo(o,i,n,e);},incrementalPrepareRender:function incrementalPrepareRender(t,e,i){this.group.removeAll();},incrementalRender:function incrementalRender(t,e,i,n){e.coordinateSystem&&this._renderOnCartesianAndCalendar(e,n,t.start,t.end,!0);},_renderOnCartesianAndCalendar:function _renderOnCartesianAndCalendar(t,e,i,n,a){var o,r,s=t.coordinateSystem;if("cartesian2d"===s.type){var l=s.getAxis("x"),h=s.getAxis("y");o=l.getBandWidth(),r=h.getBandWidth();}for(var u=this.group,c=t.getData(),d="emphasis.itemStyle",f="emphasis.label",p=t.getModel("itemStyle").getItemStyle(["color"]),g=t.getModel(d).getItemStyle(),m=t.getModel("label"),v=t.getModel(f),y=s.type,x="cartesian2d"===y?[c.mapDimension("x"),c.mapDimension("y"),c.mapDimension("value")]:[c.mapDimension("time"),c.mapDimension("value")],_=i;_<n;_++){var w;if("cartesian2d"===y){if(isNaN(c.get(x[2],_)))continue;var b=s.dataToPoint([c.get(x[0],_),c.get(x[1],_)]);w=new wr({shape:{x:b[0]-o/2,y:b[1]-r/2,width:o,height:r},style:{fill:c.getItemVisual(_,"color"),opacity:c.getItemVisual(_,"opacity")}});}else{if(isNaN(c.get(x[1],_)))continue;w=new wr({z2:1,shape:s.dataToRect([c.get(x[0],_)]).contentShape,style:{fill:c.getItemVisual(_,"color"),opacity:c.getItemVisual(_,"opacity")}});}var S=c.getItemModel(_);c.hasItemOption&&(p=S.getModel("itemStyle").getItemStyle(["color"]),g=S.getModel(d).getItemStyle(),m=S.getModel("label"),v=S.getModel(f));var M=t.getRawValue(_),I="-";M&&null!=M[2]&&(I=M[2]),os(p,g,m,v,{labelFetcher:t,labelDataIndex:_,defaultText:I,isRectText:!0}),w.setStyle(p),as(w,c.hasItemOption?g:k({},g)),(w.incremental=a)&&(w.useHoverLayer=!0),u.add(w),c.setItemGraphicEl(_,w);}},_renderOnGeo:function _renderOnGeo(a,t,e,i){var n=e.targetVisuals.inRange,o=e.targetVisuals.outOfRange,r=t.getData(),s=this._hmLayer||this._hmLayer||new Uw();s.blurSize=t.get("blurSize"),s.pointSize=t.get("pointSize"),s.minOpacity=t.get("minOpacity"),s.maxOpacity=t.get("maxOpacity");var l=a.getViewRect().clone(),h=a.getRoamTransform();l.applyTransform(h);var u,c,d,f,p,g,m,v,y,x=Math.max(l.x,0),_=Math.max(l.y,0),w=Math.min(l.width+l.x,i.getWidth()),b=Math.min(l.height+l.y,i.getHeight()),S=w-x,M=b-_,I=[r.mapDimension("lng"),r.mapDimension("lat"),r.mapDimension("value")],T=r.mapArray(I,function(t,e,i){var n=a.dataToPoint([t,e]);return n[0]-=x,n[1]-=_,n.push(i),n;}),D=e.getExtent(),A="visualMap.continuous"===e.type?(m=D,v=e.option.range,y=m[1]-m[0],v=[(v[0]-m[0])/y,(v[1]-m[0])/y],function(t){return t>=v[0]&&t<=v[1];}):(u=D,c=e.getPieceList(),d=e.option.selected,f=u[1]-u[0],p=(c=P(c,function(t){return{interval:[(t.interval[0]-u[0])/f,(t.interval[1]-u[0])/f]};})).length,g=0,function(t){for(var e=g;e<p;e++){if((i=c[e].interval)[0]<=t&&t<=i[1]){g=e;break;}}if(e===p)for(e=g-1;0<=e;e--){var i;if((i=c[e].interval)[0]<=t&&t<=i[1]){g=e;break;}}return 0<=e&&e<p&&d[e];});s.update(T,S,M,n.color.getNormalizer(),{inRange:n.color.getColorMapper(),outOfRange:o.color.getColorMapper()},A);var C=new _n({style:{width:S,height:M,x:x,y:_,image:s.canvas},silent:!0});this.group.add(C);},dispose:function dispose(){}});var jw=Tg.extend({type:"series.pictorialBar",dependencies:["grid"],defaultOption:{symbol:"circle",symbolSize:null,symbolRotate:null,symbolPosition:null,symbolOffset:null,symbolMargin:null,symbolRepeat:!1,symbolRepeatDirection:"end",symbolClip:!1,symbolBoundingData:null,symbolPatternSize:400,barGap:"-100%",progressive:0,hoverAnimation:!1},getInitialData:function getInitialData(t){return t.stack=null,jw.superApply(this,"getInitialData",arguments);}}),Xw=["itemStyle","borderWidth"],Yw=[{xy:"x",wh:"width",index:0,posDesc:["left","right"]},{xy:"y",wh:"height",index:1,posDesc:["top","bottom"]}],qw=new ur();Jc({type:"pictorialBar",render:function render(t,e,i){var r=this.group,s=t.getData(),l=this._data,n=t.coordinateSystem,a=!!n.getBaseAxis().isHorizontal(),o=n.grid.getRect(),h={ecSize:{width:i.getWidth(),height:i.getHeight()},seriesModel:t,coordSys:n,coordSysExtent:[[o.x,o.x+o.width],[o.y,o.y+o.height]],isHorizontal:a,valueDim:Yw[+a],categoryDim:Yw[1-a]};return s.diff(l).add(function(t){if(s.hasValue(t)){var e=nb(s,t),i=Kw(s,t,e,h),n=sb(s,h,i);s.setItemGraphicEl(t,n),r.add(n),db(n,h,i);}}).update(function(t,e){var i=l.getItemGraphicEl(e);if(s.hasValue(t)){var n=nb(s,t),a=Kw(s,t,n,h),o=hb(s,a);i&&o!==i.__pictorialShapeStr&&(r.remove(i),s.setItemGraphicEl(t,null),i=null),i?function(t,e,i){var n=i.animationModel,a=i.dataIndex;fs(t.__pictorialBundle,{position:i.bundlePosition.slice()},n,a),i.symbolRepeat?Qw(t,e,i,!0):tb(t,e,i,!0);eb(t,i,!0),ib(t,e,i,!0);}(i,h,a):i=sb(s,h,a,!0),s.setItemGraphicEl(t,i),i.__pictorialSymbolMeta=a,r.add(i),db(i,h,a);}else r.remove(i);}).remove(function(t){var e=l.getItemGraphicEl(t);e&&lb(l,t,e.__pictorialSymbolMeta.animationModel,e);}).execute(),this._data=s,this.group;},dispose:tt,remove:function remove(e,t){var i=this.group,n=this._data;e.get("animation")?n&&n.eachItemGraphicEl(function(t){lb(n,t.dataIndex,e,t);}):i.removeAll();}});function Kw(t,e,i,n){var a=t.getItemLayout(e),o=i.get("symbolRepeat"),r=i.get("symbolClip"),s=i.get("symbolPosition")||"start",l=(i.get("symbolRotate")||0)*Math.PI/180||0,h=i.get("symbolPatternSize")||2,u=i.isAnimationEnabled(),c={dataIndex:e,layout:a,itemModel:i,symbolType:t.getItemVisual(e,"symbol")||"circle",color:t.getItemVisual(e,"color"),symbolClip:r,symbolRepeat:o,symbolRepeatDirection:i.get("symbolRepeatDirection"),symbolPatternSize:h,rotation:l,animationModel:u?i:null,hoverAnimation:u&&i.get("hoverAnimation"),z2:i.getShallow("z",!0)||0};!function(t,e,i,n,a){var o,r=n.valueDim,s=t.get("symbolBoundingData"),l=n.coordSys.getOtherAxis(n.coordSys.getBaseAxis()),h=l.toGlobalCoord(l.dataToCoord(0)),u=1-+(i[r.wh]<=0);if(E(s)){var c=[$w(l,s[0])-h,$w(l,s[1])-h];c[1]<c[0]&&c.reverse(),o=c[u];}else o=null!=s?$w(l,s)-h:e?n.coordSysExtent[r.index][u]-h:i[r.wh];a.boundingLength=o,e&&(a.repeatCutLength=i[r.wh]);a.pxSign=0<o?1:o<0?-1:0;}(i,o,a,n,c),function(t,e,i,n,a,o,r,s,l,h){var u=l.valueDim,c=l.categoryDim,d=Math.abs(i[c.wh]),f=t.getItemVisual(e,"symbolSize");E(f)?f=f.slice():(null==f&&(f="100%"),f=[f,f]);f[c.index]=Es(f[c.index],d),f[u.index]=Es(f[u.index],n?d:Math.abs(o)),h.symbolSize=f,(h.symbolScale=[f[0]/s,f[1]/s])[u.index]*=(l.isHorizontal?-1:1)*r;}(t,e,a,o,0,c.boundingLength,c.pxSign,h,n,c),function(t,e,i,n,a){var o=t.get(Xw)||0;o&&(qw.attr({scale:e.slice(),rotation:i}),qw.updateTransform(),o/=qw.getLineScale(),o*=e[n.valueDim.index]);a.valueLineWidth=o;}(i,c.symbolScale,l,n,c);var d=c.symbolSize,f=i.get("symbolOffset");return E(f)&&(f=[Es(f[0],d[0]),Es(f[1],d[1])]),function(t,e,i,n,a,o,r,s,l,h,u,c){var d=u.categoryDim,f=u.valueDim,p=c.pxSign,g=Math.max(e[f.index]+s,0),m=g;if(n){var v=Math.abs(l),y=W(t.get("symbolMargin"),"15%")+"",x=!1;y.lastIndexOf("!")===y.length-1&&(x=!0,y=y.slice(0,y.length-1)),y=Es(y,e[f.index]);var _=Math.max(g+2*y,0),w=x?0:2*y,b=$s(n),S=b?n:fb((v+w)/_),M=v-S*g;_=g+2*(y=M/2/(x?S:S-1)),w=x?0:2*y,b||"fixed"===n||(S=h?fb((Math.abs(h)+w)/_):0),m=S*_-w,c.repeatTimes=S,c.symbolMargin=y;}var I=p*(m/2),T=c.pathPosition=[];T[d.index]=i[d.wh]/2,T[f.index]="start"===r?I:"end"===r?l-I:l/2,o&&(T[0]+=o[0],T[1]+=o[1]);var D=c.bundlePosition=[];D[d.index]=i[d.xy],D[f.index]=i[f.xy];var A=c.barRectShape=k({},i);A[f.wh]=p*Math.max(Math.abs(i[f.wh]),Math.abs(T[f.index]+I)),A[d.wh]=i[d.wh];var C=c.clipShape={};C[d.xy]=-i[d.xy],C[d.wh]=u.ecSize[d.wh],C[f.xy]=0,C[f.wh]=i[f.wh];}(i,d,a,o,0,f,s,c.valueLineWidth,c.boundingLength,c.repeatCutLength,n,c),c;}function $w(t,e){return t.toGlobalCoord(t.dataToCoord(t.scale.parse(e)));}function Jw(t){var e=t.symbolPatternSize,i=Cf(t.symbolType,-e/2,-e/2,e,e,t.color);return i.attr({culling:!0}),"image"!==i.type&&i.setStyle({strokeNoScale:!0}),i;}function Qw(t,e,a,i){var n=t.__pictorialBundle,o=a.symbolSize,r=a.valueLineWidth,s=a.pathPosition,l=e.valueDim,h=a.repeatTimes||0,u=0,c=o[e.valueDim.index]+r+2*a.symbolMargin;for(ub(t,function(t){t.__pictorialAnimationIndex=u,t.__pictorialRepeatTimes=h,u<h?cb(t,null,p(u),a,i):cb(t,null,{scale:[0,0]},a,i,function(){n.remove(t);}),rb(t,a),u++;});u<h;u++){var d=Jw(a);d.__pictorialAnimationIndex=u,d.__pictorialRepeatTimes=h,n.add(d);var f=p(u);cb(d,{position:f.position,scale:[0,0]},{scale:f.scale,rotation:f.rotation},a,i),d.on("mouseover",g).on("mouseout",m),rb(d,a);}function p(t){var e=s.slice(),i=a.pxSign,n=t;return("start"===a.symbolRepeatDirection?0<i:i<0)&&(n=h-1-t),e[l.index]=c*(n-h/2+.5)+s[l.index],{position:e,scale:a.symbolScale.slice(),rotation:a.rotation};}function g(){ub(t,function(t){t.trigger("emphasis");});}function m(){ub(t,function(t){t.trigger("normal");});}}function tb(t,e,i,n){var a=t.__pictorialBundle,o=t.__pictorialMainPath;o?cb(o,null,{position:i.pathPosition.slice(),scale:i.symbolScale.slice(),rotation:i.rotation},i,n):(o=t.__pictorialMainPath=Jw(i),a.add(o),cb(o,{position:i.pathPosition.slice(),scale:[0,0],rotation:i.rotation},{scale:i.symbolScale.slice()},i,n),o.on("mouseover",function(){this.trigger("emphasis");}).on("mouseout",function(){this.trigger("normal");})),rb(o,i);}function eb(t,e,i){var n=k({},e.barRectShape),a=t.__pictorialBarRect;a?cb(a,null,{shape:n},e,i):(a=t.__pictorialBarRect=new wr({z2:2,shape:n,silent:!0,style:{stroke:"transparent",fill:"transparent",lineWidth:0}}),t.add(a));}function ib(t,e,i,n){if(i.symbolClip){var a=t.__pictorialClipPath,o=k({},i.clipShape),r=e.valueDim,s=i.animationModel,l=i.dataIndex;if(a)fs(a,{shape:o},s,l);else{o[r.wh]=0,a=new wr({shape:o}),t.__pictorialBundle.setClipPath(a),t.__pictorialClipPath=a;var h={};h[r.wh]=i.clipShape[r.wh],ws[n?"updateProps":"initProps"](a,{shape:h},s,l);}}}function nb(t,e){var i=t.getItemModel(e);return i.getAnimationDelayParams=ab,i.isAnimationEnabled=ob,i;}function ab(t){return{index:t.__pictorialAnimationIndex,count:t.__pictorialRepeatTimes};}function ob(){return this.parentModel.isAnimationEnabled()&&!!this.getShallow("animation");}function rb(t,e){t.off("emphasis").off("normal");var i=e.symbolScale.slice();e.hoverAnimation&&t.on("emphasis",function(){this.animateTo({scale:[1.1*i[0],1.1*i[1]]},400,"elasticOut");}).on("normal",function(){this.animateTo({scale:i.slice()},400,"elasticOut");});}function sb(t,e,i,n){var a=new ii(),o=new ii();return a.add(o),(a.__pictorialBundle=o).attr("position",i.bundlePosition.slice()),i.symbolRepeat?Qw(a,e,i):tb(a,0,i),eb(a,i,n),ib(a,e,i,n),a.__pictorialShapeStr=hb(t,i),a.__pictorialSymbolMeta=i,a;}function lb(t,e,i,n){var a=n.__pictorialBarRect;a&&(a.style.text=null);var o=[];ub(n,function(t){o.push(t);}),n.__pictorialMainPath&&o.push(n.__pictorialMainPath),n.__pictorialClipPath&&(i=null),z(o,function(t){fs(t,{scale:[0,0]},i,e,function(){n.parent&&n.parent.remove(n);});}),t.setItemGraphicEl(e,null);}function hb(t,e){return[t.getItemVisual(e.dataIndex,"symbol")||"none",!!e.symbolRepeat,!!e.symbolClip].join(":");}function ub(e,i,n){z(e.__pictorialBundle.children(),function(t){t!==e.__pictorialBarRect&&i.call(n,t);});}function cb(t,e,i,n,a,o){e&&t.attr(e),n.symbolClip&&!a?i&&t.attr(i):i&&ws[a?"updateProps":"initProps"](t,i,n.animationModel,n.dataIndex,o);}function db(t,e,i){var n=i.color,a=i.dataIndex,o=i.itemModel,r=o.getModel("itemStyle").getItemStyle(["color"]),s=o.getModel("emphasis.itemStyle").getItemStyle(),l=o.getShallow("cursor");ub(t,function(t){t.setColor(n),t.setStyle(C({fill:n,opacity:i.opacity},r)),as(t,s),l&&(t.cursor=l),t.z2=i.z2;});var h={},u=(e.valueDim.posDesc[+(0<i.boundingLength)],t.__pictorialBarRect);Dg(u.style,h,o,n,e.seriesModel,a),as(u,h);}function fb(t){var e=Math.round(t);return Math.abs(t-e)<1e-4?e:Math.ceil(t);}Uc(N(qd,"pictorialBar")),jc(Tp("pictorialBar","roundRect"));var pb=function pb(t,e,i,n,a){Wf.call(this,t,e,i),this.type=n||"value",this.position=a||"bottom",this.orient=null,this._labelInterval=null;};function gb(t,e,i){this.dimension="single",this.dimensions=["single"],this._axis=null,this._rect,this._init(t,e,i),this.model=t;}function mb(t,e){e=e||{};var i=t.coordinateSystem,n=t.axis,a={},o=n.position,r=n.orient,s=i.getRect(),l=[s.x,s.x+s.width,s.y,s.y+s.height],h={horizontal:{top:l[2],bottom:l[3]},vertical:{left:l[0],right:l[1]}};a.position=["vertical"===r?h.vertical[o]:l[0],"horizontal"===r?h.horizontal[o]:l[3]];a.rotation=Math.PI/2*{horizontal:0,vertical:1}[r];a.labelDirection=a.tickDirection=a.nameDirection={top:-1,bottom:1,right:1,left:-1}[o],t.get("axisTick.inside")&&(a.tickDirection=-a.tickDirection),W(e.labelInside,t.get("axisLabel.inside"))&&(a.labelDirection=-a.labelDirection);var u=e.rotate;return null==u&&(u=t.get("axisLabel.rotate")),a.labelRotation="top"===o?-u:u,a.labelInterval=n.getLabelInterval(),a.z2=1,a;}pb.prototype={constructor:pb,model:null,isHorizontal:function isHorizontal(){var t=this.position;return"top"===t||"bottom"===t;},pointToData:function pointToData(t,e){return this.coordinateSystem.pointToData(t,e)[0];},toGlobalCoord:null,toLocalCoord:null},_(pb,Wf),ah.register("single",{create:function create(n,a){var o=[];return n.eachComponent("singleAxis",function(t,e){var i=new gb(t,n,a);i.name="single_"+e,i.resize(t,a),t.coordinateSystem=i,o.push(i);}),n.eachSeries(function(t){if("singleAxis"===t.get("coordinateSystem")){var e=n.queryComponents({mainType:"singleAxis",index:t.get("singleAxisIndex"),id:t.get("singleAxisId")})[0];t.coordinateSystem=e&&e.coordinateSystem;}}),o;},dimensions:(gb.prototype={type:"singleAxis",axisPointerEnabled:!0,constructor:gb,_init:function _init(t,e,i){var n=this.dimension,a=new pb(n,mf(t),[0,0],t.get("type"),t.get("position")),o="category"===a.type;a.onBand=o&&t.get("boundaryGap"),a.inverse=t.get("inverse"),a.orient=t.get("orient"),(t.axis=a).model=t,(a.coordinateSystem=this)._axis=a;},update:function update(t,e){t.eachSeries(function(t){if(t.coordinateSystem===this){var e=t.getData();z(e.mapDimension(this.dimension,!0),function(t){this._axis.scale.unionExtentFromData(e,t);},this),gf(this._axis.scale,this._axis.model);}},this);},resize:function resize(t,e){this._rect=wl({left:t.get("left"),top:t.get("top"),right:t.get("right"),bottom:t.get("bottom"),width:t.get("width"),height:t.get("height")},{width:e.getWidth(),height:e.getHeight()}),this._adjustAxis();},getRect:function getRect(){return this._rect;},_adjustAxis:function _adjustAxis(){var t=this._rect,e=this._axis,i=e.isHorizontal(),n=i?[0,t.width]:[0,t.height],a=e.reverse?1:0;e.setExtent(n[a],n[1-a]),this._updateAxisTransform(e,i?t.x:t.y);},_updateAxisTransform:function _updateAxisTransform(t,e){var i=t.getExtent(),n=i[0]+i[1],a=t.isHorizontal();t.toGlobalCoord=a?function(t){return t+e;}:function(t){return n-t+e;},t.toLocalCoord=a?function(t){return t-e;}:function(t){return n-t+e;};},getAxis:function getAxis(){return this._axis;},getBaseAxis:function getBaseAxis(){return this._axis;},getAxes:function getAxes(){return[this._axis];},getTooltipAxes:function getTooltipAxes(){return{baseAxes:[this.getAxis()]};},containPoint:function containPoint(t){var e=this.getRect(),i=this.getAxis();return"horizontal"===i.orient?i.contain(i.toLocalCoord(t[0]))&&t[1]>=e.y&&t[1]<=e.y+e.height:i.contain(i.toLocalCoord(t[1]))&&t[0]>=e.y&&t[0]<=e.y+e.height;},pointToData:function pointToData(t){var e=this.getAxis();return[e.coordToData(e.toLocalCoord(t["horizontal"===e.orient?0:1]))];},dataToPoint:function dataToPoint(t){var e=this.getAxis(),i=this.getRect(),n=[],a="horizontal"===e.orient?0:1;return t instanceof Array&&(t=t[0]),n[a]=e.toGlobalCoord(e.dataToCoord(+t)),n[1-a]=0===a?i.y+i.height/2:i.x+i.width/2,n;}}).dimensions});var vb=tg.getInterval,yb=tg.ifIgnoreOnTick,xb=["axisLine","axisTickLabel","axisName"],_b="splitLine",wb=mg.extend({type:"singleAxis",axisPointerClass:"SingleAxisPointer",render:function render(t,e,i,n){var a=this.group;a.removeAll();var o=mb(t),r=new tg(t,o);z(xb,r.add,r),a.add(r.getGroup()),t.get(_b+".show")&&this["_"+_b](t,o.labelInterval),wb.superCall(this,"render",t,e,i,n);},_splitLine:function _splitLine(t,e){var i=t.axis;if(!i.scale.isBlank()){var n=t.getModel("splitLine"),a=n.getModel("lineStyle"),o=a.get("width"),r=a.get("color"),s=vb(n,e);r=r instanceof Array?r:[r];for(var l=t.coordinateSystem.getRect(),h=i.isHorizontal(),u=[],c=0,d=i.getTicksCoords(),f=[],p=[],g=t.get("axisLabel.showMinLabel"),m=t.get("axisLabel.showMaxLabel"),v=0;v<d.length;++v){if(!yb(i,v,s,d.length,g,m)){var y=i.toGlobalCoord(d[v]);h?(f[0]=y,f[1]=l.y,p[0]=y,p[1]=l.y+l.height):(f[0]=l.x,f[1]=y,p[0]=l.x+l.width,p[1]=y);var x=c++%r.length;u[x]=u[x]||[],u[x].push(new br(Hr({shape:{x1:f[0],y1:f[1],x2:p[0],y2:p[1]},style:{lineWidth:o},silent:!0})));}}for(v=0;v<u.length;++v){this.group.add(Wr(u[v],{style:{stroke:r[v%r.length],lineDash:a.getLineDash(o),lineWidth:o},silent:!0}));}}}}),bb=Cl.extend({type:"singleAxis",layoutMode:"box",axis:null,coordinateSystem:null,getCoordSysModel:function getCoordSysModel(){return this;}});g(bb.prototype,_f),zp("single",bb,function(t,e){return e.type||(e.data?"category":"value");},{left:"5%",top:"5%",right:"5%",bottom:"5%",type:"value",position:"bottom",orient:"horizontal",axisLine:{show:!0,lineStyle:{width:2,type:"solid"}},tooltip:{show:!0},axisTick:{show:!0,length:6,lineStyle:{width:2}},axisLabel:{show:!0,interval:"auto"},splitLine:{show:!0,lineStyle:{type:"dashed",opacity:.2}}});var Sb=function Sb(t,e){var i,n=[],a=t.seriesIndex;if(null==a||!(i=e.getSeriesByIndex(a)))return{point:[]};var o=i.getData(),r=pa(o,t);if(null==r||r<0||E(r))return{point:[]};var s=o.getItemGraphicEl(r),l=i.coordinateSystem;if(i.getTooltipPosition)n=i.getTooltipPosition(r)||[];else if(l&&l.dataToPoint)n=l.dataToPoint(o.getValues(P(l.dimensions,function(t){return o.mapDimension(t);}),r,!0))||[];else if(s){var h=s.getBoundingRect().clone();h.applyTransform(s.transform),n=[h.x+h.width/2,h.y+h.height/2];}return{point:n,el:s};},Mb=z,Ib=N,Tb=ga();function Db(t,e,i,n,a){var o=t.axis;if(!o.scale.isBlank()&&o.containData(e))if(t.involveSeries){var l,r,h,u,c,d,f,p,s=(l=e,h=(r=t).axis,u=h.dim,c=l,d=[],f=Number.MAX_VALUE,p=-1,Mb(r.seriesModels,function(e,t){var i,n,a=e.getData().mapDimension(u,!0);if(e.getAxisTooltipData){var o=e.getAxisTooltipData(a,l,h);n=o.dataIndices,i=o.nestestValue;}else{if(!(n=e.getData().indicesOfNearest(a[0],l,"category"===h.type?.5:null)).length)return;i=e.getData().get(a[0],n[0]);}if(null!=i&&isFinite(i)){var r=l-i,s=Math.abs(r);s<=f&&((s<f||0<=r&&p<0)&&(f=s,p=r,c=i,d.length=0),Mb(n,function(t){d.push({seriesIndex:e.seriesIndex,dataIndexInside:t,dataIndex:e.getData().getRawIndex(t)});}));}}),{payloadBatch:d,snapToValue:c}),g=s.payloadBatch,m=s.snapToValue;g[0]&&null==a.seriesIndex&&k(a,g[0]),!n&&t.snap&&o.containData(m)&&null!=m&&(e=m),i.showPointer(t,e,g,a),i.showTooltip(t,s,m);}else i.showPointer(t,e);}function Ab(t,e,i,n){t[e.key]={value:i,payloadBatch:n};}function Cb(t,e,i,n){var a=i.payloadBatch,o=e.axis,r=o.model,s=e.axisPointerModel;if(e.triggerTooltip&&a.length){var l=e.coordSys.model,h=gg(l),u=t.map[h];u||(u=t.map[h]={coordSysId:l.id,coordSysIndex:l.componentIndex,coordSysType:l.type,coordSysMainType:l.mainType,dataByAxis:[]},t.list.push(u)),u.dataByAxis.push({axisDim:o.dim,axisIndex:r.componentIndex,axisType:r.type,axisId:r.id,value:n,valueLabelOpt:{precision:s.get("label.precision"),formatter:s.get("label.formatter")},seriesDataIndices:a.slice()});}}function Lb(t){var e=t.axis.model,i={},n=i.axisDim=t.axis.dim;return i.axisIndex=i[n+"AxisIndex"]=e.componentIndex,i.axisName=i[n+"AxisName"]=e.name,i.axisId=i[n+"AxisId"]=e.id,i;}function kb(t){return!t||null==t[0]||isNaN(t[0])||null==t[1]||isNaN(t[1]);}qc({type:"axisPointer",coordSysAxesInfo:null,defaultOption:{show:"auto",triggerOn:null,zlevel:0,z:50,type:"line",snap:!1,triggerTooltip:!0,value:null,status:null,link:[],animation:null,animationDurationUpdate:200,lineStyle:{color:"#aaa",width:1,type:"solid"},shadowStyle:{color:"rgba(150,150,150,0.3)"},label:{show:!0,formatter:null,precision:"auto",margin:3,color:"#fff",padding:[5,7,5,7],backgroundColor:"auto",borderColor:null,borderWidth:0,shadowBlur:3,shadowColor:"#aaa"},handle:{show:!1,icon:"M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z",size:45,margin:50,color:"#333",shadowBlur:3,shadowColor:"#aaa",shadowOffsetX:0,shadowOffsetY:2,throttle:40}}});var Pb=ga(),Nb=z;function Ob(t,e,i){if(!v.node){var n=e.getZr();Pb(n).records||(Pb(n).records={}),function(s,l){if(Pb(s).initialized)return;function t(t,r){s.on(t,function(e){var i,n,_a2,o=(i=l,{dispatchAction:_a2=function a(t){var e=n[t.type];e?e.push(t):(t.dispatchAction=_a2,i.dispatchAction(t));},pendings:n={showTip:[],hideTip:[]}});Nb(Pb(s).records,function(t){t&&r(t,e,o.dispatchAction);}),function(t,e){var i,n=t.showTip.length,a=t.hideTip.length;n?i=t.showTip[n-1]:a&&(i=t.hideTip[a-1]);i&&(i.dispatchAction=null,e.dispatchAction(i));}(o.pendings,l);});}Pb(s).initialized=!0,t("click",N(Rb,"click")),t("mousemove",N(Rb,"mousemove")),t("globalout",Eb);}(n,e),(Pb(n).records[t]||(Pb(n).records[t]={})).handler=i;}}function Eb(t,e,i){t.handler("leave",null,i);}function Rb(t,e,i,n){e.handler(t,i,n);}function zb(t,e){if(!v.node){var i=e.getZr();(Pb(i).records||{})[t]&&(Pb(i).records[t]=null);}}var Bb=Kc({type:"axisPointer",render:function render(t,e,i){var n=e.getComponent("tooltip"),a=t.get("triggerOn")||n&&n.get("triggerOn")||"mousemove|click";Ob("axisPointer",i,function(t,e,i){"none"!==a&&("leave"===t||0<=a.indexOf(t))&&i({type:"updateAxisPointer",currTrigger:t,x:e&&e.offsetX,y:e&&e.offsetY});});},remove:function remove(t,e){zb(e.getZr(),"axisPointer"),Bb.superApply(this._model,"remove",arguments);},dispose:function dispose(t,e){zb("axisPointer",e),Bb.superApply(this._model,"dispose",arguments);}}),Vb=ga(),Gb=A,Wb=S;function Fb(){}function Hb(t,e,i,n){(function i(n,t){{if(R(n)&&R(t)){var a=!0;return z(t,function(t,e){a=a&&i(n[e],t);}),!!a;}return n===t;}})(Vb(i).lastProp,n)||(Vb(i).lastProp=n,e?fs(i,n,t):(i.stopAnimation(),i.attr(n)));}function Zb(t,e){t[e.get("label.show")?"show":"hide"]();}function Ub(t){return{position:t.position.slice(),rotation:t.rotation||0};}function jb(t,e,i){var n=e.get("z"),a=e.get("zlevel");t&&t.traverse(function(t){"group"!==t.type&&(null!=n&&(t.z=n),null!=a&&(t.zlevel=a),t.silent=i);});}function Xb(t){var e,i=t.get("type"),n=t.getModel(i+"Style");return"line"===i?(e=n.getLineStyle()).fill=null:"shadow"===i&&((e=n.getAreaStyle()).stroke=null),e;}function Yb(t,e,i,n,a){var o=qb(i.get("value"),e.axis,e.ecModel,i.get("seriesDataIndices"),{precision:i.get("label.precision"),formatter:i.get("label.formatter")}),r=i.getModel("label"),s=el(r.get("padding")||0),l=r.getFont(),h=Vi(o,l),u=a.position,c=h.width+s[1]+s[3],d=h.height+s[0]+s[2],f=a.align;"right"===f&&(u[0]-=c),"center"===f&&(u[0]-=c/2);var p,g,m,v,y,x,_=a.verticalAlign;"bottom"===_&&(u[1]-=d),"middle"===_&&(u[1]-=d/2),p=u,g=c,m=d,y=(v=n).getWidth(),x=v.getHeight(),p[0]=Math.min(p[0]+g,y)-g,p[1]=Math.min(p[1]+m,x)-m,p[0]=Math.max(p[0],0),p[1]=Math.max(p[1],0);var w=r.get("backgroundColor");w&&"auto"!==w||(w=e.get("axisLine.lineStyle.color")),t.label={shape:{x:0,y:0,width:c,height:d,r:r.get("borderRadius")},position:u.slice(),style:{text:o,textFont:l,textFill:r.getTextColor(),textPosition:"inside",fill:w,stroke:r.get("borderColor")||"transparent",lineWidth:r.get("borderWidth")||0,shadowBlur:r.get("shadowBlur"),shadowColor:r.get("shadowColor"),shadowOffsetX:r.get("shadowOffsetX"),shadowOffsetY:r.get("shadowOffsetY")},z2:10};}function qb(t,e,a,i,n){var o=e.scale.getLabel(t,{precision:n.precision}),r=n.formatter;if(r){var s={value:xf(e,t),seriesData:[]};z(i,function(t){var e=a.getSeriesByIndex(t.seriesIndex),i=t.dataIndexInside,n=e&&e.getDataParams(i);n&&s.seriesData.push(n);}),D(r)?o=r.replace("{value}",o):M(r)&&(o=r(s));}return o;}function Kb(t,e,i){var n=Et();return Gt(n,n,i.rotation),Vt(n,n,i.position),ms([t.dataToCoord(e),(i.labelOffset||0)+(i.labelDirection||1)*(i.labelMargin||0)],n);}function $b(t,e,i,n,a,o){var r=tg.innerTextLayout(i.rotation,0,i.labelDirection);i.labelMargin=a.get("label.margin"),Yb(e,n,a,o,{position:Kb(n.axis,t,i),align:r.textAlign,verticalAlign:r.textVerticalAlign});}function Jb(t,e,i){return{x1:t[i=i||0],y1:t[1-i],x2:e[i],y2:e[1-i]};}function Qb(t,e,i){return{x:t[i=i||0],y:t[1-i],width:e[i],height:e[1-i]};}function tS(t,e,i,n,a,o){return{cx:t,cy:e,r0:i,r:n,startAngle:a,endAngle:o,clockwise:!0};}Sa((Fb.prototype={_group:null,_lastGraphicKey:null,_handle:null,_dragging:!1,_lastValue:null,_lastStatus:null,_payloadInfo:null,animationThreshold:15,render:function render(t,e,i,n){var a=e.get("value"),o=e.get("status");if(this._axisModel=t,this._axisPointerModel=e,this._api=i,n||this._lastValue!==a||this._lastStatus!==o){this._lastValue=a,this._lastStatus=o;var r=this._group,s=this._handle;if(!o||"hide"===o)return r&&r.hide(),void(s&&s.hide());r&&r.show(),s&&s.show();var l={};this.makeElOption(l,a,t,e,i);var h=l.graphicKey;h!==this._lastGraphicKey&&this.clear(i),this._lastGraphicKey=h;var u=this._moveAnimation=this.determineAnimation(t,e);if(r){var c=N(Hb,e,u);this.updatePointerEl(r,l,c,e),this.updateLabelEl(r,l,c,e);}else r=this._group=new ii(),this.createPointerEl(r,l,t,e),this.createLabelEl(r,l,t,e),i.getZr().add(r);jb(r,e,!0),this._renderHandle(a);}},remove:function remove(t){this.clear(t);},dispose:function dispose(t){this.clear(t);},determineAnimation:function determineAnimation(t,e){var i=e.get("animation"),n=t.axis,a="category"===n.type,o=e.get("snap");if(!o&&!a)return!1;if("auto"===i||null==i){var r=this.animationThreshold;if(a&&n.getBandWidth()>r)return!0;if(o){var s=fg(t).seriesDataCount,l=n.getExtent();return Math.abs(l[0]-l[1])/s>r;}return!1;}return!0===i;},makeElOption:function makeElOption(t,e,i,n,a){},createPointerEl:function createPointerEl(t,e,i,n){var a=e.pointer;if(a){var o=Vb(t).pointerEl=new ws[a.type](Gb(e.pointer));t.add(o);}},createLabelEl:function createLabelEl(t,e,i,n){if(e.label){var a=Vb(t).labelEl=new wr(Gb(e.label));t.add(a),Zb(a,n);}},updatePointerEl:function updatePointerEl(t,e,i){var n=Vb(t).pointerEl;n&&(n.setStyle(e.pointer.style),i(n,{shape:e.pointer.shape}));},updateLabelEl:function updateLabelEl(t,e,i,n){var a=Vb(t).labelEl;a&&(a.setStyle(e.label.style),i(a,{shape:e.label.shape,position:e.label.position}),Zb(a,n));},_renderHandle:function _renderHandle(t){if(!this._dragging&&this.updateHandleTransform){var e,i=this._axisPointerModel,n=this._api.getZr(),a=this._handle,o=i.getModel("handle"),r=i.get("status");if(!o.get("show")||!r||"hide"===r)return a&&n.remove(a),void(this._handle=null);this._handle||(e=!0,a=this._handle=_s(o.get("icon"),{cursor:"move",draggable:!0,onmousemove:function onmousemove(t){Pn(t.event);},onmousedown:Wb(this._onHandleDragMove,this,0,0),drift:Wb(this._onHandleDragMove,this),ondragend:Wb(this._onHandleDragEnd,this)}),n.add(a)),jb(a,i,!1);a.setStyle(o.getItemStyle(null,["color","borderColor","borderWidth","opacity","shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY"]));var s=o.get("size");E(s)||(s=[s,s]),a.attr("scale",[s[0]/2,s[1]/2]),vu(this,"_doDispatchAxisPointer",o.get("throttle")||0,"fixRate"),this._moveHandleToValue(t,e);}},_moveHandleToValue:function _moveHandleToValue(t,e){Hb(this._axisPointerModel,!e&&this._moveAnimation,this._handle,Ub(this.getHandleTransform(t,this._axisModel,this._axisPointerModel)));},_onHandleDragMove:function _onHandleDragMove(t,e){var i=this._handle;if(i){this._dragging=!0;var n=this.updateHandleTransform(Ub(i),[t,e],this._axisModel,this._axisPointerModel);this._payloadInfo=n,i.stopAnimation(),i.attr(Ub(n)),Vb(i).lastProp=null,this._doDispatchAxisPointer();}},_doDispatchAxisPointer:function _doDispatchAxisPointer(){if(this._handle){var t=this._payloadInfo,e=this._axisModel;this._api.dispatchAction({type:"updateAxisPointer",x:t.cursorPoint[0],y:t.cursorPoint[1],tooltipOption:t.tooltipOption,axesInfo:[{axisDim:e.axis.dim,axisIndex:e.componentIndex}]});}},_onHandleDragEnd:function _onHandleDragEnd(t){if(this._dragging=!1,this._handle){var e=this._axisPointerModel.get("value");this._moveHandleToValue(e),this._api.dispatchAction({type:"hideTip"});}},getHandleTransform:null,updateHandleTransform:null,clear:function clear(t){this._lastValue=null,this._lastStatus=null;var e=t.getZr(),i=this._group,n=this._handle;e&&i&&(this._lastGraphicKey=null,i&&e.remove(i),n&&e.remove(n),this._group=null,this._handle=null,this._payloadInfo=null);},doClear:function doClear(){},buildLabel:function buildLabel(t,e,i){return{x:t[i=i||0],y:t[1-i],width:e[i],height:e[1-i]};}}).constructor=Fb);var eS=Fb.extend({makeElOption:function makeElOption(t,e,i,n,a){var o=i.axis,r=o.grid,s=n.get("type"),l=iS(r,o).getOtherAxis(o).getGlobalExtent(),h=o.toGlobalCoord(o.dataToCoord(e,!0));if(s&&"none"!==s){var u=Xb(n),c=nS[s](o,h,l,u);c.style=u,t.graphicKey=c.type,t.pointer=c;}$b(e,t,_g(r.model,i),i,n,a);},getHandleTransform:function getHandleTransform(t,e,i){var n=_g(e.axis.grid.model,e,{labelInside:!1});return n.labelMargin=i.get("handle.margin"),{position:Kb(e.axis,t,n),rotation:n.rotation+(n.labelDirection<0?Math.PI:0)};},updateHandleTransform:function updateHandleTransform(t,e,i,n){var a=i.axis,o=a.grid,r=a.getGlobalExtent(!0),s=iS(o,a).getOtherAxis(a).getGlobalExtent(),l="x"===a.dim?0:1,h=t.position;h[l]+=e[l],h[l]=Math.min(r[1],h[l]),h[l]=Math.max(r[0],h[l]);var u=(s[1]+s[0])/2,c=[u,u];c[l]=h[l];return{position:h,rotation:t.rotation,cursorPoint:c,tooltipOption:[{verticalAlign:"middle"},{align:"center"}][l]};}});function iS(t,e){var i={};return i[e.dim+"AxisIndex"]=e.index,t.getCartesian(i);}var nS={line:function line(t,e,i,n){var a=Jb([e,i[0]],[e,i[1]],aS(t));return Hr({shape:a,style:n}),{type:"Line",shape:a};},shadow:function shadow(t,e,i,n){var a=t.getBandWidth(),o=i[1]-i[0];return{type:"Rect",shape:Qb([e-a/2,i[0]],[a,o],aS(t))};}};function aS(t){return"x"===t.dim?0:1;}mg.registerAxisPointerClass("CartesianAxisPointer",eS),Wc(function(t){if(t){(!t.axisPointer||0===t.axisPointer.length)&&(t.axisPointer={});var e=t.axisPointer.link;e&&!E(e)&&(t.axisPointer.link=[e]);}}),Fc(tc.PROCESSOR.STATISTIC,function(t,e){t.getComponent("axisPointer").coordSysAxesInfo=cg(t,e);}),Hc({type:"updateAxisPointer",event:"updateAxisPointer",update:":updateAxisPointer"},function(t,e,i){var n=t.currTrigger,r=[t.x,t.y],a=t,o=t.dispatchAction||S(i.dispatchAction,i),s=e.getComponent("axisPointer").coordSysAxesInfo;if(s){kb(r)&&(r=Sb({seriesIndex:a.seriesIndex,dataIndex:a.dataIndex},e).point);var l=kb(r),h=a.axesInfo,u=s.axesInfo,c="leave"===n||kb(r),d={},f={},p={list:[],map:{}},g={showPointer:Ib(Ab,f),showTooltip:Ib(Cb,p)};Mb(s.coordSysMap,function(t,e){var o=l||t.containPoint(r);Mb(s.coordSysAxesInfo[e],function(t,e){var i=t.axis,n=function(t,e){for(var i=0;i<(t||[]).length;i++){var n=t[i];if(e.axis.dim===n.axisDim&&e.axis.model.componentIndex===n.axisIndex)return n;}}(h,t);if(!c&&o&&(!h||n)){var a=n&&n.value;null!=a||l||(a=i.pointToData(r)),null!=a&&Db(t,a,g,!1,d);}});});var m,v,y,x={};return Mb(u,function(a,t){var o=a.linkGroup;o&&!f[t]&&Mb(o.axesInfo,function(t,e){var i=f[e];if(t!==a&&i){var n=i.value;o.mapper&&(n=a.axis.scale.parse(o.mapper(n,Lb(t),Lb(a)))),x[a.key]=n;}});}),Mb(x,function(t,e){Db(u[e],t,g,!0,d);}),m=f,v=u,y=d.axesInfo=[],Mb(v,function(t,e){var i=t.axisPointerModel.option,n=m[e];n?(!t.useHandle&&(i.status="show"),i.value=n.value,i.seriesDataIndices=(n.payloadBatch||[]).slice()):!t.useHandle&&(i.status="hide"),"show"===i.status&&y.push({axisDim:t.axis.dim,axisIndex:t.axis.model.componentIndex,value:i.value});}),function(t,e,i,n){if(kb(e)||!t.list.length)return n({type:"hideTip"});var a=((t.list[0].dataByAxis[0]||{}).seriesDataIndices||[])[0]||{};n({type:"showTip",escapeConnect:!0,x:e[0],y:e[1],tooltipOption:i.tooltipOption,position:i.position,dataIndexInside:a.dataIndexInside,dataIndex:a.dataIndex,seriesIndex:a.seriesIndex,dataByCoordSys:t.list});}(p,r,t,o),function(t,e,i){var n=i.getZr(),a="axisPointerLastHighlights",o=Tb(n)[a]||{},r=Tb(n)[a]={};Mb(t,function(t,e){var i=t.axisPointerModel.option;"show"===i.status&&Mb(i.seriesDataIndices,function(t){var e=t.seriesIndex+" | "+t.dataIndex;r[e]=t;});});var s=[],l=[];z(o,function(t,e){!r[e]&&l.push(t);}),z(r,function(t,e){!o[e]&&s.push(t);}),l.length&&i.dispatchAction({type:"downplay",escapeConnect:!0,batch:l}),s.length&&i.dispatchAction({type:"highlight",escapeConnect:!0,batch:s});}(u,0,i),d;}});var oS=["x","y"],rS=["width","height"],sS=Fb.extend({makeElOption:function makeElOption(t,e,i,n,a){var o=i.axis,r=o.coordinateSystem,s=uS(r,1-hS(o)),l=r.dataToPoint(e)[0],h=n.get("type");if(h&&"none"!==h){var u=Xb(n),c=lS[h](o,l,s,u);c.style=u,t.graphicKey=c.type,t.pointer=c;}$b(e,t,mb(i),i,n,a);},getHandleTransform:function getHandleTransform(t,e,i){var n=mb(e,{labelInside:!1});return n.labelMargin=i.get("handle.margin"),{position:Kb(e.axis,t,n),rotation:n.rotation+(n.labelDirection<0?Math.PI:0)};},updateHandleTransform:function updateHandleTransform(t,e,i,n){var a=i.axis,o=a.coordinateSystem,r=hS(a),s=uS(o,r),l=t.position;l[r]+=e[r],l[r]=Math.min(s[1],l[r]),l[r]=Math.max(s[0],l[r]);var h=uS(o,1-r),u=(h[1]+h[0])/2,c=[u,u];return c[r]=l[r],{position:l,rotation:t.rotation,cursorPoint:c,tooltipOption:{verticalAlign:"middle"}};}}),lS={line:function line(t,e,i,n){var a=Jb([e,i[0]],[e,i[1]],hS(t));return Hr({shape:a,style:n}),{type:"Line",shape:a};},shadow:function shadow(t,e,i,n){var a=t.getBandWidth(),o=i[1]-i[0];return{type:"Rect",shape:Qb([e-a/2,i[0]],[a,o],hS(t))};}};function hS(t){return t.isHorizontal()?0:1;}function uS(t,e){var i=t.getRect();return[i[oS[e]],i[oS[e]]+i[rS[e]]];}mg.registerAxisPointerClass("SingleAxisPointer",sS),Kc({type:"single"});var cS=Xh.extend({type:"series.themeRiver",dependencies:["singleAxis"],nameMap:null,init:function init(t){cS.superApply(this,"init",arguments),this.legendDataProvider=function(){return this.getRawData();};},fixData:function fixData(t){for(var e=t.length,i=P(O_().key(function(t){return t[2];}).entries(t),function(t){return{name:t.key,dataList:t.values};}),n=i.length,a=-1,o=-1,r=0;r<n;++r){var s=i[r].dataList.length;a<s&&(a=s,o=r);}for(var l=0;l<n;++l){if(l!==o)for(var h=i[l].name,u=0;u<a;++u){for(var c=i[o].dataList[u][0],d=i[l].dataList.length,f=-1,p=0;p<d;++p){if(i[l].dataList[p][0]===c){f=p;break;}}-1===f&&(t[e]=[],t[e][0]=c,t[e][1]=0,t[e][2]=h,e++);}}return t;},getInitialData:function getInitialData(t,e){for(var i=e.queryComponents({mainType:"singleAxis",index:this.get("singleAxisIndex"),id:this.get("singleAxisId")})[0].get("type"),n=T(t.data,function(t){return void 0!==t[2];}),a=this.fixData(n||[]),o=[],r=this.nameMap=J(),s=0,l=0;l<a.length;++l){o.push(a[l][2]),r.get(a[l][2])||(r.set(a[l][2],s),s++);}var h=Dd(a,{coordDimensions:["single"],dimensionsDefine:[{name:"time",type:ad(i)},{name:"value",type:"float"},{name:"name",type:"ordinal"}],encodeDefine:{single:0,value:1,itemName:2}}),u=new pd(h,this);return u.initData(a),u;},getLayerSeries:function getLayerSeries(){for(var i=this.getData(),t=i.count(),e=[],n=0;n<t;++n){e[n]=n;}for(var a=P(O_().key(function(t){return i.get("name",t);}).entries(e),function(t){return{name:t.key,indices:t.values};}),o=i.mapDimension("single"),r=0;r<a.length;++r){a[r].indices.sort(s);}function s(t,e){return i.get(o,t)-i.get(o,e);}return a;},getAxisTooltipData:function getAxisTooltipData(t,e,i){E(t)||(t=t?[t]:[]);for(var n,a=this.getData(),o=this.getLayerSeries(),r=[],s=o.length,l=0;l<s;++l){for(var h=Number.MAX_VALUE,u=-1,c=o[l].indices.length,d=0;d<c;++d){var f=a.get(t[0],o[l].indices[d]),p=Math.abs(f-e);p<=h&&(n=f,h=p,u=o[l].indices[d]);}r.push(u);}return{dataIndices:r,nestestValue:n};},formatTooltip:function formatTooltip(t){var e=this.getData(),i=e.getName(t),n=e.get(e.mapDimension("value"),t);return(isNaN(n)||null==n)&&(n="-"),al(i+" : "+n);},defaultOption:{zlevel:0,z:2,coordinateSystem:"singleAxis",boundaryGap:["10%","10%"],singleAxisIndex:0,animationEasing:"linear",label:{margin:4,textAlign:"right",show:!0,position:"left",color:"#000",fontSize:11},emphasis:{label:{show:!0}}}});Jc({type:"themeRiver",init:function init(){this._layers=[];},render:function render(T,t,e){var D=T.getData(),A=this.group,C=T.getLayerSeries(),i=D.getLayout("layoutInfo"),n=i.rect,a=i.boundaryGap;function o(t){return t.name;}A.attr("position",[0,n.y+a[0]]);var r=new ed(this._layersSeries||[],C,o,o),L={};function s(t,e,i){var n=this._layers;if("remove"!==t){for(var a,o,r,s=[],l=[],h=C[e].indices,u=0;u<h.length;u++){var c=D.getItemLayout(h[u]),d=c.x,f=c.y0,p=c.y;s.push([d,f]),l.push([d,f+p]),a=D.getItemVisual(h[u],"color");}var g,m,v,y,x=D.getItemLayout(h[0]),_=D.getItemModel(h[u-1]),w=_.getModel("label"),b=w.get("margin");if("add"===t){var S=L[e]=new ii();o=new _p({shape:{points:s,stackedOnPoints:l,smooth:.4,stackedOnSmooth:.4,smoothConstraint:!1},z2:0}),r=new hr({style:{x:x.x-b,y:x.y0+x.y/2}}),S.add(o),S.add(r),A.add(S),o.setClipPath((g=o.getBoundingRect(),m=T,v=function v(){o.removeClipPath();},ps(y=new wr({shape:{x:g.x-10,y:g.y-10,width:0,height:g.height+20}}),{shape:{width:g.width+20,height:g.height+20}},m,v),y));}else{S=n[i];o=S.childAt(0),r=S.childAt(1),A.add(S),L[e]=S,fs(o,{shape:{points:s,stackedOnPoints:l}},T),fs(r,{style:{x:x.x-b,y:x.y0+x.y/2}},T);}var M=_.getModel("emphasis.itemStyle"),I=_.getModel("itemStyle");rs(r.style,w,{text:w.get("show")?T.getFormattedLabel(h[u-1],"normal")||D.getName(h[u-1]):null,textVerticalAlign:"middle"}),o.setStyle(k({fill:a},I.getItemStyle(["color"]))),as(o,M.getItemStyle());}else A.remove(n[e]);}r.add(S(s,this,"add")).update(S(s,this,"update")).remove(S(s,this,"remove")).execute(),this._layersSeries=C,this._layers=L;},dispose:function dispose(){}});function dS(i,t,e){if(i.count())for(var n,a=t.coordinateSystem,o=t.getLayerSeries(),r=i.mapDimension("single"),s=i.mapDimension("value"),l=P(o,function(t){return P(t.indices,function(t){var e=a.dataToPoint(i.get(r,t));return e[1]=i.get(s,t),e;});}),h=function(t){for(var e=t.length,i=t[0].length,n=[],a=[],o=0,r={},s=0;s<i;++s){for(var l=0,h=0;l<e;++l){h+=t[l][s][1];}o<h&&(o=h),n.push(h);}for(var u=0;u<i;++u){a[u]=(o-n[u])/2;}for(var c=o=0;c<i;++c){var d=n[c]+a[c];o<d&&(o=d);}return r.y0=a,r.max=o,r;}(l),u=h.y0,c=e/h.max,d=o.length,f=o[0].indices.length,p=0;p<f;++p){n=u[p]*c,i.setItemLayout(o[0].indices[p],{layerIndex:0,x:l[0][p][0],y0:n,y:l[0][p][1]*c});for(var g=1;g<d;++g){n+=l[g-1][p][1]*c,i.setItemLayout(o[g].indices[p],{layerIndex:g,x:l[g][p][0],y0:n,y:l[g][p][1]*c});}}}Uc(function(t,e){t.eachSeriesByType("themeRiver",function(t){var e=t.getData(),i=t.coordinateSystem,n={},a=i.getRect();n.rect=a;var o=t.get("boundaryGap"),r=i.getAxis();n.boundaryGap=o,"horizontal"===r.orient?(o[0]=Es(o[0],a.height),o[1]=Es(o[1],a.height),dS(e,t,a.height-o[0]-o[1])):(o[0]=Es(o[0],a.width),o[1]=Es(o[1],a.width),dS(e,t,a.width-o[0]-o[1])),e.setLayout("layoutInfo",n);});}),jc(function(t){t.eachSeriesByType("themeRiver",function(a){var o=a.getData(),r=a.getRawData(),s=a.get("color"),l=J();o.each(function(t){l.set(o.getRawIndex(t),t);}),r.each(function(t){var e=r.getName(t),i=s[(a.nameMap.get(e)-1)%s.length];r.setItemVisual(t,"color",i);var n=l.get(t);null!=n&&o.setItemVisual(n,"color",i);});});}),Fc(qg("themeRiver")),Xh.extend({type:"series.sunburst",_viewRoot:null,getInitialData:function getInitialData(t,e){var i={name:t.name,children:t.data};!function i(t){var n=0;z(t.children,function(t){i(t);var e=t.value;E(e)&&(e=e[0]),n+=e;});var e=t.value;E(e)&&(e=e[0]);(null==e||isNaN(e))&&(e=n);e<0&&(e=0);E(t.value)?t.value[0]=e:t.value=e;}(i);var n=t.levels||[],a={};return a.levels=n,Qm.createTree(i,this,a).data;},optionUpdated:function optionUpdated(){this.resetViewRoot();},getDataParams:function getDataParams(t){var e=Xh.prototype.getDataParams.apply(this,arguments),i=this.getData().tree.getNodeByDataIndex(t);return e.treePathInfo=yv(i,this),e;},defaultOption:{zlevel:0,z:2,center:["50%","50%"],radius:[0,"75%"],clockwise:!0,startAngle:90,minAngle:0,percentPrecision:2,stillShowZeroSum:!0,highlightPolicy:"descendant",nodeClick:"rootToNode",renderLabelForZeroData:!1,label:{rotate:"radial",show:!0,opacity:1,align:"center",position:"inside",distance:5,silent:!0,emphasis:{}},itemStyle:{borderWidth:1,borderColor:"white",opacity:1,emphasis:{},highlight:{opacity:1},downplay:{opacity:.9}},animationType:"expansion",animationDuration:1e3,animationDurationUpdate:500,animationEasing:"cubicOut",data:[],levels:[],sort:"desc"},getViewRoot:function getViewRoot(){return this._viewRoot;},resetViewRoot:function resetViewRoot(t){t?this._viewRoot=t:t=this._viewRoot;var e=this.getRawData().tree.root;t&&(t===e||e.contains(t))||(this._viewRoot=e);}});var fS={NONE:"none",DESCENDANT:"descendant",ANCESTOR:"ancestor",SELF:"self"},pS=2,gS=4;function mS(t,e,i){ii.call(this);var n=new fr({z2:pS}),a=new hr({z2:gS,silent:t.getModel("label").get("silent")});function o(){a.ignore=a.hoverIgnore;}function r(){a.ignore=a.normalIgnore;}this.add(n),this.add(a),this.updateData(!0,t,"normal",e,i),this.on("emphasis",o).on("normal",r).on("mouseover",o).on("mouseout",r);}var vS=mS.prototype;vS.updateData=function(t,e,i,n,a){(this.node=e).piece=this,n=n||this._seriesModel,a=a||this._ecModel;var o=this.childAt(0);o.dataIndex=e.dataIndex;var r=e.getModel(),s=e.getLayout(),l=k({},s);l.label=null;var h,u=function(t,e,i){var n=t.getVisual("color"),a=t.getVisual("visualMeta");a&&0!==a.length||(n=null);var o=t.getModel("itemStyle").get("color");{if(o)return o;if(n)return n;if(0===t.depth)return i.option.color[0];var r=i.option.color.length;o=i.option.color[function(t){var e=t;for(;1<e.depth;){e=e.parentNode;}return L(t.getAncestors()[0].children,e);}(t)%r];}return o;}(e,0,a),c=r.getModel("itemStyle").getItemStyle();"normal"===i?h=c:h=g(r.getModel(i+".itemStyle").getItemStyle(),c);h=C({lineJoin:"bevel",fill:h.fill||u},h),t?(o.setShape(l),o.shape.r=s.r0,fs(o,{shape:{r:s.r}},n,e.dataIndex),o.useStyle(h)):"object"==_typeof(h.fill)&&h.fill.type||"object"==_typeof(o.style.fill)&&o.style.fill.type?(fs(o,{shape:l},n),o.useStyle(h)):fs(o,{shape:l,style:h},n),this._updateLabel(n,u,i);var d=r.getShallow("cursor");if(d&&o.attr("cursor",d),t){var f=n.getShallow("highlightPolicy");this._initEvents(o,e,n,f);}this._seriesModel=n||this._seriesModel,this._ecModel=a||this._ecModel;},vS.onEmphasis=function(a){var o=this;this.node.hostTree.root.eachNode(function(t){var e,i,n;t.piece&&(o.node===t?t.piece.updateData(!1,t,"emphasis"):(e=t,i=o.node,(n=a)!==fS.NONE&&(n===fS.SELF?e===i:n===fS.ANCESTOR?e===i||e.isAncestorOf(i):e===i||e.isDescendantOf(i))?t.piece.childAt(0).trigger("highlight"):a!==fS.NONE&&t.piece.childAt(0).trigger("downplay")));});},vS.onNormal=function(){this.node.hostTree.root.eachNode(function(t){t.piece&&t.piece.updateData(!1,t,"normal");});},vS.onHighlight=function(){this.updateData(!1,this.node,"highlight");},vS.onDownplay=function(){this.updateData(!1,this.node,"downplay");},vS._updateLabel=function(t,e,i){var n=this.node.getModel(),a=n.getModel("label"),o="normal"===i||"emphasis"===i?a:n.getModel(i+".label"),r=n.getModel("emphasis.label"),s=W(t.getFormattedLabel(this.node.dataIndex,"normal",null,null,"label"),this.node.name);!1===S("show")&&(s="");var l=this.node.getLayout(),h=o.get("minAngle");null==h&&(h=a.get("minAngle")),h=h/180*Math.PI;var u=l.endAngle-l.startAngle;null!=h&&Math.abs(u)<h&&(s="");var c=this.childAt(1);os(c.style,c.hoverStyle||{},a,r,{defaultText:o.getShallow("show")?s:null,autoColor:e,useInsideStyle:!0});var d,f=(l.startAngle+l.endAngle)/2,p=Math.cos(f),g=Math.sin(f),m=S("position"),v=S("distance")||0,y=S("align");"outside"===m?(d=l.r+v,y=f>Math.PI/2?"right":"left"):y&&"center"!==y?"left"===y?(d=l.r0+v,f>Math.PI/2&&(y="right")):"right"===y&&(d=l.r-v,f>Math.PI/2&&(y="left")):(d=(l.r+l.r0)/2,y="center"),c.attr("style",{text:s,textAlign:y,textVerticalAlign:S("verticalAlign")||"middle",opacity:S("opacity")});var x=d*p+l.cx,_=d*g+l.cy;c.attr("position",[x,_]);var w=S("rotate"),b=0;function S(t){var e=o.get(t);return null==e?a.get(t):e;}"radial"===w?(b=-f)<-Math.PI/2&&(b+=Math.PI):"tangential"===w?(b=Math.PI/2-f)>Math.PI/2?b-=Math.PI:b<-Math.PI/2&&(b+=Math.PI):"number"==typeof w&&(b=w*Math.PI/180),c.attr("rotation",b);},vS._initEvents=function(t,e,i,n){t.off("mouseover").off("mouseout").off("emphasis").off("normal");var a=this,o=function o(){a.onEmphasis(n);},r=function r(){a.onNormal();};i.isAnimationEnabled()&&t.on("mouseover",o).on("mouseout",r).on("emphasis",o).on("normal",r).on("downplay",function(){a.onDownplay();}).on("highlight",function(){a.onHighlight();});},_(mS,ii);ru.extend({type:"sunburst",init:function init(){},render:function render(r,s,t,e){var n=this;this.seriesModel=r,this.api=t,this.ecModel=s;var l=r.getData(),h=l.tree.root,i=r.getViewRoot(),u=this.group,c=r.get("renderLabelForZeroData"),a=[];i.eachNode(function(t){a.push(t);});var o=this._oldChildren||[];if(function(a,o){if(0===a.length&&0===o.length)return;function t(t){return t.getId();}function e(t,e){var i=null==t?null:a[t],n=null==e?null:o[e];!function(t,e){c||!t||t.getValue()||(t=null);if(t!==h&&e!==h)if(e&&e.piece)t?(e.piece.updateData(!1,t,"normal",r,s),l.setItemGraphicEl(t.dataIndex,e.piece)):function(t){if(!t)return;t.piece&&(u.remove(t.piece),t.piece=null);}(e);else if(t){var i=new mS(t,r,s);u.add(i),l.setItemGraphicEl(t.dataIndex,i);}}(i,n);}new ed(o,a,t,t).add(e).update(e).remove(N(e,null)).execute();}(a,o),function(t,e){if(0<e.depth){t.piece?t.piece.updateData(!1,t,"normal",r,s):(t.piece=new mS(t,r,s),u.add(t.piece)),e.piece._onclickEvent&&e.piece.off("click",e.piece._onclickEvent);var i=function i(t){n._rootToNode(e.parentNode);};e.piece._onclickEvent=i,t.piece.on("click",i);}else t.piece&&(u.remove(t.piece),t.piece=null);}(h,i),e&&e.highlight&&e.highlight.piece){var d=r.getShallow("highlightPolicy");e.highlight.piece.onEmphasis(d);}else if(e&&e.unhighlight){var f=h.piece;!f&&h.children.length&&(f=h.children[0].piece),f&&f.onNormal();}this._initEvents(),this._oldChildren=a;},dispose:function dispose(){},_initEvents:function _initEvents(){var s=this,t=function t(o){var r=!1;s.seriesModel.getViewRoot().eachNode(function(t){if(!r&&t.piece&&t.piece.childAt(0)===o.target){var e=t.getModel().get("nodeClick");if("rootToNode"===e)s._rootToNode(t);else if("link"===e){var i=t.getModel(),n=i.get("link");if(n){var a=i.get("target",!0)||"_blank";window.open(n,a);}}r=!0;}});};this.group._onclickEvent&&this.group.off("click",this.group._onclickEvent),this.group.on("click",t),this.group._onclickEvent=t;},_rootToNode:function _rootToNode(t){t!==this.seriesModel.getViewRoot()&&this.api.dispatchAction({type:"sunburstRootToNode",from:this.uid,seriesId:this.seriesModel.id,targetNode:t});},containPoint:function containPoint(t,e){var i=e.getData().getItemLayout(0);if(i){var n=t[0]-i.cx,a=t[1]-i.cy,o=Math.sqrt(n*n+a*a);return o<=i.r&&o>=i.r0;}}});var yS="sunburstRootToNode";Hc({type:yS,update:"updateView"},function(a,t){t.eachComponent({mainType:"series",subType:"sunburst",query:a},function(t,e){var i=gv(a,[yS],t);if(i){var n=t.getViewRoot();n&&(a.direction=vv(n,i.node)?"rollUp":"drillDown"),t.resetViewRoot(i.node);}});});var xS="sunburstHighlight";Hc({type:xS,update:"updateView"},function(n,t){t.eachComponent({mainType:"series",subType:"sunburst",query:n},function(t,e){var i=gv(n,[xS],t);i&&(n.highlight=i.node);});});Hc({type:"sunburstUnhighlight",update:"updateView"},function(i,t){t.eachComponent({mainType:"series",subType:"sunburst",query:i},function(t,e){i.unhighlight=!0;});});var _S=Math.PI/180;function wS(o,r){return r=r||[0,0],P(["x","y"],function(t,e){var i=this.getAxis(t),n=r[e],a=o[e]/2;return"category"===i.type?i.getBandWidth():Math.abs(i.dataToCoord(n-a)-i.dataToCoord(n+a));},this);}jc(N(Zg,"sunburst")),Uc(N(function(t,e,C,i){e.eachSeriesByType(t,function(t){var e=t.get("center"),i=t.get("radius");E(i)||(i=[0,i]),E(e)||(e=[e,e]);var n=C.getWidth(),a=C.getHeight(),u=Math.min(n,a),c=Es(e[0],n),d=Es(e[1],a),f=Es(i[0],u/2),o=Es(i[1],u/2),r=-t.get("startAngle")*_S,p=t.get("minAngle")*_S,g=t.getData().tree.root,s=t.getViewRoot(),m=s.depth,l=t.get("sort");null!=l&&function e(t,i){var n=t.children||[];t.children=function(t,e){if("function"==typeof e)return t.sort(e);var n="asc"===e;return t.sort(function(t,e){var i=(t.getValue()-e.getValue())*(n?1:-1);return 0===i?(t.dataIndex-e.dataIndex)*(n?-1:1):i;});}(n,i),n.length&&z(t.children,function(t){e(t,i);});}(s,l);var h=0;z(s.children,function(t){!isNaN(t.getValue())&&h++;});var v=s.getValue(),y=Math.PI/(v||h)*2,x=0<s.depth,_=s.height-(x?-1:1),w=(o-f)/(_||1),b=t.get("clockwise"),S=t.get("stillShowZeroSum"),M=b?1:-1,I=function I(t,e){if(t){var i=e;if(t!==g){var n=t.getValue(),a=0===v&&S?y:n*y;a<p&&(a=p),i=e+M*a;var o=t.depth-m-(x?-1:1),r=f+w*o,s=f+w*(o+1),l=t.getModel();null!=l.get("r0")&&(r=Es(l.get("r0"),u/2)),null!=l.get("r")&&(s=Es(l.get("r"),u/2)),t.setLayout({angle:a,startAngle:e,endAngle:i,clockwise:b,cx:c,cy:d,r0:r,r:s});}if(t.children&&t.children.length){var h=0;z(t.children,function(t){h+=I(t,e+h);});}return i-e;}};if(x){var T=f,D=f+w,A=2*Math.PI;g.setLayout({angle:A,startAngle:r,endAngle:r+A,clockwise:b,cx:c,cy:d,r0:T,r:D});}I(s,r);});},"sunburst")),Fc(N(qg,"sunburst"));function bS(o,r){return r=r||[0,0],P([0,1],function(t){var e=r[t],i=o[t]/2,n=[],a=[];return n[t]=e-i,a[t]=e+i,n[1-t]=a[1-t]=r[1-t],Math.abs(this.dataToPoint(n)[t]-this.dataToPoint(a)[t]);},this);}function SS(t,e){var i=this.getAxis(),n=e instanceof Array?e[0]:e,a=(t instanceof Array?t[0]:t)/2;return"category"===i.type?i.getBandWidth():Math.abs(i.dataToCoord(n-a)-i.dataToCoord(n+a));}function MS(s,l){return P(["Radius","Angle"],function(t,e){var i=this["get"+t+"Axis"](),n=l[e],a=s[e]/2,o="dataTo"+t,r="category"===i.type?i.getBandWidth():Math.abs(i[o](n-a)-i[o](n+a));return"Angle"===t&&(r=r*Math.PI/180),r;},this);}var IS=["itemStyle"],TS=["emphasis","itemStyle"],DS=["label"],AS=["emphasis","label"],CS="e\0\0",LS={cartesian2d:function cartesian2d(e){var t=e.grid.getRect();return{coordSys:{type:"cartesian2d",x:t.x,y:t.y,width:t.width,height:t.height},api:{coord:function coord(t){return e.dataToPoint(t);},size:S(wS,e)}};},geo:function geo(e){var t=e.getBoundingRect();return{coordSys:{type:"geo",x:t.x,y:t.y,width:t.width,height:t.height},api:{coord:function coord(t){return e.dataToPoint(t);},size:S(bS,e)}};},singleAxis:function singleAxis(e){var t=e.getRect();return{coordSys:{type:"singleAxis",x:t.x,y:t.y,width:t.width,height:t.height},api:{coord:function coord(t){return e.dataToPoint(t);},size:S(SS,e)}};},polar:function polar(a){var o=a.getRadiusAxis(),r=a.getAngleAxis(),t=o.getExtent();return t[0]>t[1]&&t.reverse(),{coordSys:{type:"polar",cx:a.cx,cy:a.cy,r:t[1],r0:t[0]},api:{coord:S(function(t){var e=o.dataToRadius(t[0]),i=r.dataToAngle(t[1]),n=a.coordToPoint([e,i]);return n.push(e,i*Math.PI/180),n;}),size:S(MS,a)}};},calendar:function calendar(i){var t=i.getRect(),e=i.getRangeInfo();return{coordSys:{type:"calendar",x:t.x,y:t.y,width:t.width,height:t.height,cellWidth:i.getCellWidth(),cellHeight:i.getCellHeight(),rangeInfo:{start:e.start,end:e.end,weeks:e.weeks,dayCount:e.allDay}},api:{coord:function coord(t,e){return i.dataToPoint(t,e);}}};}};function kS(t,e,i,n,a){null==i[t]||a||(e[t]=i[t],i[t]=n[t]);}function PS(a,o,e,t){var i=a.get("renderItem"),n=a.coordinateSystem,r={};n&&(r=n.prepareCustoms?n.prepareCustoms():LS[n.type](n));var s,l,h,u,c,d,f,p=C({getWidth:t.getWidth,getHeight:t.getHeight,getZr:t.getZr,getDevicePixelRatio:t.getDevicePixelRatio,value:function value(t,e){return null==e&&(e=h),o.get(o.getDimension(t||0),e);},style:function style(t,e){null==e&&(e=h),v(e);var i=u.getModel(IS).getItemStyle();null!=f&&(i.fill=f);var n=o.getItemVisual(e,"opacity");return null!=n&&(i.opacity=n),rs(i,c,null,{autoColor:f,isRectText:!0}),i.text=c.getShallow("show")?F(a.getFormattedLabel(e,"normal"),Zf(o,e)):null,t&&k(i,t),i;},styleEmphasis:function styleEmphasis(t,e){null==e&&(e=h),v(e);var i=u.getModel(TS).getItemStyle();return rs(i,d,null,{isRectText:!0},!0),i.text=d.getShallow("show")?H(a.getFormattedLabel(e,"emphasis"),a.getFormattedLabel(e,"normal"),Zf(o,e)):null,t&&k(i,t),i;},visual:function visual(t,e){return null==e&&(e=h),o.getItemVisual(e,t);},barLayout:function barLayout(t){if(n.getBaseAxis){var e=n.getBaseAxis();return function(t,e){var i=[],n=t.axis;if("category"===n.type){for(var a=n.getBandWidth(),o=0;o<t.count;o++){i.push(C({bandWidth:a,axisKey:"axis0",stackId:Zd+o},t));}var r=Yd(i),s=[];for(o=0;o<t.count;o++){var l=r.axis0[Zd+o];l.offsetCenter=l.offset+l.width/2,s.push(l);}return s;}}(C({axis:e},t));}},currentSeriesIndices:function currentSeriesIndices(){return e.getCurrentSeriesIndices();},font:function font(t){return cs(t,e);}},r.api||{}),g={context:{},seriesId:a.id,seriesName:a.name,seriesIndex:a.seriesIndex,coordSys:r.coordSys,dataInsideLength:o.count(),encode:(s=a.getData(),l={},z(s.dimensions,function(t,e){var i=s.getDimensionInfo(t);if(!i.isExtraCoord){var n=i.coordDim;(l[n]=l[n]||[])[i.coordDimIndex]=e;}}),l)},m=!0;return function(t){return h=t,m=!0,i&&i(C({dataIndexInside:t,dataIndex:o.getRawIndex(t)},g),p)||{};};function v(t){null==t&&(t=h),m&&(u=o.getItemModel(t),c=u.getModel(DS),d=u.getModel(AS),f=o.getItemVisual(t,"color"),m=!1);}}function NS(t,e,i,n,a,o){return(t=OS(t,e,i,n,a,o))&&o.setItemGraphicEl(e,t),t;}function OS(t,e,i,n,a,o){var r=i.type;if(!t||r===t.__customGraphicType||"path"===r&&i.pathData===t.__customPathData||"image"===r&&i.style.image===t.__customImagePath||"text"===r&&i.style.text===t.__customText||(a.remove(t),t=null),null!=r){var s,l=!t;if(!t&&(t=function(t){var e,i=t.type;if("path"===i){var n=t.shape;(e=Br(n.pathData,null,{x:n.x||0,y:n.y||0,width:n.width||0,height:n.height||0},"center")).__customPathData=t.pathData;}else"image"===i?(e=new _n({})).__customImagePath=t.style.image:"text"===i?(e=new hr({})).__customText=t.style.text:e=new(0,ws[i.charAt(0).toUpperCase()+i.slice(1)])();return e.__customGraphicType=i,e.name=t.name,e;}(i)),function(e,t,i,n,a,o){var r={},s=i.style||{};if(i.shape&&(r.shape=A(i.shape)),i.position&&(r.position=i.position.slice()),i.scale&&(r.scale=i.scale.slice()),i.origin&&(r.origin=i.origin.slice()),i.rotation&&(r.rotation=i.rotation),"image"===e.type&&i.style){var l=r.style={};z(["x","y","width","height"],function(t){kS(t,l,s,e.style,o);});}"text"===e.type&&i.style&&(l=r.style={},z(["x","y"],function(t){kS(t,l,s,e.style,o);}),!s.hasOwnProperty("textFill")&&s.fill&&(s.textFill=s.fill),!s.hasOwnProperty("textStroke")&&s.stroke&&(s.textStroke=s.stroke));if("group"!==e.type&&(e.useStyle(s),o)){e.style.opacity=0;var h=s.opacity;null==h&&(h=1),ps(e,{style:{opacity:h}},n,t);}o?e.attr(r):fs(e,r,n,t),e.attr({z2:i.z2||0,silent:i.silent}),!1!==i.styleEmphasis&&as(e,i.styleEmphasis);}(t,e,i,n,0,l),"group"===r){var h=t.children()||[],u=i.children||[];if(i.diffChildrenByName)new ed((s={oldChildren:h,newChildren:u,dataIndex:e,animatableModel:n,group:t,data:o}).oldChildren,s.newChildren,ES,ES,s).add(RS).update(RS).remove(zS).execute();else{for(var c=0;c<u.length;c++){OS(t.childAt(c),e,u[c],n,t,o);}for(;c<h.length;c++){h[c]&&t.remove(h[c]);}}}return a.add(t),t;}}function ES(t,e){var i=t&&t.name;return null!=i?i:CS+e;}function RS(t,e){var i=this.context,n=null!=t?i.newChildren[t]:null;OS(null!=e?i.oldChildren[e]:null,i.dataIndex,n,i.animatableModel,i.group,i.data);}function zS(t){var e=this.context,i=e.oldChildren[t];i&&e.group.remove(i);}$c({type:"series.custom",dependencies:["grid","polar","geo","singleAxis","calendar"],defaultOption:{coordinateSystem:"cartesian2d",zlevel:0,z:2,legendHoverLink:!0},getInitialData:function getInitialData(t,e){return Ld(this.getSource(),this);}}),Jc({type:"custom",_data:null,render:function render(i,t,e){var n=this._data,a=i.getData(),o=this.group,r=PS(i,a,t,e);this.group.removeAll(),a.diff(n).add(function(t){NS(null,t,r(t),i,o,a);}).update(function(t,e){NS(n.getItemGraphicEl(e),t,r(t),i,o,a);}).remove(function(t){var e=n.getItemGraphicEl(t);e&&o.remove(e);}).execute(),this._data=a;},incrementalPrepareRender:function incrementalPrepareRender(t,e,i){this.group.removeAll(),this._data=null;},incrementalRender:function incrementalRender(t,e,i,n){var a=e.getData(),o=PS(e,a,i,n);function r(t){t.isGroup||(t.incremental=!0,t.useHoverLayer=!0);}for(var s=t.start;s<t.end;s++){NS(null,s,o(s),e,this.group,a).traverse(r);}},dispose:tt}),Wc(function(t){var e=t.graphic;E(e)?e[0]&&e[0].elements?t.graphic=[t.graphic[0]]:t.graphic=[{elements:e}]:e&&!e.elements&&(t.graphic=[{elements:[e]}]);});var BS=qc({type:"graphic",defaultOption:{elements:[],parentId:null},_elOptionsToUpdate:null,mergeOption:function mergeOption(t){var e=this.option.elements;this.option.elements=null,BS.superApply(this,"mergeOption",arguments),this.option.elements=e;},optionUpdated:function optionUpdated(t,e){var i=this.option,n=(e?i:t).elements,h=i.elements=e?[]:i.elements,a=[];this._flatten(n,a);var o=ua(h,a);ca(o);var u=this._elOptionsToUpdate=[];z(o,function(t,e){var i,n,a,o,r,s,l=t.option;l&&(u.push(l),function(t,e){var i=t.exist;if(e.id=t.keyInfo.id,!e.type&&i&&(e.type=i.type),null==e.parentId){var n=e.parentOption;n?e.parentId=n.id:i&&(e.parentId=i.parentId);}e.parentOption=null;}(t,l),i=h,n=e,o=k({},a=l),r=i[n],"merge"===(s=a.$action||"merge")?r?(g(r,o,!0),Sl(r,o,{ignoreSize:!0}),Il(a,r)):i[n]=o:"replace"===s?i[n]=o:"remove"===s&&r&&(i[n]=null),function(t,e){if(!t)return;t.hv=e.hv=[WS(e,["left","right"]),WS(e,["top","bottom"])],"group"===t.type&&(null==t.width&&(t.width=e.width=0),null==t.height&&(t.height=e.height=0));}(h[e],l));},this);for(var r=h.length-1;0<=r;r--){null==h[r]?h.splice(r,1):delete h[r].$action;}},_flatten:function _flatten(t,i,n){z(t,function(t){if(t){n&&(t.parentOption=n),i.push(t);var e=t.children;"group"===t.type&&e&&this._flatten(e,i,t),delete t.children;}},this);},useElOptionsToUpdate:function useElOptionsToUpdate(){var t=this._elOptionsToUpdate;return this._elOptionsToUpdate=null,t;}});function VS(t,e,i,n){var a=i.type,o=new(0,ws[a.charAt(0).toUpperCase()+a.slice(1)])(i);e.add(o),n.set(t,o),o.__ecGraphicId=t;}function GS(t,e){var i=t&&t.parent;i&&("group"===t.type&&t.traverse(function(t){GS(t,e);}),e.removeKey(t.__ecGraphicId),i.remove(t));}function WS(e,t){var i;return z(t,function(t){null!=e[t]&&"auto"!==e[t]&&(i=!0);}),i;}Kc({type:"graphic",init:function init(t,e){this._elMap=J(),this._lastGraphicModel;},render:function render(t,e,i){t!==this._lastGraphicModel&&this._clear(),this._lastGraphicModel=t,this._updateElements(t,i),this._relocate(t,i);},_updateElements:function _updateElements(t,e){var i=t.useElOptionsToUpdate();if(i){var u=this._elMap,c=this.group;z(i,function(t){var e=t.$action,i=t.id,n=u.get(i),a=t.parentId,o=null!=a?u.get(a):c;if("text"===t.type){var r=t.style;t.hv&&t.hv[1]&&(r.textVerticalAlign=r.textBaseline=null),!r.hasOwnProperty("textFill")&&r.fill&&(r.textFill=r.fill),!r.hasOwnProperty("textStroke")&&r.stroke&&(r.textStroke=r.stroke);}var s,l=(s=k({},s=t),z(["id","parentId","$action","hv","bounding"].concat(vl),function(t){delete s[t];}),s);e&&"merge"!==e?"replace"===e?(GS(n,u),VS(i,o,l,u)):"remove"===e&&GS(n,u):n?n.attr(l):VS(i,o,l,u);var h=u.get(i);h&&(h.__ecGraphicWidth=t.width,h.__ecGraphicHeight=t.height);});}},_relocate:function _relocate(t,e){for(var i=t.option.elements,n=this.group,a=this._elMap,o=i.length-1;0<=o;o--){var r=i[o],s=a.get(r.id);if(s){var l=s.parent;bl(s,r,l===n?{width:e.getWidth(),height:e.getHeight()}:{width:l.__ecGraphicWidth||0,height:l.__ecGraphicHeight||0},null,{hv:r.hv,boundingMode:r.bounding});}}},_clear:function _clear(){var e=this._elMap;e.each(function(t){GS(t,e);}),this._elMap=J();},dispose:function dispose(){this._clear();}});var FS=qc({type:"legend.plain",dependencies:["series"],layoutMode:{type:"box",ignoreSize:!0},init:function init(t,e,i){this.mergeDefaultAndTheme(t,i),t.selected=t.selected||{};},mergeOption:function mergeOption(t){FS.superCall(this,"mergeOption",t);},optionUpdated:function optionUpdated(){this._updateData(this.ecModel);var t=this._data;if(t[0]&&"single"===this.get("selectedMode")){for(var e=!1,i=0;i<t.length;i++){var n=t[i].get("name");if(this.isSelected(n)){this.select(n),e=!0;break;}}!e&&this.select(t[0].get("name"));}},_updateData:function _updateData(o){var r=[],s=[];o.eachRawSeries(function(t){var e,i=t.name;if(s.push(i),t.legendDataProvider){var n=t.legendDataProvider(),a=n.mapArray(n.getName);o.isSeriesFiltered(t)||(s=s.concat(a)),a.length?r=r.concat(a):e=!0;}else e=!0;e&&da(t)&&r.push(t.name);}),this._availableNames=s;var t=P(this.get("data")||r,function(t){return"string"!=typeof t&&"number"!=typeof t||(t={name:t}),new As(t,this,this.ecModel);},this);this._data=t;},getData:function getData(){return this._data;},select:function select(t){var e=this.option.selected;"single"===this.get("selectedMode")&&z(this._data,function(t){e[t.get("name")]=!1;});e[t]=!0;},unSelect:function unSelect(t){"single"!==this.get("selectedMode")&&(this.option.selected[t]=!1);},toggleSelected:function toggleSelected(t){var e=this.option.selected;e.hasOwnProperty(t)||(e[t]=!0),this[e[t]?"unSelect":"select"](t);},isSelected:function isSelected(t){var e=this.option.selected;return!(e.hasOwnProperty(t)&&!e[t])&&0<=L(this._availableNames,t);},defaultOption:{zlevel:0,z:4,show:!0,orient:"horizontal",left:"center",top:0,align:"auto",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderRadius:0,borderWidth:0,padding:5,itemGap:10,itemWidth:25,itemHeight:14,inactiveColor:"#ccc",textStyle:{color:"#333"},selectedMode:!0,tooltip:{show:!1}}});function HS(t,e,i){var a,o={},r="toggleSelected"===t;return i.eachComponent("legend",function(n){r&&null!=a?n[a?"select":"unSelect"](e.name):(n[t](e.name),a=n.isSelected(e.name)),z(n.getData(),function(t){var e=t.get("name");if("\n"!==e&&""!==e){var i=n.isSelected(e);o.hasOwnProperty(e)?o[e]=o[e]&&i:o[e]=i;}});}),{name:e.name,selected:o};}function ZS(t,e){var i=el(e.get("padding")),n=e.getItemStyle(["color","opacity"]);return n.fill=e.get("backgroundColor"),t=new wr({shape:{x:t.x-i[3],y:t.y-i[0],width:t.width+i[1]+i[3],height:t.height+i[0]+i[2],r:e.get("borderRadius")},style:n,silent:!0,z2:-1});}Hc("legendToggleSelect","legendselectchanged",N(HS,"toggleSelected")),Hc("legendSelect","legendselected",N(HS,"select")),Hc("legendUnSelect","legendunselected",N(HS,"unSelect"));var US=N,jS=z,XS=ii,YS=Kc({type:"legend.plain",newlineDisabled:!1,init:function init(){this.group.add(this._contentGroup=new XS()),this._backgroundEl;},getContentGroup:function getContentGroup(){return this._contentGroup;},render:function render(t,e,i){if(this.resetInner(),t.get("show",!0)){var n=t.get("align");n&&"auto"!==n||(n="right"===t.get("left")&&"vertical"===t.get("orient")?"right":"left"),this.renderInner(n,t,e,i);var a=t.getBoxLayoutParams(),o={width:i.getWidth(),height:i.getHeight()},r=t.get("padding"),s=wl(a,o,r),l=this.layoutInner(t,n,s),h=wl(C({width:l.width,height:l.height},a),o,r);this.group.attr("position",[h.x-l.x,h.y-l.y]),this.group.add(this._backgroundEl=ZS(l,t));}},resetInner:function resetInner(){this.getContentGroup().removeAll(),this._backgroundEl&&this.group.remove(this._backgroundEl);},renderInner:function renderInner(l,h,u,c){var d=this.getContentGroup(),f=J(),p=h.get("selectedMode"),g=[];u.eachRawSeries(function(t){!t.get("legendHoverLink")&&g.push(t.id);}),jS(h.getData(),function(a,o){var r=a.get("name");if(this.newlineDisabled||""!==r&&"\n"!==r){var t=u.getSeriesByName(r)[0];if(!f.get(r))if(t){var e=t.getData(),i=e.getVisual("color");"function"==typeof i&&(i=i(t.getDataParams(0)));var n=e.getVisual("legendSymbol")||"roundRect",s=e.getVisual("symbol");this._createItem(r,o,a,h,n,s,l,i,p).on("click",US(qS,r,c)).on("mouseover",US(KS,t,null,c,g)).on("mouseout",US($S,t,null,c,g)),f.set(r,!0);}else u.eachRawSeries(function(t){if(!f.get(r)&&t.legendDataProvider){var e=t.legendDataProvider(),i=e.indexOfName(r);if(i<0)return;var n=e.getItemVisual(i,"color");this._createItem(r,o,a,h,"roundRect",null,l,n,p).on("click",US(qS,r,c)).on("mouseover",US(KS,t,r,c,g)).on("mouseout",US($S,t,r,c,g)),f.set(r,!0);}},this);}else d.add(new XS({newline:!0}));},this);},_createItem:function _createItem(t,e,i,n,a,o,r,s,l){var h=n.get("itemWidth"),u=n.get("itemHeight"),c=n.get("inactiveColor"),d=n.get("symbolKeepAspect"),f=n.isSelected(t),p=new XS(),g=i.getModel("textStyle"),m=i.get("icon"),v=i.getModel("tooltip"),y=v.parentModel;if(a=m||a,p.add(Cf(a,0,0,h,u,f?s:c,null==d||d)),!m&&o&&(o!==a||"none"==o)){var x=.8*u;"none"===o&&(o="circle"),p.add(Cf(o,(h-x)/2,(u-x)/2,x,x,f?s:c,null==d||d));}var _="left"===r?h+5:-5,w=r,b=n.get("formatter"),S=t;"string"==typeof b&&b?S=b.replace("{name}",null!=t?t:""):"function"==typeof b&&(S=b(t)),p.add(new hr({style:rs({},g,{text:S,x:_,y:u/2,textFill:f?g.getTextColor():c,textAlign:w,textVerticalAlign:"middle"})}));var M=new wr({shape:p.getBoundingRect(),invisible:!0,tooltip:v.get("show")?k({content:t,formatter:y.get("formatter",!0)||function(){return t;},formatterParams:{componentType:"legend",legendIndex:n.componentIndex,name:t,$vars:["name"]}},v.option):null});return p.add(M),p.eachChild(function(t){t.silent=!0;}),M.silent=!l,this.getContentGroup().add(p),as(p),p.__legendDataIndex=e,p;},layoutInner:function layoutInner(t,e,i){var n=this.getContentGroup();_l(t.get("orient"),n,t.get("itemGap"),i.width,i.height);var a=n.getBoundingRect();return n.attr("position",[-a.x,-a.y]),this.group.getBoundingRect();}});function qS(t,e){e.dispatchAction({type:"legendToggleSelect",name:t});}function KS(t,e,i,n){var a=i.getZr().storage.getDisplayList()[0];a&&a.useHoverLayer||i.dispatchAction({type:"highlight",seriesName:t.name,name:e,excludeSeriesId:n});}function $S(t,e,i,n){var a=i.getZr().storage.getDisplayList()[0];a&&a.useHoverLayer||i.dispatchAction({type:"downplay",seriesName:t.name,name:e,excludeSeriesId:n});}Fc(function(t){var i=t.findComponents({mainType:"legend"});i&&i.length&&t.filterSeries(function(t){for(var e=0;e<i.length;e++){if(!i[e].isSelected(t.name))return!1;}return!0;});}),Cl.registerSubTypeDefaulter("legend",function(){return"plain";});var JS=FS.extend({type:"legend.scroll",setScrollDataIndex:function setScrollDataIndex(t){this.option.scrollDataIndex=t;},defaultOption:{scrollDataIndex:0,pageButtonItemGap:5,pageButtonGap:null,pageButtonPosition:"end",pageFormatter:"{current}/{total}",pageIcons:{horizontal:["M0,0L12,-10L12,10z","M0,0L-12,-10L-12,10z"],vertical:["M0,0L20,0L10,-20z","M0,0L20,0L10,20z"]},pageIconColor:"#2f4554",pageIconInactiveColor:"#aaa",pageIconSize:15,pageTextStyle:{color:"#333"},animationDurationUpdate:800},init:function init(t,e,i,n){var a=Ml(t);JS.superCall(this,"init",t,e,i,n),QS(this,t,a);},mergeOption:function mergeOption(t,e){JS.superCall(this,"mergeOption",t,e),QS(this,this.option,t);},getOrient:function getOrient(){return"vertical"===this.get("orient")?{index:1,name:"vertical"}:{index:0,name:"horizontal"};}});function QS(t,e,i){var n=[1,1];n[t.getOrient().index]=0,Sl(e,i,{type:"box",ignoreSize:n});}var tM=ii,eM=["width","height"],iM=["x","y"],nM=YS.extend({type:"legend.scroll",newlineDisabled:!0,init:function init(){nM.superCall(this,"init"),this._currentIndex=0,this.group.add(this._containerGroup=new tM()),this._containerGroup.add(this.getContentGroup()),this.group.add(this._controllerGroup=new tM()),this._showController;},resetInner:function resetInner(){nM.superCall(this,"resetInner"),this._controllerGroup.removeAll(),this._containerGroup.removeClipPath(),this._containerGroup.__rectSize=null;},renderInner:function renderInner(t,a,e,o){var r=this;nM.superCall(this,"renderInner",t,a,e,o);var s=this._controllerGroup,l=a.get("pageIconSize",!0);E(l)||(l=[l,l]),n("pagePrev",0);var i=a.getModel("pageTextStyle");function n(t,e){var i=t+"DataIndex",n=_s(a.get("pageIcons",!0)[a.getOrient().name][e],{onclick:S(r._pageGo,r,i,a,o)},{x:-l[0]/2,y:-l[1]/2,width:l[0],height:l[1]});n.name=t,s.add(n);}s.add(new hr({name:"pageText",style:{textFill:i.getTextColor(),font:i.getFont(),textVerticalAlign:"middle",textAlign:"center"},silent:!0})),n("pageNext",1);},layoutInner:function layoutInner(t,e,i){var n=this.getContentGroup(),a=this._containerGroup,o=this._controllerGroup,r=t.getOrient().index,s=eM[r],l=eM[1-r],h=iM[1-r];_l(t.get("orient"),n,t.get("itemGap"),r?i.width:null,r?null:i.height),_l("horizontal",o,t.get("pageButtonItemGap",!0));var u=n.getBoundingRect(),c=o.getBoundingRect(),d=this._showController=u[s]>i[s],f=[-u.x,-u.y];f[r]=n.position[r];var p=[0,0],g=[-c.x,-c.y],m=F(t.get("pageButtonGap",!0),t.get("itemGap",!0));d&&("end"===t.get("pageButtonPosition",!0)?g[r]+=i[s]-c[s]:p[r]+=c[s]+m);g[1-r]+=u[l]/2-c[l]/2,n.attr("position",f),a.attr("position",p),o.attr("position",g);var v=this.group.getBoundingRect();if((v={x:0,y:0})[s]=d?i[s]:u[s],v[l]=Math.max(u[l],c[l]),v[h]=Math.min(0,c[h]+g[1-r]),a.__rectSize=i[s],d){var y={x:0,y:0};y[s]=Math.max(i[s]-c[s]-m,0),y[l]=v[l],a.setClipPath(new wr({shape:y})),a.__rectSize=y[s];}else o.eachChild(function(t){t.attr({invisible:!0,silent:!0});});var x=this._getPageInfo(t);return null!=x.pageIndex&&fs(n,{position:x.contentPosition},!!d&&t),this._updatePageInfoView(t,x),v;},_pageGo:function _pageGo(t,e,i){var n=this._getPageInfo(e)[t];null!=n&&i.dispatchAction({type:"legendScroll",scrollDataIndex:n,legendId:e.id});},_updatePageInfoView:function _updatePageInfoView(n,a){var o=this._controllerGroup;z(["pagePrev","pageNext"],function(t){var e=null!=a[t+"DataIndex"],i=o.childOfName(t);i&&(i.setStyle("fill",e?n.get("pageIconColor",!0):n.get("pageIconInactiveColor",!0)),i.cursor=e?"pointer":"default");});var t=o.childOfName("pageText"),e=n.get("pageFormatter"),i=a.pageIndex,r=null!=i?i+1:0,s=a.pageCount;t&&e&&t.setStyle("text",D(e)?e.replace("{current}",r).replace("{total}",s):e({current:r,total:s}));},_getPageInfo:function _getPageInfo(t){var e,i,n,a,o=t.get("scrollDataIndex",!0),r=this.getContentGroup(),s=r.getBoundingRect(),l=this._containerGroup.__rectSize,h=t.getOrient().index,u=eM[h],c=eM[1-h],d=iM[h],f=r.position.slice();this._showController?r.eachChild(function(t){t.__legendDataIndex===o&&(a=t);}):a=r.childAt(0);var p=l?Math.ceil(s[u]/l):0;if(a){var g=a.getBoundingRect(),m=a.position[h]+g[d];f[h]=-m-s[d],e=Math.floor(p*(m+g[d]+l/2)/s[u]),e=s[u]&&p?Math.max(0,Math.min(p-1,e)):-1;var v,y={x:0,y:0};y[u]=l,y[c]=s[c],y[d]=-f[h]-s[d];var x=r.children();if(r.eachChild(function(t,e){var i=w(t);i.intersect(y)&&(null==v&&(v=e),n=t.__legendDataIndex),e===x.length-1&&i[d]+i[u]<=y[d]+y[u]&&(n=null);}),null!=v){var _=w(x[v]);if(y[d]=_[d]+_[u]-y[u],v<=0&&_[d]>=y[d])i=null;else{for(;0<v&&w(x[v-1]).intersect(y);){v--;}i=x[v].__legendDataIndex;}}}return{contentPosition:f,pageIndex:e,pageCount:p,pagePrevDataIndex:i,pageNextDataIndex:n};function w(t){var e=t.getBoundingRect().clone();return e[d]+=t.position[h],e;}}});Hc("legendScroll","legendscroll",function(t,e){var i=t.scrollDataIndex;null!=i&&e.eachComponent({mainType:"legend",subType:"scroll",query:t},function(t){t.setScrollDataIndex(i);});}),qc({type:"tooltip",dependencies:["axisPointer"],defaultOption:{zlevel:0,z:8,show:!0,showContent:!0,trigger:"item",triggerOn:"mousemove|click",alwaysShowContent:!1,displayMode:"single",confine:!1,showDelay:0,hideDelay:100,transitionDuration:.4,enterable:!1,backgroundColor:"rgba(50,50,50,0.7)",borderColor:"#333",borderRadius:4,borderWidth:0,padding:5,extraCssText:"",axisPointer:{type:"line",axis:"auto",animation:"auto",animationDurationUpdate:200,animationEasingUpdate:"exponentialOut",crossStyle:{color:"#999",width:1,type:"dashed",textStyle:{}}},textStyle:{color:"#fff",fontSize:14}}});var aM=z,oM=tl,rM=["","-webkit-","-moz-","-o-"];function sM(a){var t,e,i,n,o,r,s,l=[],h=a.get("transitionDuration"),u=a.get("backgroundColor"),c=a.getModel("textStyle"),d=a.get("padding");return h&&l.push((i="left "+(t=h)+"s "+(e="cubic-bezier(0.23, 1, 0.32, 1)")+",top "+t+"s "+e,P(rM,function(t){return t+"transition:"+i;}).join(";"))),u&&(v.canvasSupported?l.push("background-Color:"+u):(l.push("background-Color:#"+xe(u)),l.push("filter:alpha(opacity=70)"))),aM(["width","color","radius"],function(t){var e="border-"+t,i=oM(e),n=a.get(i);null!=n&&l.push(e+":"+n+("color"===t?"":"px"));}),l.push((o=[],r=(n=c).get("fontSize"),(s=n.getTextColor())&&o.push("color:"+s),o.push("font:"+n.getFont()),r&&o.push("line-height:"+Math.round(3*r/2)+"px"),aM(["decoration","align"],function(t){var e=n.get(t);e&&o.push("text-"+t+":"+e);}),o.join(";"))),null!=d&&l.push("padding:"+el(d).join("px ")+"px"),l.join(";")+";";}function lM(i,t){if(v.wxa)return null;var e=document.createElement("div"),n=this._zr=t.getZr();this.el=e,this._x=t.getWidth()/2,this._y=t.getHeight()/2,i.appendChild(e),this._container=i,this._show=!1,this._hideTimeout;var a=this;e.onmouseenter=function(){a._enterable&&(clearTimeout(a._hideTimeout),a._show=!0),a._inContent=!0;},e.onmousemove=function(t){if(t=t||window.event,!a._enterable){var e=n.handler;Ln(i,t,!0),e.dispatch("mousemove",t);}},e.onmouseleave=function(){a._enterable&&a._show&&a.hideLater(a._hideDelay),a._inContent=!1;};}lM.prototype={constructor:lM,_enterable:!0,update:function update(){var t=this._container,e=t.currentStyle||document.defaultView.getComputedStyle(t),i=t.style;"absolute"!==i.position&&"absolute"!==e.position&&(i.position="relative");},show:function show(t){clearTimeout(this._hideTimeout);var e=this.el;e.style.cssText="position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;"+sM(t)+";left:"+this._x+"px;top:"+this._y+"px;"+(t.get("extraCssText")||""),e.style.display=e.innerHTML?"block":"none",this._show=!0;},setContent:function setContent(t){this.el.innerHTML=null==t?"":t;},setEnterable:function setEnterable(t){this._enterable=t;},getSize:function getSize(){var t=this.el;return[t.clientWidth,t.clientHeight];},moveTo:function moveTo(t,e){var i,n=this._zr;n&&n.painter&&(i=n.painter.getViewportRootOffset())&&(t+=i.offsetLeft,e+=i.offsetTop);var a=this.el.style;a.left=t+"px",a.top=e+"px",this._x=t,this._y=e;},hide:function hide(){this.el.style.display="none",this._show=!1;},hideLater:function hideLater(t){!this._show||this._inContent&&this._enterable||(t?(this._hideDelay=t,this._show=!1,this._hideTimeout=setTimeout(S(this.hide,this),t)):this.hide());},isShow:function isShow(){return this._show;}};var hM=S,uM=z,cM=Es,dM=new wr({shape:{x:-1,y:-1,width:2,height:2}});function fM(t){for(var e=t.pop();t.length;){var i=t.pop();i&&(As.isInstance(i)&&(i=i.get("tooltip",!0)),"string"==typeof i&&(i={formatter:i}),e=new As(i,e,e.ecModel));}return e;}function pM(t,e){return t.dispatchAction||S(e.dispatchAction,e);}function gM(t){var e=t.clientWidth,i=t.clientHeight;if(document.defaultView&&document.defaultView.getComputedStyle){var n=document.defaultView.getComputedStyle(t);n&&(e+=parseInt(n.paddingLeft,10)+parseInt(n.paddingRight,10)+parseInt(n.borderLeftWidth,10)+parseInt(n.borderRightWidth,10),i+=parseInt(n.paddingTop,10)+parseInt(n.paddingBottom,10)+parseInt(n.borderTopWidth,10)+parseInt(n.borderBottomWidth,10));}return{width:e,height:i};}function mM(t){return"center"===t||"middle"===t;}function vM(t){return t.get("stack")||"__ec_stack_"+t.seriesIndex;}function yM(t){return t.dim;}function xM(t,e){Wf.call(this,"radius",t,e),this.type="category";}function _M(t,e){e=e||[0,360],Wf.call(this,"angle",t,e),this.type="category";}Kc({type:"tooltip",init:function init(t,e){if(!v.node){var i=new lM(e.getDom(),e);this._tooltipContent=i;}},render:function render(t,e,i){if(!v.node&&!v.wxa){this.group.removeAll(),this._tooltipModel=t,this._ecModel=e,this._api=i,this._lastDataByCoordSys=null,this._alwaysShowContent=t.get("alwaysShowContent");var n=this._tooltipContent;n.update(),n.setEnterable(t.get("enterable")),this._initGlobalListener(),this._keepShow();}},_initGlobalListener:function _initGlobalListener(){var n=this._tooltipModel.get("triggerOn");Ob("itemTooltip",this._api,hM(function(t,e,i){"none"!==n&&(0<=n.indexOf(t)?this._tryShow(e,i):"leave"===t&&this._hide(i));},this));},_keepShow:function _keepShow(){var t=this._tooltipModel,e=this._ecModel,i=this._api;if(null!=this._lastX&&null!=this._lastY&&"none"!==t.get("triggerOn")){var n=this;clearTimeout(this._refreshUpdateTimeout),this._refreshUpdateTimeout=setTimeout(function(){n.manuallyShowTip(t,e,i,{x:n._lastX,y:n._lastY});});}},manuallyShowTip:function manuallyShowTip(t,e,i,n){if(n.from!==this.uid&&!v.node){var a=pM(n,i);this._ticket="";var o=n.dataByCoordSys;if(n.tooltip&&null!=n.x&&null!=n.y){var r=dM;r.position=[n.x,n.y],r.update(),r.tooltip=n.tooltip,this._tryShow({offsetX:n.x,offsetY:n.y,target:r},a);}else if(o)this._tryShow({offsetX:n.x,offsetY:n.y,position:n.position,event:{},dataByCoordSys:n.dataByCoordSys,tooltipOption:n.tooltipOption},a);else if(null!=n.seriesIndex){if(this._manuallyAxisShowTip(t,e,i,n))return;var s=Sb(n,e),l=s.point[0],h=s.point[1];null!=l&&null!=h&&this._tryShow({offsetX:l,offsetY:h,position:n.position,target:s.el,event:{}},a);}else null!=n.x&&null!=n.y&&(i.dispatchAction({type:"updateAxisPointer",x:n.x,y:n.y}),this._tryShow({offsetX:n.x,offsetY:n.y,position:n.position,target:i.getZr().findHover(n.x,n.y).target,event:{}},a));}},manuallyHideTip:function manuallyHideTip(t,e,i,n){var a=this._tooltipContent;!this._alwaysShowContent&&this._tooltipModel&&a.hideLater(this._tooltipModel.get("hideDelay")),this._lastX=this._lastY=null,n.from!==this.uid&&this._hide(pM(n,i));},_manuallyAxisShowTip:function _manuallyAxisShowTip(t,e,i,n){var a=n.seriesIndex,o=n.dataIndex,r=e.getComponent("axisPointer").coordSysAxesInfo;if(null!=a&&null!=o&&null!=r){var s=e.getSeriesByIndex(a);if(s)if("axis"===(t=fM([s.getData().getItemModel(o),s,(s.coordinateSystem||{}).model,t])).get("trigger"))return i.dispatchAction({type:"updateAxisPointer",seriesIndex:a,dataIndex:o,position:n.position}),!0;}},_tryShow:function _tryShow(t,e){var i=t.target;if(this._tooltipModel){this._lastX=t.offsetX,this._lastY=t.offsetY;var n=t.dataByCoordSys;n&&n.length?this._showAxisTooltip(n,t):i&&null!=i.dataIndex?(this._lastDataByCoordSys=null,this._showSeriesItemTooltip(t,i,e)):i&&i.tooltip?(this._lastDataByCoordSys=null,this._showComponentItemTooltip(t,i,e)):(this._lastDataByCoordSys=null,this._hide(e));}},_showOrMove:function _showOrMove(t,e){var i=t.get("showDelay");e=S(e,this),clearTimeout(this._showTimout),0<i?this._showTimout=setTimeout(e,i):e();},_showAxisTooltip:function _showAxisTooltip(t,e){var h=this._ecModel,i=this._tooltipModel,n=[e.offsetX,e.offsetY],u=[],c=[],a=fM([e.tooltipOption,i]);uM(t,function(t){uM(t.dataByAxis,function(a){var o=h.getComponent(a.axisDim+"Axis",a.axisIndex),r=a.value,s=[];if(o&&null!=r){var l=qb(r,o.axis,h,a.seriesDataIndices,a.valueLabelOpt);z(a.seriesDataIndices,function(t){var e=h.getSeriesByIndex(t.seriesIndex),i=t.dataIndexInside,n=e&&e.getDataParams(i);n.axisDim=a.axisDim,n.axisIndex=a.axisIndex,n.axisType=a.axisType,n.axisId=a.axisId,n.axisValue=xf(o.axis,r),n.axisValueLabel=l,n&&(c.push(n),s.push(e.formatTooltip(i,!0)));});var t=l;u.push((t?al(t)+"<br />":"")+s.join("<br />"));}});},this),u.reverse(),u=u.join("<br /><br />");var o=e.position;this._showOrMove(a,function(){this._updateContentNotChangedOnAxis(t)?this._updatePosition(a,o,n[0],n[1],this._tooltipContent,c):this._showTooltipContent(a,u,c,Math.random(),n[0],n[1],o);});},_showSeriesItemTooltip:function _showSeriesItemTooltip(t,e,i){var n=this._ecModel,a=e.seriesIndex,o=n.getSeriesByIndex(a),r=e.dataModel||o,s=e.dataIndex,l=e.dataType,h=r.getData(),u=fM([h.getItemModel(s),r,o&&(o.coordinateSystem||{}).model,this._tooltipModel]),c=u.get("trigger");if(null==c||"item"===c){var d=r.getDataParams(s,l),f=r.formatTooltip(s,!1,l),p="item_"+r.name+"_"+s;this._showOrMove(u,function(){this._showTooltipContent(u,f,d,p,t.offsetX,t.offsetY,t.position,t.target);}),i({type:"showTip",dataIndexInside:s,dataIndex:h.getRawIndex(s),seriesIndex:a,from:this.uid});}},_showComponentItemTooltip:function _showComponentItemTooltip(t,e,i){var n=e.tooltip;if("string"==typeof n){n={content:n,formatter:n};}var a=new As(n,this._tooltipModel,this._ecModel),o=a.get("content"),r=Math.random();this._showOrMove(a,function(){this._showTooltipContent(a,o,a.get("formatterParams")||{},r,t.offsetX,t.offsetY,t.position,e);}),i({type:"showTip",from:this.uid});},_showTooltipContent:function _showTooltipContent(i,t,n,e,a,o,r,s){if(this._ticket="",i.get("showContent")&&i.get("show")){var l=this._tooltipContent,h=i.get("formatter");r=r||i.get("position");var u=t;if(h&&"string"==typeof h)u=sl(h,n,!0);else if("function"==typeof h){var c=hM(function(t,e){t===this._ticket&&(l.setContent(e),this._updatePosition(i,r,a,o,l,n,s));},this);this._ticket=e,u=h(n,e,c);}l.setContent(u),l.show(i),this._updatePosition(i,r,a,o,l,n,s);}},_updatePosition:function _updatePosition(t,e,i,n,a,o,r){var s=this._api.getWidth(),l=this._api.getHeight();e=e||t.get("position");var h,u,c,d,f,p,g,m,v=a.getSize(),y=t.get("align"),x=t.get("verticalAlign"),_=r&&r.getBoundingRect().clone();if(r&&_.applyTransform(r.transform),"function"==typeof e&&(e=e([i,n],o,a.el,_,{viewSize:[s,l],contentSize:v.slice()})),E(e))i=cM(e[0],s),n=cM(e[1],l);else if(R(e)){e.width=v[0],e.height=v[1];var w=wl(e,{width:s,height:l});i=w.x,n=w.y,x=y=null;}else if("string"==typeof e&&r){i=(b=function(t,e,i){var n=i[0],a=i[1],o=0,r=0,s=e.width,l=e.height;switch(t){case"inside":o=e.x+s/2-n/2,r=e.y+l/2-a/2;break;case"top":o=e.x+s/2-n/2,r=e.y-a-5;break;case"bottom":o=e.x+s/2-n/2,r=e.y+l+5;break;case"left":o=e.x-n-5,r=e.y+l/2-a/2;break;case"right":o=e.x+s+5,r=e.y+l/2-a/2;}return[o,r];}(e,_,v))[0],n=b[1];}else{var b;i=(b=function(t,e,i,n,a,o,r){var s=gM(i),l=s.width,h=s.height;null!=o&&(n<t+l+o?t-=l+o:t+=o);null!=r&&(a<e+h+r?e-=h+r:e+=r);return[t,e];}(i,n,a.el,s,l,y?null:20,x?null:20))[0],n=b[1];}(y&&(i-=mM(y)?v[0]/2:"right"===y?v[0]:0),x&&(n-=mM(x)?v[1]/2:"bottom"===x?v[1]:0),t.get("confine"))&&(i=(b=(h=i,u=n,c=a.el,d=s,f=l,p=gM(c),g=p.width,m=p.height,h=Math.min(h+g,d)-g,u=Math.min(u+m,f)-m,h=Math.max(h,0),u=Math.max(u,0),[h,u]))[0],n=b[1]);a.moveTo(i,n);},_updateContentNotChangedOnAxis:function _updateContentNotChangedOnAxis(n){var t=this._lastDataByCoordSys,r=!!t&&t.length===n.length;return r&&uM(t,function(t,e){var i=t.dataByAxis||{},o=(n[e]||{}).dataByAxis||[];(r&=i.length===o.length)&&uM(i,function(t,e){var i=o[e]||{},n=t.seriesDataIndices||[],a=i.seriesDataIndices||[];(r&=t.value===i.value&&t.axisType===i.axisType&&t.axisId===i.axisId&&n.length===a.length)&&uM(n,function(t,e){var i=a[e];r&=t.seriesIndex===i.seriesIndex&&t.dataIndex===i.dataIndex;});});}),this._lastDataByCoordSys=n,!!r;},_hide:function _hide(t){this._lastDataByCoordSys=null,t({type:"hideTip",from:this.uid});},dispose:function dispose(t,e){v.node||v.wxa||(this._tooltipContent.hide(),zb("itemTooltip",e));}}),Hc({type:"showTip",event:"showTip",update:"tooltip:manuallyShowTip"},function(){}),Hc({type:"hideTip",event:"hideTip",update:"tooltip:manuallyHideTip"},function(){}),xM.prototype={constructor:xM,pointToData:function pointToData(t,e){return this.polar.pointToData(t,e)["radius"===this.dim?0:1];},dataToRadius:Wf.prototype.dataToCoord,radiusToData:Wf.prototype.coordToData},_(xM,Wf),_M.prototype={constructor:_M,pointToData:function pointToData(t,e){return this.polar.pointToData(t,e)["radius"===this.dim?0:1];},dataToAngle:Wf.prototype.dataToCoord,angleToData:Wf.prototype.coordToData},_(_M,Wf);var wM=function wM(t){this.name=t||"",this.cx=0,this.cy=0,this._radiusAxis=new xM(),this._angleAxis=new _M(),this._radiusAxis.polar=this._angleAxis.polar=this;};wM.prototype={type:"polar",axisPointerEnabled:!0,constructor:wM,dimensions:["radius","angle"],model:null,containPoint:function containPoint(t){var e=this.pointToCoord(t);return this._radiusAxis.contain(e[0])&&this._angleAxis.contain(e[1]);},containData:function containData(t){return this._radiusAxis.containData(t[0])&&this._angleAxis.containData(t[1]);},getAxis:function getAxis(t){return this["_"+t+"Axis"];},getAxes:function getAxes(){return[this._radiusAxis,this._angleAxis];},getAxesByScale:function getAxesByScale(t){var e=[],i=this._angleAxis,n=this._radiusAxis;return i.scale.type===t&&e.push(i),n.scale.type===t&&e.push(n),e;},getAngleAxis:function getAngleAxis(){return this._angleAxis;},getRadiusAxis:function getRadiusAxis(){return this._radiusAxis;},getOtherAxis:function getOtherAxis(t){var e=this._angleAxis;return t===e?this._radiusAxis:e;},getBaseAxis:function getBaseAxis(){return this.getAxesByScale("ordinal")[0]||this.getAxesByScale("time")[0]||this.getAngleAxis();},getTooltipAxes:function getTooltipAxes(t){var e=null!=t&&"auto"!==t?this.getAxis(t):this.getBaseAxis();return{baseAxes:[e],otherAxes:[this.getOtherAxis(e)]};},dataToPoint:function dataToPoint(t,e){return this.coordToPoint([this._radiusAxis.dataToRadius(t[0],e),this._angleAxis.dataToAngle(t[1],e)]);},pointToData:function pointToData(t,e){var i=this.pointToCoord(t);return[this._radiusAxis.radiusToData(i[0],e),this._angleAxis.angleToData(i[1],e)];},pointToCoord:function pointToCoord(t){var e=t[0]-this.cx,i=t[1]-this.cy,n=this.getAngleAxis(),a=n.getExtent(),o=Math.min(a[0],a[1]),r=Math.max(a[0],a[1]);n.inverse?o=r-360:r=o+360;var s=Math.sqrt(e*e+i*i);e/=s,i/=s;for(var l=Math.atan2(-i,e)/Math.PI*180,h=l<o?1:-1;l<o||r<l;){l+=360*h;}return[s,l];},coordToPoint:function coordToPoint(t){var e=t[0],i=t[1]/180*Math.PI;return[Math.cos(i)*e+this.cx,-Math.sin(i)*e+this.cy];}};var bM=Cl.extend({type:"polarAxis",axis:null,getCoordSysModel:function getCoordSysModel(){return this.ecModel.queryComponents({mainType:"polar",index:this.option.polarIndex,id:this.option.polarId})[0];}});g(bM.prototype,_f);var SM={splitNumber:5};function MM(t,e){return e.type||(e.data?"category":"value");}function IM(t,e){var i=this,n=i.getAngleAxis(),a=i.getRadiusAxis();if(n.scale.setExtent(1/0,-1/0),a.scale.setExtent(1/0,-1/0),t.eachSeries(function(t){if(t.coordinateSystem===i){var e=t.getData();z(e.mapDimension("radius",!0),function(t){a.scale.unionExtentFromData(e,t);}),z(e.mapDimension("angle",!0),function(t){n.scale.unionExtentFromData(e,t);});}}),gf(n.scale,n.model),gf(a.scale,a.model),"category"===n.type&&!n.onBand){var o=n.getExtent(),r=360/n.scale.count();n.inverse?o[1]+=r:o[1]-=r,n.setExtent(o[0],o[1]);}}function TM(t,e){if(t.type=e.get("type"),t.scale=mf(e),t.onBand=e.get("boundaryGap")&&"category"===t.type,t.inverse=e.get("inverse"),"angleAxis"===e.mainType){t.inverse^=e.get("clockwise");var i=e.get("startAngle");t.setExtent(i,i+(t.inverse?-360:360));}(e.axis=t).model=e;}zp("angle",bM,MM,{startAngle:90,clockwise:!0,splitNumber:12,axisLabel:{rotate:!1}}),zp("radius",bM,MM,SM),qc({type:"polar",dependencies:["polarAxis","angleAxis"],coordinateSystem:null,findAxisModel:function findAxisModel(t){var e;return this.ecModel.eachComponent(t,function(t){t.getCoordSysModel()===this&&(e=t);},this),e;},defaultOption:{zlevel:0,z:0,center:["50%","50%"],radius:"80%"}}),ah.register("polar",{dimensions:wM.prototype.dimensions,create:function create(i,s){var l=[];return i.eachComponent("polar",function(t,e){var i=new wM(e);i.update=IM;var n=i.getRadiusAxis(),a=i.getAngleAxis(),o=t.findAxisModel("radiusAxis"),r=t.findAxisModel("angleAxis");TM(n,o),TM(a,r),function(t,e,i){var n=e.get("center"),a=i.getWidth(),o=i.getHeight();t.cx=Es(n[0],a),t.cy=Es(n[1],o);var r=t.getRadiusAxis(),s=Math.min(a,o)/2,l=Es(e.get("radius"),s);r.inverse?r.setExtent(l,0):r.setExtent(0,l);}(i,t,s),l.push(i),(t.coordinateSystem=i).model=t;}),i.eachSeries(function(t){if("polar"===t.get("coordinateSystem")){var e=i.queryComponents({mainType:"polar",index:t.get("polarIndex"),id:t.get("polarId")})[0];t.coordinateSystem=e.coordinateSystem;}}),l;}});var DM=["axisLine","axisLabel","axisTick","splitLine","splitArea"];function AM(t,e,i){e[1]>e[0]&&(e=e.slice().reverse());var n=t.coordToPoint([e[0],i]),a=t.coordToPoint([e[1],i]);return{x1:n[0],y1:n[1],x2:a[0],y2:a[1]};}function CM(t){return t.getRadiusAxis().inverse?0:1;}mg.extend({type:"angleAxis",axisPointerClass:"PolarAxisPointer",render:function render(e,t){if(this.group.removeAll(),e.get("show")){var i=e.axis,n=i.polar,a=n.getRadiusAxis().getExtent(),o=i.getTicksCoords();"category"!==i.type&&o.pop(),z(DM,function(t){!e.get(t+".show")||i.scale.isBlank()&&"axisLine"!==t||this["_"+t](e,n,o,a);},this);}},_axisLine:function _axisLine(t,e,i,n){var a=t.getModel("axisLine.lineStyle"),o=new ur({shape:{cx:e.cx,cy:e.cy,r:n[CM(e)]},style:a.getLineStyle(),z2:1,silent:!0});o.style.fill=null,this.group.add(o);},_axisTick:function _axisTick(t,e,i,n){var a=t.getModel("axisTick"),o=(a.get("inside")?-1:1)*a.get("length"),r=n[CM(e)],s=P(i,function(t){return new br({shape:AM(e,[r,r+o],t)});});this.group.add(Wr(s,{style:C(a.getModel("lineStyle").getLineStyle(),{stroke:t.get("axisLine.lineStyle.color")})}));},_axisLabel:function _axisLabel(t,e,i,n){for(var a=t.axis,o=t.getCategories(!0),r=t.getModel("axisLabel"),s=t.getFormattedLabels(),l=r.get("margin"),h=a.getLabelsCoords(),u=a.scale.getTicks(),c=0;c<u.length;c++){var d=r,f=u[c],p=n[CM(e)],g=e.coordToPoint([p+l,h[c]]),m=e.cx,v=e.cy,y=Math.abs(g[0]-m)/p<.3?"center":g[0]>m?"left":"right",x=Math.abs(g[1]-v)/p<.3?"middle":g[1]>v?"top":"bottom";o&&o[f]&&o[f].textStyle&&(d=new As(o[f].textStyle,r,r.ecModel));var _=new hr({silent:!0});this.group.add(_),rs(_.style,d,{x:g[0],y:g[1],textFill:d.getTextColor()||t.get("axisLine.lineStyle.color"),text:s[c],textAlign:y,textVerticalAlign:x});}},_splitLine:function _splitLine(t,e,i,n){var a=t.getModel("splitLine").getModel("lineStyle"),o=a.get("color"),r=0;o=o instanceof Array?o:[o];for(var s=[],l=0;l<i.length;l++){var h=r++%o.length;s[h]=s[h]||[],s[h].push(new br({shape:AM(e,n,i[l])}));}for(l=0;l<s.length;l++){this.group.add(Wr(s[l],{style:C({stroke:o[l%o.length]},a.getLineStyle()),silent:!0,z:t.get("z")}));}},_splitArea:function _splitArea(t,e,i,n){var a=t.getModel("splitArea").getModel("areaStyle"),o=a.get("color"),r=0;o=o instanceof Array?o:[o];for(var s=[],l=Math.PI/180,h=-i[0]*l,u=Math.min(n[0],n[1]),c=Math.max(n[0],n[1]),d=t.get("clockwise"),f=1;f<i.length;f++){var p=r++%o.length;s[p]=s[p]||[],s[p].push(new fr({shape:{cx:e.cx,cy:e.cy,r0:u,r:c,startAngle:h,endAngle:-i[f]*l,clockwise:d},silent:!0})),h=-i[f]*l;}for(f=0;f<s.length;f++){this.group.add(Wr(s[f],{style:C({fill:o[f%o.length]},a.getAreaStyle()),silent:!0}));}}});var LM=["axisLine","axisTickLabel","axisName"],kM=["splitLine","splitArea"];mg.extend({type:"radiusAxis",axisPointerClass:"PolarAxisPointer",render:function render(e,t){if(this.group.removeAll(),e.get("show")){var i,n,a,o=e.axis,r=o.polar,s=r.getAngleAxis(),l=o.getTicksCoords(),h=s.getExtent()[0],u=o.getExtent(),c=(n=e,a=h,{position:[(i=r).cx,i.cy],rotation:a/180*Math.PI,labelDirection:-1,tickDirection:-1,nameDirection:1,labelRotate:n.getModel("axisLabel").get("rotate"),z2:1}),d=new tg(e,c);z(LM,d.add,d),this.group.add(d.getGroup()),z(kM,function(t){e.get(t+".show")&&!o.scale.isBlank()&&this["_"+t](e,r,h,u,l);},this);}},_splitLine:function _splitLine(t,e,i,n,a){var o=t.getModel("splitLine").getModel("lineStyle"),r=o.get("color"),s=0;r=r instanceof Array?r:[r];for(var l=[],h=0;h<a.length;h++){var u=s++%r.length;l[u]=l[u]||[],l[u].push(new ur({shape:{cx:e.cx,cy:e.cy,r:a[h]},silent:!0}));}for(h=0;h<l.length;h++){this.group.add(Wr(l[h],{style:C({stroke:r[h%r.length],fill:null},o.getLineStyle()),silent:!0}));}},_splitArea:function _splitArea(t,e,i,n,a){var o=t.getModel("splitArea").getModel("areaStyle"),r=o.get("color"),s=0;r=r instanceof Array?r:[r];for(var l=[],h=a[0],u=1;u<a.length;u++){var c=s++%r.length;l[c]=l[c]||[],l[c].push(new fr({shape:{cx:e.cx,cy:e.cy,r0:h,r:a[u],startAngle:0,endAngle:2*Math.PI},silent:!0})),h=a[u];}for(u=0;u<l.length;u++){this.group.add(Wr(l[u],{style:C({fill:r[u%r.length]},o.getAreaStyle()),silent:!0}));}}});var PM=Fb.extend({makeElOption:function makeElOption(t,e,i,n,a){var o=i.axis;"angle"===o.dim&&(this.animationThreshold=Math.PI/18);var r,s=o.polar,l=s.getOtherAxis(o).getExtent();r=o["dataTo"+dl(o.dim)](e);var h=n.get("type");if(h&&"none"!==h){var u=Xb(n),c=NM[h](o,s,r,l,u);c.style=u,t.graphicKey=c.type,t.pointer=c;}Yb(t,i,n,a,function(t,e,i,n,a){var o=e.axis,r=o.dataToCoord(t),s=n.getAngleAxis().getExtent()[0];s=s/180*Math.PI;var l,h,u,c=n.getRadiusAxis().getExtent();if("radius"===o.dim){var d=Et();Gt(d,d,s),Vt(d,d,[n.cx,n.cy]),l=ms([r,-a],d);var f=e.getModel("axisLabel").get("rotate")||0,p=tg.innerTextLayout(s,f*Math.PI/180,-1);h=p.textAlign,u=p.textVerticalAlign;}else{var g=c[1];l=n.coordToPoint([g+a,r]);var m=n.cx,v=n.cy;h=Math.abs(l[0]-m)/g<.3?"center":l[0]>m?"left":"right",u=Math.abs(l[1]-v)/g<.3?"middle":l[1]>v?"top":"bottom";}return{position:l,align:h,verticalAlign:u};}(e,i,0,s,n.get("label.margin")));}});var NM={line:function line(t,e,i,n,a){return"angle"===t.dim?{type:"Line",shape:Jb(e.coordToPoint([n[0],i]),e.coordToPoint([n[1],i]))}:{type:"Circle",shape:{cx:e.cx,cy:e.cy,r:i}};},shadow:function shadow(t,e,i,n,a){var o=t.getBandWidth(),r=Math.PI/180;return"angle"===t.dim?{type:"Sector",shape:tS(e.cx,e.cy,n[0],n[1],(-i-o/2)*r,(o/2-i)*r)}:{type:"Sector",shape:tS(e.cx,e.cy,i-o/2,i+o/2,0,2*Math.PI)};}};function OM(n,t){t.update="updateView",Hc(t,function(t,e){var i={};return e.eachComponent({mainType:"geo",query:t},function(e){e[n](t.name),z(e.coordinateSystem.regions,function(t){i[t.name]=e.isSelected(t.name)||!1;});}),{selected:i,name:t.name};});}mg.registerAxisPointerClass("PolarAxisPointer",PM),Uc(N(function(t,e,i){var P=i.getWidth(),N=i.getHeight(),O={},E=function(t,e){var p={};z(t,function(t,e){var i=t.getData(),n=t.coordinateSystem,a=n.getBaseAxis(),o=a.getExtent(),r="category"===a.type?a.getBandWidth():Math.abs(o[1]-o[0])/i.count(),s=p[yM(a)]||{bandWidth:r,remainedWidth:r,autoWidthCount:0,categoryGap:"20%",gap:"30%",stacks:{}},l=s.stacks;p[yM(a)]=s;var h=vM(t);l[h]||s.autoWidthCount++,l[h]=l[h]||{width:0,maxWidth:0};var u=Es(t.get("barWidth"),r),c=Es(t.get("barMaxWidth"),r),d=t.get("barGap"),f=t.get("barCategoryGap");u&&!l[h].width&&(u=Math.min(s.remainedWidth,u),l[h].width=u,s.remainedWidth-=u),c&&(l[h].maxWidth=c),null!=d&&(s.gap=d),null!=f&&(s.categoryGap=f);});var d={};return z(p,function(t,i){d[i]={};var e=t.stacks,n=t.bandWidth,a=Es(t.categoryGap,n),o=Es(t.gap,1),r=t.remainedWidth,s=t.autoWidthCount,l=(r-a)/(s+(s-1)*o);l=Math.max(l,0),z(e,function(t,e){var i=t.maxWidth;i&&i<l&&(i=Math.min(i,r),t.width&&(i=Math.min(i,t.width)),r-=i,t.width=i,s--);}),l=(r-a)/(s+(s-1)*o),l=Math.max(l,0);var h,u=0;z(e,function(t,e){t.width||(t.width=l),u+=(h=t).width*(1+o);}),h&&(u-=h.width*o);var c=-u/2;z(e,function(t,e){d[i][e]=d[i][e]||{offset:c,width:t.width},c+=t.width*(1+o);});}),d;}(T(e.getSeriesByType(t),function(t){return!e.isSeriesFiltered(t)&&t.coordinateSystem&&"polar"===t.coordinateSystem.type;}));e.eachSeriesByType(t,function(t){if("polar"===t.coordinateSystem.type){var e=t.getData(),i=t.coordinateSystem,n=i.getBaseAxis(),a=vM(t),o=E[yM(n)][a],r=o.offset,s=o.width,l=i.getOtherAxis(n),h=t.get("center")||["50%","50%"],u=Es(h[0],P),c=Es(h[1],N),d=t.get("barMinHeight")||0,f=t.get("barMinAngle")||0;O[a]=O[a]||[];for(var p=e.mapDimension(l.dim),g=e.mapDimension(n.dim),m=Cd(e,p,g),v=l.getExtent()[0],y=0,x=e.count();y<x;y++){var _=e.get(p,y),w=e.get(g,y);if(!isNaN(_)){var b,S,M,I,T=0<=_?"p":"n",D=v;if(m&&(O[a][w]||(O[a][w]={p:v,n:v}),D=O[a][w][T]),"radius"===l.dim){var A=l.dataToRadius(_)-v,C=n.dataToAngle(w);Math.abs(A)<d&&(A=(A<0?-1:1)*d),S=(b=D)+A,I=(M=C-r)-s,m&&(O[a][w][T]=S);}else{var L=l.dataToAngle(_,!0)-v,k=n.dataToRadius(w);Math.abs(L)<f&&(L=(L<0?-1:1)*f),S=(b=k+r)+s,I=(M=D)+L,m&&(O[a][w][T]=I);}e.setItemLayout(y,{cx:u,cy:c,r0:b,r:S,startAngle:-M*Math.PI/180,endAngle:-I*Math.PI/180});}}}},this);},"bar")),Kc({type:"polar"}),w(Cl.extend({type:"geo",coordinateSystem:null,layoutMode:"box",init:function init(t){Cl.prototype.init.apply(this,arguments),sa(t,"label",["show"]);},optionUpdated:function optionUpdated(){var t=this.option,i=this;t.regions=wm.getFilledRegions(t.regions,t.map,t.nameMap),this._optionModelMap=b(t.regions||[],function(t,e){return e.name&&t.set(e.name,new As(e,i)),t;},J()),this.updateSelectedMap(t.regions);},defaultOption:{zlevel:0,z:0,show:!0,left:"center",top:"center",aspectScale:.75,silent:!1,map:"",boundingCoords:null,center:null,zoom:1,scaleLimit:null,label:{show:!1,color:"#000"},itemStyle:{borderWidth:.5,borderColor:"#444",color:"#eee"},emphasis:{label:{show:!0,color:"rgb(100,0,0)"},itemStyle:{color:"rgba(255,215,0,0.8)"}},regions:[]},getRegionModel:function getRegionModel(t){return this._optionModelMap.get(t)||new As(null,this,this.ecModel);},getFormattedLabel:function getFormattedLabel(t,e){var i=this.getRegionModel(t).get("label."+e+".formatter"),n={name:t};return"function"==typeof i?(n.status=e,i(n)):"string"==typeof i?i.replace("{a}",null!=t?t:""):void 0;},setZoom:function setZoom(t){this.option.zoom=t;},setCenter:function setCenter(t){this.option.center=t;}}),zg),Kc({type:"geo",init:function init(t,e){var i=new Gm(e,!0);this._mapDraw=i,this.group.add(i.group);},render:function render(t,e,i,n){if(!n||"geoToggleSelect"!==n.type||n.from!==this.uid){var a=this._mapDraw;t.get("show")?a.draw(t,e,i,this,n):this._mapDraw.group.removeAll(),this.group.silent=t.get("silent");}},dispose:function dispose(){this._mapDraw&&this._mapDraw.remove();}}),OM("toggleSelected",{type:"geoToggleSelect",event:"geoselectchanged"}),OM("select",{type:"geoSelect",event:"geoselected"}),OM("unSelect",{type:"geoUnSelect",event:"geounselected"});var EM=["rect","polygon","keep","clear"];var RM=z;function zM(t){if(t)for(var e in t){if(t.hasOwnProperty(e))return!0;}}function BM(e,t,o){var i={};return RM(t,function(n){var t,a=i[n]=((t=function t(){}).prototype.__hidden=t.prototype,new t());RM(e[n],function(t,e){if(Fv.isValidType(e)){var i={type:e,visual:t};o&&o(i,n),a[e]=new Fv(i),"opacity"===e&&((i=A(i)).type="colorAlpha",a.__hidden.__alphaForOpacity=new Fv(i));}});}),i;}function VM(e,i,t){var n;z(t,function(t){i.hasOwnProperty(t)&&zM(i[t])&&(n=!0);}),n&&z(t,function(t){i.hasOwnProperty(t)&&zM(i[t])?e[t]=A(i[t]):delete e[t];});}var GM={lineX:WM(0),lineY:WM(1),rect:{point:function point(t,e,i){return t&&i.boundingRect.contain(t[0],t[1]);},rect:function rect(t,e,i){return t&&i.boundingRect.intersect(t);}},polygon:{point:function point(t,e,i){return t&&i.boundingRect.contain(t[0],t[1])&&Of(i.range,t[0],t[1]);},rect:function rect(t,e,i){var n=i.range;if(!t||n.length<=1)return!1;var a=t.x,o=t.y,r=t.width,s=t.height,l=n[0];return!!(Of(n,a,o)||Of(n,a+r,o)||Of(n,a,o+s)||Of(n,a+r,o+s)||ei.create(t).contain(l[0],l[1])||HM(a,o,a+r,o,n)||HM(a,o,a,o+s,n)||HM(a+r,o,a+r,o+s,n)||HM(a,o+s,a+r,o+s,n))||void 0;}}};function WM(o){var r=["x","y"],s=["width","height"];return{point:function point(t,e,i){if(t){var n=i.range;return FM(t[o],n);}},rect:function rect(t,e,i){if(t){var n=i.range,a=[t[r[o]],t[r[o]]+t[s[o]]];return a[1]<a[0]&&a.reverse(),FM(a[0],n)||FM(a[1],n)||FM(n[0],a)||FM(n[1],a);}}};}function FM(t,e){return e[0]<=t&&t<=e[1];}function HM(t,e,i,n,a){for(var o=0,r=a[a.length-1];o<a.length;o++){var s=a[o];if(ZM(t,e,i,n,s[0],s[1],r[0],r[1]))return!0;r=s;}}function ZM(t,e,i,n,a,o,r,s){var l,h=UM(i-t,a-r,n-e,o-s);if((l=h)<=1e-6&&-1e-6<=l)return!1;var u=UM(a-t,a-r,o-e,o-s)/h;if(u<0||1<u)return!1;var c=UM(i-t,a-t,n-e,o-e)/h;return!(c<0||1<c);}function UM(t,e,i,n){return t*n-e*i;}var jM=z,XM=L,YM=N,qM=["dataToPoint","pointToData"],KM=["grid","xAxis","yAxis","geo","graph","polar","radiusAxis","angleAxis","bmap"];function $M(t,e,i){var n=this._targetInfoList=[],a={},o=tI(e,t);jM(eI,function(t,e){(!i||!i.include||0<=XM(i.include,e))&&t(o,n,a);});}var JM=$M.prototype;function QM(t){return t[0]>t[1]&&t.reverse(),t;}function tI(t,e){return va(t,e,{includeMainTypes:KM});}JM.setOutputRanges=function(t,e){this.matchOutputRanges(t,e,function(t,e,i){if((t.coordRanges||(t.coordRanges=[])).push(e),!t.coordRange){t.coordRange=e;var n=aI[t.brushType](0,i,e);t.__rangeOffset={offset:rI[t.brushType](n.values,t.range,[1,1]),xyMinMax:n.xyMinMax};}});},JM.matchOutputRanges=function(t,n,a){jM(t,function(i){var t=this.findTargetInfo(i,n);t&&!0!==t&&z(t.coordSyses,function(t){var e=aI[i.brushType](1,t,i.range);a(i,e.values,t,n);});},this);},JM.setInputRanges=function(t,h){jM(t,function(t){var e,i,n,a,o,r=this.findTargetInfo(t,h);if(t.range=t.range||[],r&&!0!==r){t.panelId=r.panelId;var s=aI[t.brushType](0,r.coordSys,t.coordRange),l=t.__rangeOffset;t.range=l?rI[t.brushType](s.values,l.offset,(e=s.xyMinMax,i=l.xyMinMax,n=lI(e),a=lI(i),o=[n[0]/a[0],n[1]/a[1]],isNaN(o[0])&&(o[0]=1),isNaN(o[1])&&(o[1]=1),o)):s.values;}},this);},JM.makePanelOpts=function(i,n){return P(this._targetInfoList,function(t){var e=t.getPanelRect();return{panelId:t.panelId,defaultBrushType:n&&n(t),clipPath:y_(e),isTargetByCursor:__(e,i,t.coordSysModel),getLinearBrushOtherExtent:x_(e)};});},JM.controlSeries=function(t,e,i){var n=this.findTargetInfo(t,i);return!0===n||n&&0<=XM(n.coordSyses,e.coordinateSystem);},JM.findTargetInfo=function(t,e){for(var i=this._targetInfoList,n=tI(e,t),a=0;a<i.length;a++){var o=i[a],r=t.panelId;if(r){if(o.panelId===r)return o;}else for(a=0;a<iI.length;a++){if(iI[a](n,o))return o;}}return!0;};var eI={grid:function grid(t,n){var a=t.xAxisModels,o=t.yAxisModels,e=t.gridModels,i=J(),r={},s={};(a||o||e)&&(jM(a,function(t){var e=t.axis.grid.model;i.set(e.id,e),r[e.id]=!0;}),jM(o,function(t){var e=t.axis.grid.model;i.set(e.id,e),s[e.id]=!0;}),jM(e,function(t){i.set(t.id,t),r[t.id]=!0,s[t.id]=!0;}),i.each(function(t){var e=t.coordinateSystem,i=[];jM(e.getCartesians(),function(t,e){(0<=XM(a,t.getAxis("x").model)||0<=XM(o,t.getAxis("y").model))&&i.push(t);}),n.push({panelId:"grid--"+t.id,gridModel:t,coordSysModel:t,coordSys:i[0],coordSyses:i,getPanelRect:nI.grid,xAxisDeclared:r[t.id],yAxisDeclared:s[t.id]});}));},geo:function geo(t,i){jM(t.geoModels,function(t){var e=t.coordinateSystem;i.push({panelId:"geo--"+t.id,geoModel:t,coordSysModel:t,coordSys:e,coordSyses:[e],getPanelRect:nI.geo});});}},iI=[function(t,e){var i=t.xAxisModel,n=t.yAxisModel,a=t.gridModel;return!a&&i&&(a=i.axis.grid.model),!a&&n&&(a=n.axis.grid.model),a&&a===e.gridModel;},function(t,e){var i=t.geoModel;return i&&i===e.geoModel;}],nI={grid:function grid(){return this.coordSys.grid.getRect().clone();},geo:function geo(){var t=this.coordSys,e=t.getBoundingRect().clone();return e.applyTransform(gs(t)),e;}},aI={lineX:YM(oI,0),lineY:YM(oI,1),rect:function rect(t,e,i){var n=e[qM[t]]([i[0][0],i[1][0]]),a=e[qM[t]]([i[0][1],i[1][1]]),o=[QM([n[0],a[0]]),QM([n[1],a[1]])];return{values:o,xyMinMax:o};},polygon:function polygon(i,n,t){var a=[[1/0,-1/0],[1/0,-1/0]];return{values:P(t,function(t){var e=n[qM[i]](t);return a[0][0]=Math.min(a[0][0],e[0]),a[1][0]=Math.min(a[1][0],e[1]),a[0][1]=Math.max(a[0][1],e[0]),a[1][1]=Math.max(a[1][1],e[1]),e;}),xyMinMax:a};}};function oI(t,e,i,n){var a=i.getAxis(["x","y"][t]),o=QM(P([0,1],function(t){return e?a.coordToData(a.toLocalCoord(n[t])):a.toGlobalCoord(a.dataToCoord(n[t]));})),r=[];return r[t]=o,r[1-t]=[NaN,NaN],{values:o,xyMinMax:r};}var rI={lineX:YM(sI,0),lineY:YM(sI,1),rect:function rect(t,e,i){return[[t[0][0]-i[0]*e[0][0],t[0][1]-i[0]*e[0][1]],[t[1][0]-i[1]*e[1][0],t[1][1]-i[1]*e[1][1]]];},polygon:function polygon(t,i,n){return P(t,function(t,e){return[t[0]-n[0]*i[e][0],t[1]-n[1]*i[e][1]];});}};function sI(t,e,i,n){return[e[0]-n[t]*i[0],e[1]-n[t]*i[1]];}function lI(t){return t?[t[0][1]-t[0][0],t[1][1]-t[1][0]]:[NaN,NaN];}var hI=["inBrush","outOfBrush"],uI="__ecBrushSelect",cI="__ecInBrushSelectEvent",dI=tc.VISUAL.BRUSH;function fI(t,e){if(!t.isDisposed()){var i=t.getZr();i[cI]=!0,t.dispatchAction({type:"brushSelect",batch:e}),i[cI]=!1;}}function pI(t,e,i,n){for(var a=0,o=e.length;a<o;a++){var r=e[a];if(t[r.brushType](n,i,r.selectors,r))return!0;}}function gI(t){var r=t.brushSelector;if(D(r)){var e=[];return z(GM,function(o,t){e[t]=function(t,e,i,n){var a=e.getItemLayout(t);return o[r](a,i,n);};}),e;}if(M(r)){var i={};return z(GM,function(t,e){i[e]=r;}),i;}return r;}Uc(dI,function(e,t,i){e.eachComponent({mainType:"brush"},function(t){i&&"takeGlobalCursor"===i.type&&t.setBrushOption("brush"===i.key?i.brushOption:{brushType:!1}),(t.brushTargetManager=new $M(t.option,e)).setInputRanges(t.areas,e);});}),jc(dI,function(m,t,e){var a,o,r=[];m.eachComponent({mainType:"brush"},function(l,t){var s={brushId:l.id,brushIndex:t,brushName:l.name,areas:A(l.areas),selected:[]};r.push(s);var e=l.option,i=e.brushLink,n=[],h=[],u=[],c=0;t||(a=e.throttleType,o=e.throttleDelay);var d=P(l.areas,function(t){return i=C({boundingRect:mI[t.brushType](t)},t),n=i.selectors={},z(GM[i.brushType],function(e,t){n[t]=function(t){return e(t,n,i);};}),i;var i,n;}),f=BM(l.option,hI,function(t){t.mappingMethod="fixed";});function p(t){return"all"===i||n[t];}function g(t){return!!t.length;}E(i)&&z(i,function(t){n[t]=1;}),m.eachSeries(function(t,e){var i,n,a,o=u[e]=[];"parallel"===t.subType?(n=e,a=(i=t).coordinateSystem,c|=a.hasAxisBrushed(),p(n)&&a.eachActiveState(i.getData(),function(t,e){"active"===t&&(h[e]=1);})):function(e,t,i){var n=gI(e);if(!n||(a=l,o=t,r=a.option.seriesIndex,null!=r&&"all"!==r&&(E(r)?L(r,o)<0:o!==r)))return;var a,o,r;if(z(d,function(t){n[t.brushType]&&l.brushTargetManager.controlSeries(t,e,m)&&i.push(t),c|=g(i);}),p(t)&&g(i)){var s=e.getData();s.each(function(t){pI(n,i,s,t)&&(h[t]=1);});}}(t,e,o);}),m.eachSeries(function(t,e){var i={seriesId:t.id,seriesIndex:e,seriesName:t.name,dataIndex:[]};s.selected.push(i);var n=gI(t),a=u[e],o=t.getData(),r=p(e)?function(t){return h[t]?(i.dataIndex.push(o.getRawIndex(t)),"inBrush"):"outOfBrush";}:function(t){return pI(n,a,o,t)?(i.dataIndex.push(o.getRawIndex(t)),"inBrush"):"outOfBrush";};(p(e)?c:g(a))&&function(t,h,u,c,d,f){var p,g={};function m(t){return u.getItemVisual(p,t);}function v(t,e){u.setItemVisual(p,t,e);}function e(t,e){p=null==f?t:e;var i=u.getRawDataItem(p);if(!i||!1!==i.visualMap)for(var n=c.call(d,t),a=h[n],o=g[n],r=0,s=o.length;r<s;r++){var l=o[r];a[l]&&a[l].applyVisual(t,m,v);}}z(t,function(t){var e=Fv.prepareVisualTypes(h[t]);g[t]=e;}),null==f?u.each(e):u.each([f],e);}(hI,f,o,r);});}),function(t,e,i,n,a){if(!a)return;var o=t.getZr();if(o[cI])return;o[uI]||(o[uI]=fI);vu(o,uI,i,e)(t,n);}(t,a,o,r,e);});var mI={lineX:tt,lineY:tt,rect:function rect(t){return vI(t.range);},polygon:function polygon(t){for(var e,i=t.range,n=0,a=i.length;n<a;n++){e=e||[[1/0,-1/0],[1/0,-1/0]];var o=i[n];o[0]<e[0][0]&&(e[0][0]=o[0]),o[0]>e[0][1]&&(e[0][1]=o[0]),o[1]<e[1][0]&&(e[1][0]=o[1]),o[1]>e[1][1]&&(e[1][1]=o[1]);}return e&&vI(e);}};function vI(t){return new ei(t[0][0],t[1][0],t[0][1]-t[0][0],t[1][1]-t[1][0]);}var yI=["#ddd"];qc({type:"brush",dependencies:["geo","grid","xAxis","yAxis","parallel","series"],defaultOption:{toolbox:null,brushLink:null,seriesIndex:"all",geoIndex:null,xAxisIndex:null,yAxisIndex:null,brushType:"rect",brushMode:"single",transformable:!0,brushStyle:{borderWidth:1,color:"rgba(120,140,180,0.3)",borderColor:"rgba(120,140,180,0.8)"},throttleType:"fixRate",throttleDelay:0,removeOnClick:!0,z:1e4},areas:[],brushType:null,brushOption:{},coordInfoList:[],optionUpdated:function optionUpdated(t,e){var i=this.option;!e&&VM(i,t,["inBrush","outOfBrush"]),i.inBrush=i.inBrush||{},i.outOfBrush=i.outOfBrush||{color:yI};},setAreas:function setAreas(t){t&&(this.areas=P(t,function(t){return xI(this.option,t);},this));},setBrushOption:function setBrushOption(t){this.brushOption=xI(this.option,t),this.brushType=this.brushOption.brushType;}});function xI(t,e){return g({brushType:t.brushType,brushMode:t.brushMode,transformable:t.transformable,brushStyle:new As(t.brushStyle).getItemStyle(),removeOnClick:t.removeOnClick,z:t.z},e,!0);}function _I(t,e,i,n){(!n||n.$from!==t.id)&&this._brushController.setPanels(t.brushTargetManager.makePanelOpts(i)).enableBrush(t.brushOption).updateCovers(t.areas.slice());}Kc({type:"brush",init:function init(t,e){this.ecModel=t,this.api=e,this.model,(this._brushController=new Fx(e.getZr())).on("brush",S(this._onBrush,this)).mount();},render:function render(t){return this.model=t,_I.apply(this,arguments);},updateTransform:_I,updateView:_I,dispose:function dispose(){this._brushController.dispose();},_onBrush:function _onBrush(t,e){var i=this.model.id;this.model.brushTargetManager.setOutputRanges(t,this.ecModel),(!e.isEnd||e.removeOnClick)&&this.api.dispatchAction({type:"brush",brushId:i,areas:A(t),$from:i});}}),Hc({type:"brush",event:"brush"},function(e,t){t.eachComponent({mainType:"brush",query:e},function(t){t.setAreas(e.areas);});}),Hc({type:"brushSelect",event:"brushSelected",update:"none"},function(){});var wI={};function bI(t,e){wI[t]=e;}function SI(t){return wI[t];}var MI=_u.toolbox.brush;function II(t,e,i){this.model=t,this.ecModel=e,this.api=i,this._brushType,this._brushMode;}II.defaultOption={show:!0,type:["rect","polygon","lineX","lineY","keep","clear"],icon:{rect:"M7.3,34.7 M0.4,10V-0.2h9.8 M89.6,10V-0.2h-9.8 M0.4,60v10.2h9.8 M89.6,60v10.2h-9.8 M12.3,22.4V10.5h13.1 M33.6,10.5h7.8 M49.1,10.5h7.8 M77.5,22.4V10.5h-13 M12.3,31.1v8.2 M77.7,31.1v8.2 M12.3,47.6v11.9h13.1 M33.6,59.5h7.6 M49.1,59.5 h7.7 M77.5,47.6v11.9h-13",polygon:"M55.2,34.9c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1 s-3.1-1.4-3.1-3.1S53.5,34.9,55.2,34.9z M50.4,51c1.7,0,3.1,1.4,3.1,3.1c0,1.7-1.4,3.1-3.1,3.1c-1.7,0-3.1-1.4-3.1-3.1 C47.3,52.4,48.7,51,50.4,51z M55.6,37.1l1.5-7.8 M60.1,13.5l1.6-8.7l-7.8,4 M59,19l-1,5.3 M24,16.1l6.4,4.9l6.4-3.3 M48.5,11.6 l-5.9,3.1 M19.1,12.8L9.7,5.1l1.1,7.7 M13.4,29.8l1,7.3l6.6,1.6 M11.6,18.4l1,6.1 M32.8,41.9 M26.6,40.4 M27.3,40.2l6.1,1.6 M49.9,52.1l-5.6-7.6l-4.9-1.2",lineX:"M15.2,30 M19.7,15.6V1.9H29 M34.8,1.9H40.4 M55.3,15.6V1.9H45.9 M19.7,44.4V58.1H29 M34.8,58.1H40.4 M55.3,44.4 V58.1H45.9 M12.5,20.3l-9.4,9.6l9.6,9.8 M3.1,29.9h16.5 M62.5,20.3l9.4,9.6L62.3,39.7 M71.9,29.9H55.4",lineY:"M38.8,7.7 M52.7,12h13.2v9 M65.9,26.6V32 M52.7,46.3h13.2v-9 M24.9,12H11.8v9 M11.8,26.6V32 M24.9,46.3H11.8v-9 M48.2,5.1l-9.3-9l-9.4,9.2 M38.9-3.9V12 M48.2,53.3l-9.3,9l-9.4-9.2 M38.9,62.3V46.4",keep:"M4,10.5V1h10.3 M20.7,1h6.1 M33,1h6.1 M55.4,10.5V1H45.2 M4,17.3v6.6 M55.6,17.3v6.6 M4,30.5V40h10.3 M20.7,40 h6.1 M33,40h6.1 M55.4,30.5V40H45.2 M21,18.9h62.9v48.6H21V18.9z",clear:"M22,14.7l30.9,31 M52.9,14.7L22,45.7 M4.7,16.8V4.2h13.1 M26,4.2h7.8 M41.6,4.2h7.8 M70.3,16.8V4.2H57.2 M4.7,25.9v8.6 M70.3,25.9v8.6 M4.7,43.2v12.6h13.1 M26,55.8h7.8 M41.6,55.8h7.8 M70.3,43.2v12.6H57.2"},title:A(MI.title)};var TI=II.prototype;TI.render=TI.updateView=function(e,t,i){var n,a,o;t.eachComponent({mainType:"brush"},function(t){n=t.brushType,a=t.brushOption.brushMode||"single",o|=t.areas.length;}),this._brushType=n,this._brushMode=a,z(e.get("type",!0),function(t){e.setIconStatus(t,("keep"===t?"multiple"===a:"clear"===t?o:t===n)?"emphasis":"normal");});},TI.getIcons=function(){var t=this.model,e=t.get("icon",!0),i={};return z(t.get("type",!0),function(t){e[t]&&(i[t]=e[t]);}),i;},TI.onclick=function(t,e,i){var n=this._brushType,a=this._brushMode;"clear"===i?(e.dispatchAction({type:"axisAreaSelect",intervals:[]}),e.dispatchAction({type:"brush",command:"clear",areas:[]})):e.dispatchAction({type:"takeGlobalCursor",key:"brush",brushOption:{brushType:"keep"===i?n:n!==i&&i,brushMode:"keep"===i?"multiple"===a?"single":"multiple":a}});},bI("brush",II),Wc(function(t,e){var i=t&&t.brush;if(E(i)||(i=i?[i]:[]),i.length){var n=[];z(i,function(t){var e=t.hasOwnProperty("toolbox")?t.toolbox:[];e instanceof Array&&(n=n.concat(e));});var a=t&&t.toolbox;E(a)&&(a=a[0]),a||(a={feature:{}},t.toolbox=[a]);var o,r,s=a.feature||(a.feature={}),l=s.brush||(s.brush={}),h=l.type||(l.type=[]);h.push.apply(h,n),r={},z(o=h,function(t){r[t]=1;}),o.length=0,z(r,function(t,e){o.push(e);}),e&&!h.length&&h.push.apply(h,EM);}});function DI(t,e,i){this._model=t;}function AI(t,e,i,n){var a=i.calendarModel,o=i.seriesModel,r=a?a.coordinateSystem:o?o.coordinateSystem:null;return r===this?r[t](n):null;}DI.prototype={constructor:DI,type:"calendar",dimensions:["time","value"],getDimensionsInfo:function getDimensionsInfo(){return[{name:"time",type:"time"},"value"];},getRangeInfo:function getRangeInfo(){return this._rangeInfo;},getModel:function getModel(){return this._model;},getRect:function getRect(){return this._rect;},getCellWidth:function getCellWidth(){return this._sw;},getCellHeight:function getCellHeight(){return this._sh;},getOrient:function getOrient(){return this._orient;},getFirstDayOfWeek:function getFirstDayOfWeek(){return this._firstDayOfWeek;},getDateInfo:function getDateInfo(t){var e=(t=js(t)).getFullYear(),i=t.getMonth()+1;i=i<10?"0"+i:i;var n=t.getDate();n=n<10?"0"+n:n;var a=t.getDay();return{y:e,m:i,d:n,day:a=Math.abs((a+7-this.getFirstDayOfWeek())%7),time:t.getTime(),formatedDate:e+"-"+i+"-"+n,date:t};},getNextNDay:function getNextNDay(t,e){return 0===(e=e||0)||(t=new Date(this.getDateInfo(t).time)).setDate(t.getDate()+e),this.getDateInfo(t);},update:function update(t,e){this._firstDayOfWeek=+this._model.getModel("dayLabel").get("firstDay"),this._orient=this._model.get("orient"),this._lineWidth=this._model.getModel("itemStyle").getItemStyle().lineWidth||0,this._rangeInfo=this._getRangeInfo(this._initRangeOption());var i=this._rangeInfo.weeks||1,n=["width","height"],a=this._model.get("cellSize").slice(),o=this._model.getBoxLayoutParams(),r="horizontal"===this._orient?[i,7]:[7,i];z([0,1],function(t){h(a,t)&&(o[n[t]]=a[t]*r[t]);});var s={width:e.getWidth(),height:e.getHeight()},l=this._rect=wl(o,s);function h(t,e){return null!=t[e]&&"auto"!==t[e];}z([0,1],function(t){h(a,t)||(a[t]=l[n[t]]/r[t]);}),this._sw=a[0],this._sh=a[1];},dataToPoint:function dataToPoint(t,e){E(t)&&(t=t[0]),null==e&&(e=!0);var i=this.getDateInfo(t),n=this._rangeInfo,a=i.formatedDate;if(e&&!(i.time>=n.start.time&&i.time<n.end.time+864e5))return[NaN,NaN];var o=i.day,r=this._getRangeInfo([n.start.time,a]).nthWeek;return"vertical"===this._orient?[this._rect.x+o*this._sw+this._sw/2,this._rect.y+r*this._sh+this._sh/2]:[this._rect.x+r*this._sw+this._sw/2,this._rect.y+o*this._sh+this._sh/2];},pointToData:function pointToData(t){var e=this.pointToDate(t);return e&&e.time;},dataToRect:function dataToRect(t,e){var i=this.dataToPoint(t,e);return{contentShape:{x:i[0]-(this._sw-this._lineWidth)/2,y:i[1]-(this._sh-this._lineWidth)/2,width:this._sw-this._lineWidth,height:this._sh-this._lineWidth},center:i,tl:[i[0]-this._sw/2,i[1]-this._sh/2],tr:[i[0]+this._sw/2,i[1]-this._sh/2],br:[i[0]+this._sw/2,i[1]+this._sh/2],bl:[i[0]-this._sw/2,i[1]+this._sh/2]};},pointToDate:function pointToDate(t){var e=Math.floor((t[0]-this._rect.x)/this._sw)+1,i=Math.floor((t[1]-this._rect.y)/this._sh)+1,n=this._rangeInfo.range;return"vertical"===this._orient?this._getDateByWeeksAndDay(i,e-1,n):this._getDateByWeeksAndDay(e,i-1,n);},convertToPixel:N(AI,"dataToPoint"),convertFromPixel:N(AI,"pointToData"),_initRangeOption:function _initRangeOption(){var t=this._model.get("range"),e=t;if(E(e)&&1===e.length&&(e=e[0]),/^\d{4}$/.test(e)&&(t=[e+"-01-01",e+"-12-31"]),/^\d{4}[\/|-]\d{1,2}$/.test(e)){var i=this.getDateInfo(e),n=i.date;n.setMonth(n.getMonth()+1);var a=this.getNextNDay(n,-1);t=[i.formatedDate,a.formatedDate];}/^\d{4}[\/|-]\d{1,2}[\/|-]\d{1,2}$/.test(e)&&(t=[e,e]);var o=this._getRangeInfo(t);return o.start.time>o.end.time&&t.reverse(),t;},_getRangeInfo:function _getRangeInfo(t){var e;(t=[this.getDateInfo(t[0]),this.getDateInfo(t[1])])[0].time>t[1].time&&(e=!0,t.reverse());var i=Math.floor(t[1].time/864e5)-Math.floor(t[0].time/864e5)+1,n=new Date(t[0].time),a=n.getDate(),o=t[1].date.getDate();if(n.setDate(a+i-1),n.getDate()!==o)for(var r=0<n.getTime()-t[1].time?1:-1;n.getDate()!==o&&0<(n.getTime()-t[1].time)*r;){i-=r,n.setDate(a+i-1);}var s=Math.floor((i+t[0].day+6)/7),l=e?1-s:s-1;return e&&t.reverse(),{range:[t[0].formatedDate,t[1].formatedDate],start:t[0],end:t[1],allDay:i,weeks:s,nthWeek:l,fweek:t[0].day,lweek:t[1].day};},_getDateByWeeksAndDay:function _getDateByWeeksAndDay(t,e,i){var n=this._getRangeInfo(i);if(t>n.weeks||0===t&&e<n.fweek||t===n.weeks&&e>n.lweek)return!1;var a=7*(t-1)-n.fweek+e,o=new Date(n.start.time);return o.setDate(n.start.d+a),this.getDateInfo(o);}},DI.dimensions=DI.prototype.dimensions,DI.getDimensionsInfo=DI.prototype.getDimensionsInfo,DI.create=function(i,n){var a=[];return i.eachComponent("calendar",function(t){var e=new DI(t,i,n);a.push(e),t.coordinateSystem=e;}),i.eachSeries(function(t){"calendar"===t.get("coordinateSystem")&&(t.coordinateSystem=a[t.get("calendarIndex")||0]);}),a;},ah.register("calendar",DI);var CI=Cl.extend({type:"calendar",coordinateSystem:null,defaultOption:{zlevel:0,z:2,left:80,top:60,cellSize:20,orient:"horizontal",splitLine:{show:!0,lineStyle:{color:"#000",width:1,type:"solid"}},itemStyle:{color:"#fff",borderWidth:1,borderColor:"#ccc"},dayLabel:{show:!0,firstDay:0,position:"start",margin:"50%",nameMap:"en",color:"#000"},monthLabel:{show:!0,position:"start",margin:5,align:"center",nameMap:"en",formatter:null,color:"#000"},yearLabel:{show:!0,position:null,margin:30,formatter:null,color:"#ccc",fontFamily:"sans-serif",fontWeight:"bolder",fontSize:20}},init:function init(t,e,i,n){var a=Ml(t);CI.superApply(this,"init",arguments),LI(t,a);},mergeOption:function mergeOption(t,e){CI.superApply(this,"mergeOption",arguments),LI(this.option,t);}});function LI(t,n){var a=t.cellSize;E(a)?1===a.length&&(a[1]=a[0]):a=t.cellSize=[a,a];var e=P([0,1],function(t){var e,i;return(null!=(e=n)[yl[i=t][0]]||null!=e[yl[i][1]]&&null!=e[yl[i][2]])&&(a[t]="auto"),null!=a[t]&&"auto"!==a[t];});Sl(t,n,{type:"box",ignoreSize:e});}var kI={EN:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],CN:["涓�鏈�","浜屾湀","涓夋湀","鍥涙湀","浜旀湀","鍏湀","涓冩湀","鍏湀","涔濇湀","鍗佹湀","鍗佷竴鏈�","鍗佷簩鏈�"]},PI={EN:["S","M","T","W","T","F","S"],CN:["鏃�","涓�","浜�","涓�","鍥�","浜�","鍏�"]};Kc({type:"calendar",_tlpoints:null,_blpoints:null,_firstDayOfMonth:null,_firstDayPoints:null,render:function render(t,e,i){var n=this.group;n.removeAll();var a=t.coordinateSystem,o=a.getRangeInfo(),r=a.getOrient();this._renderDayRect(t,o,n),this._renderLines(t,o,r,n),this._renderYearText(t,o,r,n),this._renderMonthText(t,r,n),this._renderWeekText(t,o,r,n);},_renderDayRect:function _renderDayRect(t,e,i){for(var n=t.coordinateSystem,a=t.getModel("itemStyle").getItemStyle(),o=n.getCellWidth(),r=n.getCellHeight(),s=e.start.time;s<=e.end.time;s=n.getNextNDay(s,1).time){var l=n.dataToRect([s],!1).tl,h=new wr({shape:{x:l[0],y:l[1],width:o,height:r},cursor:"default",style:a});i.add(h);}},_renderLines:function _renderLines(i,t,n,a){var o=this,r=i.coordinateSystem,s=i.getModel("splitLine.lineStyle").getLineStyle(),l=i.get("splitLine.show"),e=s.lineWidth;this._tlpoints=[],this._blpoints=[],this._firstDayOfMonth=[],this._firstDayPoints=[];for(var h=t.start,u=0;h.time<=t.end.time;u++){d(h.formatedDate),0===u&&(h=r.getDateInfo(t.start.y+"-"+t.start.m));var c=h.date;c.setMonth(c.getMonth()+1),h=r.getDateInfo(c);}function d(t){o._firstDayOfMonth.push(r.getDateInfo(t)),o._firstDayPoints.push(r.dataToRect([t],!1).tl);var e=o._getLinePointsOfOneWeek(i,t,n);o._tlpoints.push(e[0]),o._blpoints.push(e[e.length-1]),l&&o._drawSplitline(e,s,a);}d(r.getNextNDay(t.end.time,1).formatedDate),l&&this._drawSplitline(o._getEdgesPoints(o._tlpoints,e,n),s,a),l&&this._drawSplitline(o._getEdgesPoints(o._blpoints,e,n),s,a);},_getEdgesPoints:function _getEdgesPoints(t,e,i){var n=[t[0].slice(),t[t.length-1].slice()],a="horizontal"===i?0:1;return n[0][a]=n[0][a]-e/2,n[1][a]=n[1][a]+e/2,n;},_drawSplitline:function _drawSplitline(t,e,i){var n=new _r({z2:20,shape:{points:t},style:e});i.add(n);},_getLinePointsOfOneWeek:function _getLinePointsOfOneWeek(t,e,i){var n=t.coordinateSystem;e=n.getDateInfo(e);for(var a=[],o=0;o<7;o++){var r=n.getNextNDay(e.time,o),s=n.dataToRect([r.time],!1);a[2*r.day]=s.tl,a[2*r.day+1]=s["horizontal"===i?"bl":"tr"];}return a;},_formatterLabel:function _formatterLabel(t,e){return"string"==typeof t&&t?ll(t,e):"function"==typeof t?t(e):e.nameMap;},_yearTextPositionControl:function _yearTextPositionControl(t,e,i,n,a){e=e.slice();var o=["center","bottom"];"bottom"===n?(e[1]+=a,o=["center","top"]):"left"===n?e[0]-=a:"right"===n?(e[0]+=a,o=["center","top"]):e[1]-=a;var r=0;return"left"!==n&&"right"!==n||(r=Math.PI/2),{rotation:r,position:e,style:{textAlign:o[0],textVerticalAlign:o[1]}};},_renderYearText:function _renderYearText(t,e,i,n){var a=t.getModel("yearLabel");if(a.get("show")){var o=a.get("margin"),r=a.get("position");r||(r="horizontal"!==i?"top":"left");var s=[this._tlpoints[this._tlpoints.length-1],this._blpoints[0]],l=(s[0][0]+s[1][0])/2,h=(s[0][1]+s[1][1])/2,u="horizontal"===i?0:1,c={top:[l,s[u][1]],bottom:[l,s[1-u][1]],left:[s[1-u][0],h],right:[s[u][0],h]},d=e.start.y;+e.end.y>+e.start.y&&(d=d+"-"+e.end.y);var f=a.get("formatter"),p={start:e.start.y,end:e.end.y,nameMap:d},g=this._formatterLabel(f,p),m=new hr({z2:30});rs(m.style,a,{text:g}),m.attr(this._yearTextPositionControl(m,c[r],i,r,o)),n.add(m);}},_monthTextPositionControl:function _monthTextPositionControl(t,e,i,n,a){var o="left",r="top",s=t[0],l=t[1];return"horizontal"===i?(l+=a,e&&(o="center"),"start"===n&&(r="bottom")):(s+=a,e&&(r="middle"),"start"===n&&(o="right")),{x:s,y:l,textAlign:o,textVerticalAlign:r};},_renderMonthText:function _renderMonthText(t,e,i){var n=t.getModel("monthLabel");if(n.get("show")){var a=n.get("nameMap"),o=n.get("margin"),r=n.get("position"),s=n.get("align"),l=[this._tlpoints,this._blpoints];D(a)&&(a=kI[a.toUpperCase()]||[]);var h="start"===r?0:1,u="horizontal"===e?0:1;o="start"===r?-o:o;for(var c="center"===s,d=0;d<l[h].length-1;d++){var f=l[h][d].slice(),p=this._firstDayOfMonth[d];if(c){var g=this._firstDayPoints[d];f[u]=(g[u]+l[0][d+1][u])/2;}var m=n.get("formatter"),v=a[+p.m-1],y={yyyy:p.y,yy:(p.y+"").slice(2),MM:p.m,M:+p.m,nameMap:v},x=this._formatterLabel(m,y),_=new hr({z2:30});k(rs(_.style,n,{text:x}),this._monthTextPositionControl(f,c,e,r,o)),i.add(_);}}},_weekTextPositionControl:function _weekTextPositionControl(t,e,i,n,a){var o="center",r="middle",s=t[0],l=t[1],h="start"===i;return"horizontal"===e?(s=s+n+(h?1:-1)*a[0]/2,o=h?"right":"left"):(l=l+n+(h?1:-1)*a[1]/2,r=h?"bottom":"top"),{x:s,y:l,textAlign:o,textVerticalAlign:r};},_renderWeekText:function _renderWeekText(t,e,i,n){var a=t.getModel("dayLabel");if(a.get("show")){var o=t.coordinateSystem,r=a.get("position"),s=a.get("nameMap"),l=a.get("margin"),h=o.getFirstDayOfWeek();D(s)&&(s=PI[s.toUpperCase()]||[]);var u=o.getNextNDay(e.end.time,7-e.lweek).time,c=[o.getCellWidth(),o.getCellHeight()];l=Es(l,c["horizontal"===i?0:1]),"start"===r&&(u=o.getNextNDay(e.start.time,-(7+e.fweek)).time,l=-l);for(var d=0;d<7;d++){var f,p=o.getNextNDay(u,d),g=o.dataToRect([p.time],!1).center;f=Math.abs((d+h)%7);var m=new hr({z2:30});k(rs(m.style,a,{text:s[f]}),this._weekTextPositionControl(g,i,r,l,c)),n.add(m);}}}}),qc({type:"title",layoutMode:{type:"box",ignoreSize:!0},defaultOption:{zlevel:0,z:6,show:!0,text:"",target:"blank",subtext:"",subtarget:"blank",left:0,top:0,backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,textStyle:{fontSize:18,fontWeight:"bolder",color:"#333"},subtextStyle:{color:"#aaa"}}}),Kc({type:"title",render:function render(t,e,i){if(this.group.removeAll(),t.get("show")){var n=this.group,a=t.getModel("textStyle"),o=t.getModel("subtextStyle"),r=t.get("textAlign"),s=t.get("textBaseline"),l=new hr({style:rs({},a,{text:t.get("text"),textFill:a.getTextColor()},{disableBox:!0}),z2:10}),h=l.getBoundingRect(),u=t.get("subtext"),c=new hr({style:rs({},o,{text:u,textFill:o.getTextColor(),y:h.height+t.get("itemGap"),textVerticalAlign:"top"},{disableBox:!0}),z2:10}),d=t.get("link"),f=t.get("sublink");l.silent=!d,c.silent=!f,d&&l.on("click",function(){window.open(d,"_"+t.get("target"));}),f&&c.on("click",function(){window.open(f,"_"+t.get("subtarget"));}),n.add(l),u&&n.add(c);var p=n.getBoundingRect(),g=t.getBoxLayoutParams();g.width=p.width,g.height=p.height;var m=wl(g,{width:i.getWidth(),height:i.getHeight()},t.get("padding"));r||("middle"===(r=t.get("left")||t.get("right"))&&(r="center"),"right"===r?m.x+=m.width:"center"===r&&(m.x+=m.width/2)),s||("center"===(s=t.get("top")||t.get("bottom"))&&(s="middle"),"bottom"===s?m.y+=m.height:"middle"===s&&(m.y+=m.height/2),s=s||"top"),n.attr("position",[m.x,m.y]);var v={textAlign:r,textVerticalAlign:s};l.setStyle(v),c.setStyle(v),p=n.getBoundingRect();var y=m.margin,x=t.getItemStyle(["color","opacity"]);x.fill=t.get("backgroundColor");var _=new wr({shape:{x:p.x-y[3],y:p.y-y[0],width:p.width+y[1]+y[3],height:p.height+y[0]+y[2],r:t.get("borderRadius")},style:x,silent:!0});Zr(_),n.add(_);}}}),Cl.registerSubTypeDefaulter("dataZoom",function(){return"slider";});var NI=["cartesian2d","polar","singleAxis"];var OI,EI,RI,zI,BI=(EI=["axisIndex","axis","index","id"],RI=P(OI=(OI=["x","y","z","radius","angle","single"]).slice(),dl),zI=P(EI=(EI||[]).slice(),dl),function(a,o){z(OI,function(t,e){for(var i={name:t,capital:RI[e]},n=0;n<EI.length;n++){i[EI[n]]=t+zI[n];}a.call(o,i);});});function VI(i,s,l){return function(t){var o,r={nodes:[],records:{}};if(s(function(t){r.records[t.name]={};}),!t)return r;for(h(t,r);o=!1,i(e),o;){}function e(t){var i,n,a,e;e=t,0<=L(r.nodes,e)||(i=t,n=r,a=!1,s(function(e){z(l(i,e)||[],function(t){n.records[e.name][t]&&(a=!0);});}),!a)||(h(t,r),o=!0);}return r;};function h(t,i){i.nodes.push(t),s(function(e){z(l(t,e)||[],function(t){i.records[e.name][t]=!0;});});}}var GI=z,WI=zs,FI=function FI(t,e,i,n){this._dimName=t,this._axisIndex=e,this._valueWindow,this._percentWindow,this._dataExtent,this._minMaxSpan,this.ecModel=n,this._dataZoomModel=i;};function HI(t,e){var i=t.getAxisModel(),n=t._percentWindow,a=t._valueWindow;if(n){var o=Gs(a,[0,500]);o=Math.min(o,20);var r=e||0===n[0]&&100===n[1];i.setRange(r?null:+a[0].toFixed(o),r?null:+a[1].toFixed(o));}}FI.prototype={constructor:FI,hostedBy:function hostedBy(t){return this._dataZoomModel===t;},getDataValueWindow:function getDataValueWindow(){return this._valueWindow.slice();},getDataPercentWindow:function getDataPercentWindow(){return this._percentWindow.slice();},getTargetSeriesModels:function getTargetSeriesModels(){var a=[],o=this.ecModel;return o.eachSeries(function(t){if(n=t.get("coordinateSystem"),0<=L(NI,n)){var e=this._dimName,i=o.queryComponents({mainType:e+"Axis",index:t.get(e+"AxisIndex"),id:t.get(e+"AxisId")})[0];this._axisIndex===(i&&i.componentIndex)&&a.push(t);}var n;},this),a;},getAxisModel:function getAxisModel(){return this.ecModel.getComponent(this._dimName+"Axis",this._axisIndex);},getOtherAxisModel:function getOtherAxisModel(){var t,e,i,n=this._dimName,a=this.ecModel,o=this.getAxisModel();return"x"===n||"y"===n?(e="gridIndex",t="x"===n?"y":"x"):(e="polarIndex",t="angle"===n?"radius":"angle"),a.eachComponent(t+"Axis",function(t){(t.get(e)||0)===(o.get(e)||0)&&(i=t);}),i;},getMinMaxSpan:function getMinMaxSpan(){return A(this._minMaxSpan);},calculateDataWindow:function calculateDataWindow(e){var n=this._dataExtent,a=this.getAxisModel().axis.scale,o=this._dataZoomModel.getRangePropMode(),r=[0,100],s=[e.start,e.end],l=[];return GI(["startValue","endValue"],function(t){l.push(null!=e[t]?a.parse(e[t]):null);}),GI([0,1],function(t){var e=l[t],i=s[t];"percent"===o[t]?(null==i&&(i=r[t]),e=a.parse(Os(i,r,n,!0))):i=Os(e,n,r,!0),l[t]=e,s[t]=i;}),{valueWindow:WI(l),percentWindow:WI(s)};},reset:function reset(t){if(t===this._dataZoomModel){var e=this.getTargetSeriesModels();this._dataExtent=function(t,e,i){var n=[1/0,-1/0];GI(i,function(t){var i=t.getData();i&&GI(i.mapDimension(e,!0),function(t){var e=i.getApproximateExtent(t);e[0]<n[0]&&(n[0]=e[0]),e[1]>n[1]&&(n[1]=e[1]);});}),n[1]<n[0]&&(n=[NaN,NaN]);return function(t,e){var i=t.getAxisModel(),n=i.getMin(!0),a="category"===i.get("type"),o=a&&i.getCategories().length;null!=n&&"dataMin"!==n&&"function"!=typeof n?e[0]=n:a&&(e[0]=0<o?0:NaN);var r=i.getMax(!0);null!=r&&"dataMax"!==r&&"function"!=typeof r?e[1]=r:a&&(e[1]=0<o?o-1:NaN),i.get("scale",!0)||(0<e[0]&&(e[0]=0),e[1]<0&&(e[1]=0));}(t,n),n;}(this,this._dimName,e);var n,a,o,i=this.calculateDataWindow(t.option);this._valueWindow=i.valueWindow,this._percentWindow=i.percentWindow,a=(n=this)._minMaxSpan={},o=n._dataZoomModel,GI(["min","max"],function(t){a[t+"Span"]=o.get(t+"Span");var e=o.get(t+"ValueSpan");if(null!=e&&(a[t+"ValueSpan"]=e,null!=(e=n.getAxisModel().axis.scale.parse(e)))){var i=n._dataExtent;a[t+"Span"]=Os(i[0]+e,i,[0,100],!0);}}),HI(this);}},restore:function restore(t){t===this._dataZoomModel&&(this._valueWindow=this._percentWindow=null,HI(this,!0));},filterData:function filterData(t,e){if(t===this._dataZoomModel){var n=this._dimName,i=this.getTargetSeriesModels(),a=t.get("filterMode"),c=this._valueWindow;"none"!==a&&GI(i,function(i){var h=i.getData(),u=h.mapDimension(n,!0);"weakFilter"===a?h.filterSelf(function(t){for(var e,i,n,a=0;a<u.length;a++){var o=h.get(u[a],t),r=!isNaN(o),s=o<c[0],l=o>c[1];if(r&&!s&&!l)return!0;r&&(n=!0),s&&(e=!0),l&&(i=!0);}return n&&e&&i;}):GI(u,function(t){if("empty"===a)i.setData(h.map(t,function(t){return(e=t)>=c[0]&&e<=c[1]?t:NaN;var e;}));else{var e={};e[t]=c,h.selectRange(e);}}),GI(u,function(t){h.setApproximateExtent(c,t);});});}}};var ZI=z,UI=BI,jI=qc({type:"dataZoom",dependencies:["xAxis","yAxis","zAxis","radiusAxis","angleAxis","singleAxis","series"],defaultOption:{zlevel:0,z:4,orient:null,xAxisIndex:null,yAxisIndex:null,filterMode:"filter",throttle:null,start:0,end:100,startValue:null,endValue:null,minSpan:null,maxSpan:null,minValueSpan:null,maxValueSpan:null,rangeMode:null},init:function init(t,e,i){this._dataIntervalByAxis={},this._dataInfo={},this._axisProxies={},this.textStyleModel,this._autoThrottle=!0,this._rangePropMode=["percent","percent"];var n=XI(t);this.mergeDefaultAndTheme(t,i),this.doInit(n);},mergeOption:function mergeOption(t){var e=XI(t);g(this.option,t,!0),this.doInit(e);},doInit:function doInit(t){var i=this.option;v.canvasSupported||(i.realtime=!1),this._setDefaultThrottle(t),YI(this,t),ZI([["start","startValue"],["end","endValue"]],function(t,e){"value"===this._rangePropMode[e]&&(i[t[0]]=null);},this),this.textStyleModel=this.getModel("textStyle"),this._resetTarget(),this._giveAxisProxies();},_giveAxisProxies:function _giveAxisProxies(){var r=this._axisProxies;this.eachTargetAxis(function(t,e,i,n){var a=this.dependentModels[t.axis][e],o=a.__dzAxisProxy||(a.__dzAxisProxy=new FI(t.name,e,this,n));r[t.name+"_"+e]=o;},this);},_resetTarget:function _resetTarget(){var i=this.option,t=this._judgeAutoMode();UI(function(t){var e=t.axisIndex;i[e]=ra(i[e]);},this),"axisIndex"===t?this._autoSetAxisIndex():"orient"===t&&this._autoSetOrient();},_judgeAutoMode:function _judgeAutoMode(){var e=this.option,i=!1;UI(function(t){null!=e[t.axisIndex]&&(i=!0);},this);var t=e.orient;return null==t&&i?"orient":i?void 0:(null==t&&(e.orient="horizontal"),"axisIndex");},_autoSetAxisIndex:function _autoSetAxisIndex(){var o=!0,e=this.get("orient",!0),r=this.option,t=this.dependentModels;if(o){var i="vertical"===e?"y":"x";t[i+"Axis"].length?(r[i+"AxisIndex"]=[0],o=!1):ZI(t.singleAxis,function(t){o&&t.get("orient",!0)===e&&(r.singleAxisIndex=[t.componentIndex],o=!1);});}o&&UI(function(t){if(o){var e=[],i=this.dependentModels[t.axis];if(i.length&&!e.length)for(var n=0,a=i.length;n<a;n++){"category"===i[n].get("type")&&e.push(n);}(r[t.axisIndex]=e).length&&(o=!1);}},this),o&&this.ecModel.eachSeries(function(a){this._isSeriesHasAllAxesTypeOf(a,"value")&&UI(function(t){var e=r[t.axisIndex],i=a.get(t.axisIndex),n=a.get(t.axisId);L(e,i=a.ecModel.queryComponents({mainType:t.axis,index:i,id:n})[0].componentIndex)<0&&e.push(i);});},this);},_autoSetOrient:function _autoSetOrient(){var e;this.eachTargetAxis(function(t){!e&&(e=t.name);},this),this.option.orient="y"===e?"vertical":"horizontal";},_isSeriesHasAllAxesTypeOf:function _isSeriesHasAllAxesTypeOf(n,a){var o=!0;return UI(function(t){var e=n.get(t.axisIndex),i=this.dependentModels[t.axis][e];i&&i.get("type")===a||(o=!1);},this),o;},_setDefaultThrottle:function _setDefaultThrottle(t){if(t.hasOwnProperty("throttle")&&(this._autoThrottle=!1),this._autoThrottle){var e=this.ecModel.option;this.option.throttle=e.animation&&0<e.animationDurationUpdate?100:20;}},getFirstTargetAxisModel:function getFirstTargetAxisModel(){var i;return UI(function(t){if(null==i){var e=this.get(t.axisIndex);e.length&&(i=this.dependentModels[t.axis][e[0]]);}},this),i;},eachTargetAxis:function eachTargetAxis(i,n){var a=this.ecModel;UI(function(e){ZI(this.get(e.axisIndex),function(t){i.call(n,e,t,this,a);},this);},this);},getAxisProxy:function getAxisProxy(t,e){return this._axisProxies[t+"_"+e];},getAxisModel:function getAxisModel(t,e){var i=this.getAxisProxy(t,e);return i&&i.getAxisModel();},setRawRange:function setRawRange(e,t){var i=this.option;ZI([["start","startValue"],["end","endValue"]],function(t){null==e[t[0]]&&null==e[t[1]]||(i[t[0]]=e[t[0]],i[t[1]]=e[t[1]]);},this),!t&&YI(this,e);},getPercentRange:function getPercentRange(){var t=this.findRepresentativeAxisProxy();if(t)return t.getDataPercentWindow();},getValueRange:function getValueRange(t,e){if(null!=t||null!=e)return this.getAxisProxy(t,e).getDataValueWindow();var i=this.findRepresentativeAxisProxy();return i?i.getDataValueWindow():void 0;},findRepresentativeAxisProxy:function findRepresentativeAxisProxy(t){if(t)return t.__dzAxisProxy;var e=this._axisProxies;for(var i in e){if(e.hasOwnProperty(i)&&e[i].hostedBy(this))return e[i];}for(var i in e){if(e.hasOwnProperty(i)&&!e[i].hostedBy(this))return e[i];}},getRangePropMode:function getRangePropMode(){return this._rangePropMode.slice();}});function XI(e){var i={};return ZI(["start","end","startValue","endValue","throttle"],function(t){e.hasOwnProperty(t)&&(i[t]=e[t]);}),i;}function YI(t,a){var o=t._rangePropMode,r=t.get("rangeMode");ZI([["start","startValue"],["end","endValue"]],function(t,e){var i=null!=a[t[0]],n=null!=a[t[1]];i&&!n?o[e]="percent":!i&&n?o[e]="value":r?o[e]=r[e]:i&&(o[e]="percent");});}var qI=eu.extend({type:"dataZoom",render:function render(t,e,i,n){this.dataZoomModel=t,this.ecModel=e,this.api=i;},getTargetCoordInfo:function getTargetCoordInfo(){var t=this.dataZoomModel,a=this.ecModel,o={};return t.eachTargetAxis(function(t,e){var i=a.getComponent(t.axis,e);if(i){var n=i.getCoordSysModel();n&&function(t,e,i,n){for(var a,o=0;o<i.length;o++){if(i[o].model===t){a=i[o];break;}}a||i.push(a={model:t,axisModels:[],coordIndex:n});a.axisModels.push(e);}(n,i,o[n.mainType]||(o[n.mainType]=[]),n.componentIndex);}},this),o;}}),KI=(jI.extend({type:"dataZoom.slider",layoutMode:"box",defaultOption:{show:!0,right:"ph",top:"ph",width:"ph",height:"ph",left:null,bottom:null,backgroundColor:"rgba(47,69,84,0)",dataBackground:{lineStyle:{color:"#2f4554",width:.5,opacity:.3},areaStyle:{color:"rgba(47,69,84,0.3)",opacity:.3}},borderColor:"#ddd",fillerColor:"rgba(167,183,204,0.4)",handleIcon:"M8.2,13.6V3.9H6.3v9.7H3.1v14.9h3.3v9.7h1.8v-9.7h3.3V13.6H8.2z M9.7,24.4H4.8v-1.4h4.9V24.4z M9.7,19.1H4.8v-1.4h4.9V19.1z",handleSize:"100%",handleStyle:{color:"#a7b7cc"},labelPrecision:null,labelFormatter:null,showDetail:!0,showDataShadow:"auto",realtime:!0,zoomLock:!1,textStyle:{color:"#333"}}}),wr),$I=Os,JI=zs,QI=S,tT=z,eT="horizontal",iT="vertical",nT=5,aT=["line","bar","candlestick","scatter"],oT=qI.extend({type:"dataZoom.slider",init:function init(t,e){this._displayables={},this._orient,this._range,this._handleEnds,this._size,this._handleWidth,this._handleHeight,this._location,this._dragging,this._dataShadowInfo,this.api=e;},render:function render(t,e,i,n){oT.superApply(this,"render",arguments),vu(this,"_dispatchZoomAction",this.dataZoomModel.get("throttle"),"fixRate"),this._orient=t.get("orient"),!1!==this.dataZoomModel.get("show")?(n&&"dataZoom"===n.type&&n.from===this.uid||this._buildView(),this._updateView()):this.group.removeAll();},remove:function remove(){oT.superApply(this,"remove",arguments),yu(this,"_dispatchZoomAction");},dispose:function dispose(){oT.superApply(this,"dispose",arguments),yu(this,"_dispatchZoomAction");},_buildView:function _buildView(){var t=this.group;t.removeAll(),this._resetLocation(),this._resetInterval();var e=this._displayables.barGroup=new ii();this._renderBackground(),this._renderHandle(),this._renderDataShadow(),t.add(e),this._positionGroup();},_resetLocation:function _resetLocation(){var t=this.dataZoomModel,e=this.api,i=this._findCoordRect(),n={width:e.getWidth(),height:e.getHeight()},a=this._orient===eT?{right:n.width-i.x-i.width,top:n.height-30-7,width:i.width,height:30}:{right:7,top:i.y,width:30,height:i.height},o=Ml(t.option);z(["right","top","width","height"],function(t){"ph"===o[t]&&(o[t]=a[t]);});var r=wl(o,n,t.padding);this._location={x:r.x,y:r.y},this._size=[r.width,r.height],this._orient===iT&&this._size.reverse();},_positionGroup:function _positionGroup(){var t=this.group,e=this._location,i=this._orient,n=this.dataZoomModel.getFirstTargetAxisModel(),a=n&&n.get("inverse"),o=this._displayables.barGroup,r=(this._dataShadowInfo||{}).otherAxisInverse;o.attr(i!==eT||a?i===eT&&a?{scale:r?[-1,1]:[-1,-1]}:i!==iT||a?{scale:r?[-1,-1]:[-1,1],rotation:Math.PI/2}:{scale:r?[1,-1]:[1,1],rotation:Math.PI/2}:{scale:r?[1,1]:[1,-1]});var s=t.getBoundingRect([o]);t.attr("position",[e.x-s.x,e.y-s.y]);},_getViewExtent:function _getViewExtent(){return[0,this._size[0]];},_renderBackground:function _renderBackground(){var t=this.dataZoomModel,e=this._size,i=this._displayables.barGroup;i.add(new KI({silent:!0,shape:{x:0,y:0,width:e[0],height:e[1]},style:{fill:t.get("backgroundColor")},z2:-40})),i.add(new KI({shape:{x:0,y:0,width:e[0],height:e[1]},style:{fill:"transparent"},z2:0,onclick:S(this._onClickPanelClick,this)}));},_renderDataShadow:function _renderDataShadow(){var t=this._dataShadowInfo=this._prepareDataShadowInfo();if(t){var e=this._size,i=t.series,n=i.getRawData(),a=i.getShadowDim?i.getShadowDim():t.otherDim;if(null!=a){var o=n.getDataExtent(a),r=.3*(o[1]-o[0]);o=[o[0]-r,o[1]+r];var s,l=[0,e[1]],h=[0,e[0]],u=[[e[0],0],[0,0]],c=[],d=h[1]/(n.count()-1),f=0,p=Math.round(n.count()/e[0]);n.each([a],function(t,e){if(0<p&&e%p)f+=d;else{var i=null==t||isNaN(t)||""===t,n=i?0:$I(t,o,l,!0);i&&!s&&e?(u.push([u[u.length-1][0],0]),c.push([c[c.length-1][0],0])):!i&&s&&(u.push([f,0]),c.push([f,0])),u.push([f,n]),c.push([f,n]),f+=d,s=i;}});var g=this.dataZoomModel;this._displayables.barGroup.add(new xr({shape:{points:u},style:C({fill:g.get("dataBackgroundColor")},g.getModel("dataBackground.areaStyle").getAreaStyle()),silent:!0,z2:-20})),this._displayables.barGroup.add(new _r({shape:{points:c},style:g.getModel("dataBackground.lineStyle").getLineStyle(),silent:!0,z2:-19}));}}},_prepareDataShadowInfo:function _prepareDataShadowInfo(){var t=this.dataZoomModel,s=t.get("showDataShadow");if(!1!==s){var l,h=this.ecModel;return t.eachTargetAxis(function(o,r){z(t.getAxisProxy(o.name,r).getTargetSeriesModels(),function(t){if(!(l||!0!==s&&L(aT,t.get("type"))<0)){var e,i=h.getComponent(o.axis,r).axis,n={x:"y",y:"x",radius:"angle",angle:"radius"}[o.name],a=t.coordinateSystem;null!=n&&a.getOtherAxis&&(e=a.getOtherAxis(i).inverse),n=t.getData().mapDimension(n),l={thisAxis:i,series:t,thisDim:o.name,otherDim:n,otherAxisInverse:e};}},this);},this),l;}},_renderHandle:function _renderHandle(){var t=this._displayables,o=t.handles=[],r=t.handleLabels=[],s=this._displayables.barGroup,e=this._size,l=this.dataZoomModel;s.add(t.filler=new KI({draggable:!0,cursor:rT(this._orient),drift:QI(this._onDragMove,this,"all"),onmousemove:function onmousemove(t){Pn(t.event);},ondragstart:QI(this._showDataInfo,this,!0),ondragend:QI(this._onDragEnd,this),onmouseover:QI(this._showDataInfo,this,!0),onmouseout:QI(this._showDataInfo,this,!1),style:{fill:l.get("fillerColor"),textPosition:"inside"}})),s.add(new KI(Zr({silent:!0,shape:{x:0,y:0,width:e[0],height:e[1]},style:{stroke:l.get("dataBackgroundColor")||l.get("borderColor"),lineWidth:1,fill:"rgba(0,0,0,0)"}}))),tT([0,1],function(t){var e=_s(l.get("handleIcon"),{cursor:rT(this._orient),draggable:!0,drift:QI(this._onDragMove,this,t),onmousemove:function onmousemove(t){Pn(t.event);},ondragend:QI(this._onDragEnd,this),onmouseover:QI(this._showDataInfo,this,!0),onmouseout:QI(this._showDataInfo,this,!1)},{x:-1,y:0,width:2,height:2}),i=e.getBoundingRect();this._handleHeight=Es(l.get("handleSize"),this._size[1]),this._handleWidth=i.width/i.height*this._handleHeight,e.setStyle(l.getModel("handleStyle").getItemStyle());var n=l.get("handleColor");null!=n&&(e.style.fill=n),s.add(o[t]=e);var a=l.textStyleModel;this.group.add(r[t]=new hr({silent:!0,invisible:!0,style:{x:0,y:0,text:"",textVerticalAlign:"middle",textAlign:"center",textFill:a.getTextColor(),textFont:a.getFont()},z2:10}));},this);},_resetInterval:function _resetInterval(){var t=this._range=this.dataZoomModel.getPercentRange(),e=this._getViewExtent();this._handleEnds=[$I(t[0],[0,100],e,!0),$I(t[1],[0,100],e,!0)];},_updateInterval:function _updateInterval(t,e){var i=this.dataZoomModel,n=this._handleEnds,a=this._getViewExtent(),o=i.findRepresentativeAxisProxy().getMinMaxSpan(),r=[0,100];px(e,n,a,i.get("zoomLock")?"all":t,null!=o.minSpan?$I(o.minSpan,r,a,!0):null,null!=o.maxSpan?$I(o.maxSpan,r,a,!0):null),this._range=JI([$I(n[0],a,r,!0),$I(n[1],a,r,!0)]);},_updateView:function _updateView(t){var n=this._displayables,a=this._handleEnds,e=JI(a.slice()),o=this._size;tT([0,1],function(t){var e=n.handles[t],i=this._handleHeight;e.attr({scale:[i/2,i/2],position:[a[t],o[1]/2-i/2]});},this),n.filler.setShape({x:e[0],y:0,width:e[1]-e[0],height:o[1]}),this._updateDataInfo(t);},_updateDataInfo:function _updateDataInfo(t){var e=this.dataZoomModel,o=this._displayables,r=o.handleLabels,s=this._orient,l=["",""];if(e.get("showDetail")){var i=e.findRepresentativeAxisProxy();if(i){var n=i.getAxisModel().axis,a=this._range,h=t?i.calculateDataWindow({start:a[0],end:a[1]}).valueWindow:i.getDataValueWindow();l=[this._formatLabel(h[0],n),this._formatLabel(h[1],n)];}}var u=JI(this._handleEnds.slice());function c(t){var e=gs(o.handles[t].parent,this.group),i=vs(0===t?"right":"left",e),n=this._handleWidth/2+nT,a=ms([u[t]+(0===t?-n:n),this._size[1]/2],e);r[t].setStyle({x:a[0],y:a[1],textVerticalAlign:s===eT?"middle":i,textAlign:s===eT?i:"center",text:l[t]});}c.call(this,0),c.call(this,1);},_formatLabel:function _formatLabel(t,e){var i=this.dataZoomModel,n=i.get("labelFormatter"),a=i.get("labelPrecision");null!=a&&"auto"!==a||(a=e.getPixelPrecision());var o=null==t||isNaN(t)?"":"category"===e.type||"time"===e.type?e.scale.getLabel(Math.round(t)):t.toFixed(Math.min(a,20));return M(n)?n(t,o):D(n)?n.replace("{value}",o):o;},_showDataInfo:function _showDataInfo(t){t=this._dragging||t;var e=this._displayables.handleLabels;e[0].attr("invisible",!t),e[1].attr("invisible",!t);},_onDragMove:function _onDragMove(t,e,i){this._dragging=!0;var n=ms([e,i],this._displayables.barGroup.getLocalTransform(),!0);this._updateInterval(t,n[0]);var a=this.dataZoomModel.get("realtime");this._updateView(!a),a&&this._dispatchZoomAction();},_onDragEnd:function _onDragEnd(){this._dragging=!1,this._showDataInfo(!1),!this.dataZoomModel.get("realtime")&&this._dispatchZoomAction();},_onClickPanelClick:function _onClickPanelClick(t){var e=this._size,i=this._displayables.barGroup.transformCoordToLocal(t.offsetX,t.offsetY);if(!(i[0]<0||i[0]>e[0]||i[1]<0||i[1]>e[1])){var n=this._handleEnds,a=(n[0]+n[1])/2;this._updateInterval("all",i[0]-a),this._updateView(),this._dispatchZoomAction();}},_dispatchZoomAction:function _dispatchZoomAction(){var t=this._range;this.api.dispatchAction({type:"dataZoom",from:this.uid,dataZoomId:this.dataZoomModel.id,start:t[0],end:t[1]});},_findCoordRect:function _findCoordRect(){var i;if(tT(this.getTargetCoordInfo(),function(t){if(!i&&t.length){var e=t[0].model.coordinateSystem;i=e.getRect&&e.getRect();}}),!i){var t=this.api.getWidth(),e=this.api.getHeight();i={x:.2*t,y:.2*e,width:.6*t,height:.6*e};}return i;}});function rT(t){return"vertical"===t?"ns-resize":"ew-resize";}jI.extend({type:"dataZoom.inside",defaultOption:{disabled:!1,zoomLock:!1,zoomOnMouseWheel:!0,moveOnMouseMove:!0,preventDefaultMouseMove:!0}});var sT=N,lT="\0_ec_dataZoom_roams";function hT(t,n){var e=cT(t),a=n.dataZoomId,o=n.coordId;z(e,function(t,e){var i=t.dataZoomInfos;i[a]&&L(n.allCoordIds,o)<0&&(delete i[a],t.count--);}),dT(e);var i,r,s=e[o];s||((s=e[o]={coordId:o,dataZoomInfos:{},count:0}).controller=(i=s,(r=new Tm(t.getZr())).on("pan",sT(fT,i)),r.on("zoom",sT(pT,i)),r),s.dispatchAction=N(mT,t)),!s.dataZoomInfos[a]&&s.count++,s.dataZoomInfos[a]=n;var l,h,u,c,d=(l=s.dataZoomInfos,u={},c={type_true:2,type_move:1,type_false:0,type_undefined:-1},z(l,function(t){var e=!t.disabled&&(!t.zoomLock||"move");c["type_"+h]<c["type_"+e]&&(h=e),k(u,t.roamControllerOpt);}),{controlType:h,opt:u});s.controller.enable(d.controlType,d.opt),s.controller.setPointerChecker(n.containsPoint),vu(s,"dispatchAction",n.throttleRate,"fixRate");}function uT(t){return t.type+"\0_"+t.id;}function cT(t){var e=t.getZr();return e[lT]||(e[lT]={});}function dT(i){z(i,function(t,e){t.count||(t.controller.dispose(),delete i[e]);});}function fT(e,i,n,a,o,r,s){gT(e,function(t){return t.panGetRange(e.controller,i,n,a,o,r,s);});}function pT(e,i,n,a){gT(e,function(t){return t.zoomGetRange(e.controller,i,n,a);});}function gT(t,i){var n=[];z(t.dataZoomInfos,function(t){var e=i(t);!t.disabled&&e&&n.push({dataZoomId:t.dataZoomId,start:e[0],end:e[1]});}),t.dispatchAction(n);}function mT(t,e){t.dispatchAction({type:"dataZoom",batch:e});}var vT=S,yT=qI.extend({type:"dataZoom.inside",init:function init(t,e){this._range;},render:function render(o,t,r,e){yT.superApply(this,"render",arguments),function(t,e){if(t&&"dataZoom"===t.type&&t.batch)for(var i=0,n=t.batch.length;i<n;i++){if(t.batch[i].dataZoomId===e)return!1;}return!0;}(e,o.id)&&(this._range=o.getPercentRange()),z(this.getTargetCoordInfo(),function(t,i){var a=P(t,function(t){return uT(t.model);});z(t,function(t){var n=t.model,e=o.option;hT(r,{coordId:uT(n),allCoordIds:a,containsPoint:function containsPoint(t,e,i){return n.coordinateSystem.containPoint([e,i]);},dataZoomId:o.id,throttleRate:o.get("throttle",!0),panGetRange:vT(this._onPan,this,t,i),zoomGetRange:vT(this._onZoom,this,t,i),zoomLock:e.zoomLock,disabled:e.disabled,roamControllerOpt:{zoomOnMouseWheel:e.zoomOnMouseWheel,moveOnMouseMove:e.moveOnMouseMove,preventDefaultMouseMove:e.preventDefaultMouseMove}});},this);},this);},dispose:function dispose(){var t,i,e;t=this.api,i=this.dataZoomModel.id,z(e=cT(t),function(t){t.controller.dispose();var e=t.dataZoomInfos;e[i]&&(delete e[i],t.count--);}),dT(e),yT.superApply(this,"dispose",arguments),this._range=null;},_onPan:function _onPan(t,e,i,n,a,o,r,s,l){var h=this._range.slice(),u=t.axisModels[0];if(u){var c=xT[e]([o,r],[s,l],u,i,t),d=c.signal*(h[1]-h[0])*c.pixel/c.pixelLength;return px(d,h,[0,100],"all"),this._range=h;}},_onZoom:function _onZoom(t,e,i,n,a,o){var r=this._range.slice(),s=t.axisModels[0];if(s){var l=xT[e](null,[a,o],s,i,t),h=(0<l.signal?l.pixelStart+l.pixelLength-l.pixel:l.pixel-l.pixelStart)/l.pixelLength*(r[1]-r[0])+r[0];n=Math.max(1/n,0),r[0]=(r[0]-h)*n+h,r[1]=(r[1]-h)*n+h;var u=this.dataZoomModel.findRepresentativeAxisProxy().getMinMaxSpan();return px(0,r,[0,100],0,u.minSpan,u.maxSpan),this._range=r;}}}),xT={grid:function grid(t,e,i,n,a){var o=i.axis,r={},s=a.model.coordinateSystem.getRect();return t=t||[0,0],"x"===o.dim?(r.pixel=e[0]-t[0],r.pixelLength=s.width,r.pixelStart=s.x,r.signal=o.inverse?1:-1):(r.pixel=e[1]-t[1],r.pixelLength=s.height,r.pixelStart=s.y,r.signal=o.inverse?-1:1),r;},polar:function polar(t,e,i,n,a){var o=i.axis,r={},s=a.model.coordinateSystem,l=s.getRadiusAxis().getExtent(),h=s.getAngleAxis().getExtent();return t=t?s.pointToCoord(t):[0,0],e=s.pointToCoord(e),"radiusAxis"===i.mainType?(r.pixel=e[0]-t[0],r.pixelLength=l[1]-l[0],r.pixelStart=l[0],r.signal=o.inverse?1:-1):(r.pixel=e[1]-t[1],r.pixelLength=h[1]-h[0],r.pixelStart=h[0],r.signal=o.inverse?-1:1),r;},singleAxis:function singleAxis(t,e,i,n,a){var o=i.axis,r=a.model.coordinateSystem.getRect(),s={};return t=t||[0,0],"horizontal"===o.orient?(s.pixel=e[0]-t[0],s.pixelLength=r.width,s.pixelStart=r.x,s.signal=o.inverse?1:-1):(s.pixel=e[1]-t[1],s.pixelLength=r.height,s.pixelStart=r.y,s.signal=o.inverse?-1:1),s;}};Fc({getTargetSeries:function getTargetSeries(t){var n=J();return t.eachComponent("dataZoom",function(t){t.eachTargetAxis(function(t,e,i){z(i.getAxisProxy(t.name,e).getTargetSeriesModels(),function(t){n.set(t.uid,t);});});}),n;},modifyOutputEnd:!0,overallReset:function overallReset(t,n){t.eachComponent("dataZoom",function(t){t.eachTargetAxis(function(t,e,i){i.getAxisProxy(t.name,e).reset(i,n);}),t.eachTargetAxis(function(t,e,i){i.getAxisProxy(t.name,e).filterData(i,n);});}),t.eachComponent("dataZoom",function(t){var e=t.findRepresentativeAxisProxy(),i=e.getDataPercentWindow(),n=e.getDataValueWindow();t.setRawRange({start:i[0],end:i[1],startValue:n[0],endValue:n[1]},!0);});}}),Hc("dataZoom",function(i,t){var n=VI(S(t.eachComponent,t,"dataZoom"),BI,function(t,e){return t.get(e.axisIndex);}),a=[];t.eachComponent({mainType:"dataZoom",query:i},function(t,e){a.push.apply(a,n(t).nodes);}),z(a,function(t,e){t.setRawRange({start:i.start,end:i.end,startValue:i.startValue,endValue:i.endValue});});});var _T=z,wT=function wT(t){var e=t&&t.visualMap;E(e)||(e=e?[e]:[]),_T(e,function(t){if(t){bT(t,"splitList")&&!bT(t,"pieces")&&(t.pieces=t.splitList,delete t.splitList);var e=t.pieces;e&&E(e)&&_T(e,function(t){R(t)&&(bT(t,"start")&&!bT(t,"min")&&(t.min=t.start),bT(t,"end")&&!bT(t,"max")&&(t.max=t.end));});}});};function bT(t,e){return t&&t.hasOwnProperty&&t.hasOwnProperty(e);}Cl.registerSubTypeDefaulter("visualMap",function(t){return t.categories||(t.pieces?0<t.pieces.length:0<t.splitNumber)&&!t.calculable?"piecewise":"continuous";});var ST=tc.VISUAL.COMPONENT;function MT(t,e,i,n){for(var a=e.targetVisuals[n],o=Fv.prepareVisualTypes(a),r={color:t.getData().getVisual("color")},s=0,l=o.length;s<l;s++){var h=o[s],u=a["opacity"===h?"__alphaForOpacity":h];u&&u.applyVisual(i,c,d);}return r.color;function c(t){return r[t];}function d(t,e){r[t]=e;}}jc(ST,{createOnAllSeries:!0,reset:function reset(i,t){var n=[];return t.eachComponent("visualMap",function(t){var e,f,p,g,m;t.isTargetSeries(i)&&n.push((e=t.stateList,f=t.targetVisuals,p=S(t.getValueState,t),g=t.getDataDimension(i.getData()),m={},z(e,function(t){var e=Fv.prepareVisualTypes(f[t]);m[t]=e;}),{progress:function progress(t,i){function e(t){return i.getItemVisual(a,t);}function n(t,e){i.setItemVisual(a,t,e);}null!=g&&(g=i.getDimension(g));for(var a=t.start;a<t.end;a++){var o=i.getRawDataItem(a);if(o&&!1===o.visualMap)return;for(var r=null!=g?i.get(g,a,!0):a,s=p(r),l=f[s],h=m[s],u=0,c=h.length;u<c;u++){var d=h[u];l[d]&&l[d].applyVisual(r,e,n);}}}}));}),n;}}),jc(ST,{createOnAllSeries:!0,reset:function reset(a,t){var o=a.getData(),r=[];t.eachComponent("visualMap",function(t){if(t.isTargetSeries(a)){var e=t.getVisualMeta(S(MT,null,a,t))||{stops:[],outerColors:[]},i=t.getDataDimension(o),n=o.getDimensionInfo(i);null!=n&&(e.dimension=n.index,r.push(e));}}),a.getData().setVisual("visualMeta",r);}});var IT={get:function get(t,e,i){var n=A((TT[t]||{})[e]);return i&&E(n)?n[n.length-1]:n;}},TT={color:{active:["#006edd","#e0ffff"],inactive:["rgba(0,0,0,0)"]},colorHue:{active:[0,360],inactive:[0,0]},colorSaturation:{active:[.3,1],inactive:[0,0]},colorLightness:{active:[.9,.5],inactive:[0,0]},colorAlpha:{active:[.3,1],inactive:[0,0]},opacity:{active:[.3,1],inactive:[0,0]},symbol:{active:["circle","roundRect","diamond"],inactive:["none"]},symbolSize:{active:[10,50],inactive:[0,0]}},DT=Fv.mapVisual,AT=Fv.eachVisual,CT=E,LT=z,kT=zs,PT=Os,NT=qc({type:"visualMap",dependencies:["series"],stateList:["inRange","outOfRange"],replacableOptionKeys:["inRange","outOfRange","target","controller","color"],dataBound:[-1/0,1/0],layoutMode:{type:"box",ignoreSize:!0},defaultOption:{show:!0,zlevel:0,z:4,seriesIndex:"all",min:0,max:200,dimension:null,inRange:null,outOfRange:null,left:0,right:null,top:null,bottom:0,itemWidth:null,itemHeight:null,inverse:!1,orient:"vertical",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",contentColor:"#5793f3",inactiveColor:"#aaa",borderWidth:0,padding:5,textGap:10,precision:0,color:null,formatter:null,text:null,textStyle:{color:"#333"}},init:function init(t,e,i){this._dataExtent,this.targetVisuals={},this.controllerVisuals={},this.textStyleModel,this.itemSize,this.mergeDefaultAndTheme(t,i);},optionUpdated:function optionUpdated(t,e){var i=this.option;v.canvasSupported||(i.realtime=!1),!e&&VM(i,t,this.replacableOptionKeys),this.textStyleModel=this.getModel("textStyle"),this.resetItemSize(),this.completeVisualOption();},resetVisual:function resetVisual(t){var e=this.stateList;t=S(t,this),this.controllerVisuals=BM(this.option.controller,e,t),this.targetVisuals=BM(this.option.target,e,t);},getTargetSeriesIndices:function getTargetSeriesIndices(){var t=this.option.seriesIndex,i=[];return null==t||"all"===t?this.ecModel.eachSeries(function(t,e){i.push(e);}):i=ra(t),i;},eachTargetSeries:function eachTargetSeries(e,i){z(this.getTargetSeriesIndices(),function(t){e.call(i,this.ecModel.getSeriesByIndex(t));},this);},isTargetSeries:function isTargetSeries(e){var i=!1;return this.eachTargetSeries(function(t){t===e&&(i=!0);}),i;},formatValueText:function formatValueText(t,e,i){var n,a,o=this.option,r=o.precision,s=this.dataBound,l=o.formatter;return i=i||["<",">"],E(t)&&(t=t.slice(),n=!0),a=e?t:n?[h(t[0]),h(t[1])]:h(t),D(l)?l.replace("{value}",n?a[0]:a).replace("{value2}",n?a[1]:a):M(l)?n?l(t[0],t[1]):l(t):n?t[0]===s[0]?i[0]+" "+a[1]:t[1]===s[1]?i[1]+" "+a[0]:a[0]+" - "+a[1]:a;function h(t){return t===s[0]?"min":t===s[1]?"max":(+t).toFixed(Math.min(r,20));}},resetExtent:function resetExtent(){var t=this.option,e=kT([t.min,t.max]);this._dataExtent=e;},getDataDimension:function getDataDimension(t){var e=this.option.dimension,i=t.dimensions;if(null!=e||i.length){if(null!=e)return t.getDimension(e);for(var n=t.dimensions,a=n.length-1;0<=a;a--){var o=n[a];if(!t.getDimensionInfo(o).isCalculationCoord)return o;}}},getExtent:function getExtent(){return this._dataExtent.slice();},completeVisualOption:function completeVisualOption(){var t=this.ecModel,e=this.option,i={inRange:e.inRange,outOfRange:e.outOfRange},n=e.target||(e.target={}),a=e.controller||(e.controller={});g(n,i),g(a,i);var h=this.isCategory();function o(n){CT(e.color)&&!n.inRange&&(n.inRange={color:e.color.slice().reverse()}),n.inRange=n.inRange||{color:t.get("gradientColor")},LT(this.stateList,function(t){var e=n[t];if(D(e)){var i=IT.get(e,"active",h);i?(n[t]={},n[t][e]=i):delete n[t];}},this);}o.call(this,n),o.call(this,a),function(t,e,i){var n=t[e],a=t[i];n&&!a&&(a=t[i]={},LT(n,function(t,e){if(Fv.isValidType(e)){var i=IT.get(e,"inactive",h);null!=i&&(a[e]=i,"color"!==e||a.hasOwnProperty("opacity")||a.hasOwnProperty("colorAlpha")||(a.opacity=[0,0]));}}));}.call(this,n,"inRange","outOfRange"),function(o){var r=(o.inRange||{}).symbol||(o.outOfRange||{}).symbol,s=(o.inRange||{}).symbolSize||(o.outOfRange||{}).symbolSize,l=this.get("inactiveColor");LT(this.stateList,function(t){var e=this.itemSize,i=o[t];i||(i=o[t]={color:h?l:[l]}),null==i.symbol&&(i.symbol=r&&A(r)||(h?"roundRect":["roundRect"])),null==i.symbolSize&&(i.symbolSize=s&&A(s)||(h?e[0]:[e[0],e[0]])),i.symbol=DT(i.symbol,function(t){return"none"===t||"square"===t?"roundRect":t;});var n=i.symbolSize;if(null!=n){var a=-1/0;AT(n,function(t){a<t&&(a=t);}),i.symbolSize=DT(n,function(t){return PT(t,[0,a],[0,e[0]],!0);});}},this);}.call(this,a);},resetItemSize:function resetItemSize(){this.itemSize=[parseFloat(this.get("itemWidth")),parseFloat(this.get("itemHeight"))];},isCategory:function isCategory(){return!!this.option.categories;},setSelected:tt,getValueState:tt,getVisualMeta:tt}),OT=[20,140],ET=NT.extend({type:"visualMap.continuous",defaultOption:{align:"auto",calculable:!1,range:null,realtime:!0,itemHeight:null,itemWidth:null,hoverLink:!0,hoverLinkDataSize:null,hoverLinkOnHandle:null},optionUpdated:function optionUpdated(t,e){ET.superApply(this,"optionUpdated",arguments),this.resetExtent(),this.resetVisual(function(t){t.mappingMethod="linear",t.dataExtent=this.getExtent();}),this._resetRange();},resetItemSize:function resetItemSize(){ET.superApply(this,"resetItemSize",arguments);var t=this.itemSize;"horizontal"===this._orient&&t.reverse(),(null==t[0]||isNaN(t[0]))&&(t[0]=OT[0]),(null==t[1]||isNaN(t[1]))&&(t[1]=OT[1]);},_resetRange:function _resetRange(){var t=this.getExtent(),e=this.option.range;!e||e.auto?(t.auto=1,this.option.range=t):E(e)&&(e[0]>e[1]&&e.reverse(),e[0]=Math.max(e[0],t[0]),e[1]=Math.min(e[1],t[1]));},completeVisualOption:function completeVisualOption(){NT.prototype.completeVisualOption.apply(this,arguments),z(this.stateList,function(t){var e=this.option.controller[t].symbolSize;e&&e[0]!==e[1]&&(e[0]=0);},this);},setSelected:function setSelected(t){this.option.range=t.slice(),this._resetRange();},getSelected:function getSelected(){var t=this.getExtent(),e=zs((this.get("range")||[]).slice());return e[0]>t[1]&&(e[0]=t[1]),e[1]>t[1]&&(e[1]=t[1]),e[0]<t[0]&&(e[0]=t[0]),e[1]<t[0]&&(e[1]=t[0]),e;},getValueState:function getValueState(t){var e=this.option.range,i=this.getExtent();return(e[0]<=i[0]||e[0]<=t)&&(e[1]>=i[1]||t<=e[1])?"inRange":"outOfRange";},findTargetDataIndices:function findTargetDataIndices(n){var a=[];return this.eachTargetSeries(function(t){var i=[],e=t.getData();e.each(this.getDataDimension(e),function(t,e){n[0]<=t&&t<=n[1]&&i.push(e);},this),a.push({seriesId:t.id,dataIndex:i});},this),a;},getVisualMeta:function getVisualMeta(i){var t=RT(this,"outOfRange",this.getExtent()),e=RT(this,"inRange",this.option.range.slice()),n=[];function a(t,e){n.push({value:t,color:i(t,e)});}for(var o=0,r=0,s=e.length,l=t.length;r<l&&(!e.length||t[r]<=e[0]);r++){t[r]<e[o]&&a(t[r],"outOfRange");}for(var h=1;o<s;o++,h=0){h&&n.length&&a(e[o],"outOfRange"),a(e[o],"inRange");}for(h=1;r<l;r++){(!e.length||e[e.length-1]<t[r])&&(h&&(n.length&&a(n[n.length-1].value,"outOfRange"),h=0),a(t[r],"outOfRange"));}var u=n.length;return{stops:n,outerColors:[u?n[0].color:"transparent",u?n[u-1].color:"transparent"]};}});function RT(t,e,i){if(i[0]===i[1])return i.slice();for(var n=(i[1]-i[0])/200,a=i[0],o=[],r=0;r<=200&&a<i[1];r++){o.push(a),a+=n;}return o.push(i[1]),o;}var zT=Kc({type:"visualMap",autoPositionValues:{left:1,right:1,top:1,bottom:1},init:function init(t,e){this.ecModel=t,this.api=e,this.visualMapModel;},render:function render(t,e,i,n){!1!==(this.visualMapModel=t).get("show")?this.doRender.apply(this,arguments):this.group.removeAll();},renderBackground:function renderBackground(t){var e=this.visualMapModel,i=el(e.get("padding")||0),n=t.getBoundingRect();t.add(new wr({z2:-1,silent:!0,shape:{x:n.x-i[3],y:n.y-i[0],width:n.width+i[3]+i[1],height:n.height+i[0]+i[2]},style:{fill:e.get("backgroundColor"),stroke:e.get("borderColor"),lineWidth:e.get("borderWidth")}}));},getControllerVisual:function getControllerVisual(i,n,a){var t=(a=a||{}).forceState,e=this.visualMapModel,o={};if("symbol"===n&&(o.symbol=e.get("itemSymbol")),"color"===n){var r=e.get("contentColor");o.color=r;}function s(t){return o[t];}function l(t,e){o[t]=e;}var h=e.controllerVisuals[t||e.getValueState(i)];return z(Fv.prepareVisualTypes(h),function(t){var e=h[t];a.convertOpacityToAlpha&&"opacity"===t&&(t="colorAlpha",e=h.__alphaForOpacity),Fv.dependsOn(t,n)&&e&&e.applyVisual(i,s,l);}),o[n];},positionGroup:function positionGroup(t){var e=this.visualMapModel,i=this.api;bl(t,e.getBoxLayoutParams(),{width:i.getWidth(),height:i.getHeight()});},doRender:tt});function BT(t,e,i){var n=t.option,a=n.align;if(null!=a&&"auto"!==a)return a;for(var o={width:e.getWidth(),height:e.getHeight()},r="horizontal"===n.orient?1:0,s=[["left","right","width"],["top","bottom","height"]],l=s[r],h=[0,null,10],u={},c=0;c<3;c++){u[s[1-r][c]]=h[c],u[l[c]]=2===c?i[0]:n[l[c]];}var d=[["x","width",3],["y","height",0]][r],f=wl(u,o,n.padding);return l[(f.margin[d[2]]||0)+f[d[0]]+.5*f[d[1]]<.5*o[d[1]]?0:1];}function VT(e){return z(e||[],function(t){null!=e.dataIndex&&(e.dataIndexInside=e.dataIndex,e.dataIndex=null);}),e;}var GT=Os,WT=z,FT=Math.min,HT=Math.max,ZT=12,UT=6,jT=zT.extend({type:"visualMap.continuous",init:function init(){jT.superApply(this,"init",arguments),this._shapes={},this._dataInterval=[],this._handleEnds=[],this._orient,this._useHandle,this._hoverLinkDataIndices=[],this._dragging,this._hovering;},doRender:function doRender(t,e,i,n){n&&"selectDataRange"===n.type&&n.from===this.uid||this._buildView();},_buildView:function _buildView(){this.group.removeAll();var t=this.visualMapModel,e=this.group;this._orient=t.get("orient"),this._useHandle=t.get("calculable"),this._resetInterval(),this._renderBar(e);var i=t.get("text");this._renderEndsText(e,i,0),this._renderEndsText(e,i,1),this._updateView(!0),this.renderBackground(e),this._updateView(),this._enableHoverLinkToSeries(),this._enableHoverLinkFromSeries(),this.positionGroup(e);},_renderEndsText:function _renderEndsText(t,e,i){if(e){var n=e[1-i];n=null!=n?n+"":"";var a=this.visualMapModel,o=a.get("textGap"),r=a.itemSize,s=this._shapes.barGroup,l=this._applyTransform([r[0]/2,0===i?-o:r[1]+o],s),h=this._applyTransform(0===i?"bottom":"top",s),u=this._orient,c=this.visualMapModel.textStyleModel;this.group.add(new hr({style:{x:l[0],y:l[1],textVerticalAlign:"horizontal"===u?"middle":h,textAlign:"horizontal"===u?h:"center",text:n,textFont:c.getFont(),textFill:c.getTextColor()}}));}},_renderBar:function _renderBar(t){var e=this.visualMapModel,i=this._shapes,n=e.itemSize,a=this._orient,o=this._useHandle,r=BT(e,this.api,n),s=i.barGroup=this._createBarGroup(r);s.add(i.outOfRange=XT()),s.add(i.inRange=XT(null,o?qT(this._orient):null,S(this._dragHandle,this,"all",!1),S(this._dragHandle,this,"all",!0)));var l=e.textStyleModel.getTextRect("鍥�"),h=HT(l.width,l.height);o&&(i.handleThumbs=[],i.handleLabels=[],i.handleLabelPoints=[],this._createHandle(s,0,n,h,a,r),this._createHandle(s,1,n,h,a,r)),this._createIndicator(s,n,h,a),t.add(s);},_createHandle:function _createHandle(t,e,i,n,a){var o,r=S(this._dragHandle,this,e,!1),s=S(this._dragHandle,this,e,!0),l=XT((o=n,0===e?[[0,0],[o,0],[o,-o]]:[[0,0],[o,0],[o,o]]),qT(this._orient),r,s);l.position[0]=i[0],t.add(l);var h=this.visualMapModel.textStyleModel,u=new hr({draggable:!0,drift:r,onmousemove:function onmousemove(t){Pn(t.event);},ondragend:s,style:{x:0,y:0,text:"",textFont:h.getFont(),textFill:h.getTextColor()}});this.group.add(u);var c=["horizontal"===a?n/2:1.5*n,"horizontal"===a?0===e?-1.5*n:1.5*n:0===e?-n/2:n/2],d=this._shapes;d.handleThumbs[e]=l,d.handleLabelPoints[e]=c,d.handleLabels[e]=u;},_createIndicator:function _createIndicator(t,e,i,n){var a=XT([[0,0]],"move");a.position[0]=e[0],a.attr({invisible:!0,silent:!0}),t.add(a);var o=this.visualMapModel.textStyleModel,r=new hr({silent:!0,invisible:!0,style:{x:0,y:0,text:"",textFont:o.getFont(),textFill:o.getTextColor()}});this.group.add(r);var s=["horizontal"===n?i/2:UT+3,0],l=this._shapes;l.indicator=a,l.indicatorLabel=r,l.indicatorLabelPoint=s;},_dragHandle:function _dragHandle(t,e,i,n){if(this._useHandle){if(this._dragging=!e,!e){var a=this._applyTransform([i,n],this._shapes.barGroup,!0);this._updateInterval(t,a[1]),this._updateView();}e===!this.visualMapModel.get("realtime")&&this.api.dispatchAction({type:"selectDataRange",from:this.uid,visualMapId:this.visualMapModel.id,selected:this._dataInterval.slice()}),e?!this._hovering&&this._clearHoverLinkToSeries():YT(this.visualMapModel)&&this._doHoverLinkToSeries(this._handleEnds[t],!1);}},_resetInterval:function _resetInterval(){var t=this.visualMapModel,e=this._dataInterval=t.getSelected(),i=t.getExtent(),n=[0,t.itemSize[1]];this._handleEnds=[GT(e[0],i,n,!0),GT(e[1],i,n,!0)];},_updateInterval:function _updateInterval(t,e){e=e||0;var i=this.visualMapModel,n=this._handleEnds,a=[0,i.itemSize[1]];px(e,n,a,t,0);var o=i.getExtent();this._dataInterval=[GT(n[0],a,o,!0),GT(n[1],a,o,!0)];},_updateView:function _updateView(t){var e=this.visualMapModel,i=e.getExtent(),n=this._shapes,a=[0,e.itemSize[1]],o=t?a:this._handleEnds,r=this._createBarVisual(this._dataInterval,i,o,"inRange"),s=this._createBarVisual(i,i,a,"outOfRange");n.inRange.setStyle({fill:r.barColor,opacity:r.opacity}).setShape("points",r.barPoints),n.outOfRange.setStyle({fill:s.barColor,opacity:s.opacity}).setShape("points",s.barPoints),this._updateHandle(o,r);},_createBarVisual:function _createBarVisual(t,e,i,n){var a={forceState:n,convertOpacityToAlpha:!0},o=this._makeColorGradient(t,a),r=[this.getControllerVisual(t[0],"symbolSize",a),this.getControllerVisual(t[1],"symbolSize",a)],s=this._createBarPoints(i,r);return{barColor:new Cr(0,0,0,1,o),barPoints:s,handlesColor:[o[0].color,o[o.length-1].color]};},_makeColorGradient:function _makeColorGradient(t,e){var i=[],n=(t[1]-t[0])/100;i.push({color:this.getControllerVisual(t[0],"color",e),offset:0});for(var a=1;a<100;a++){var o=t[0]+n*a;if(o>t[1])break;i.push({color:this.getControllerVisual(o,"color",e),offset:a/100});}return i.push({color:this.getControllerVisual(t[1],"color",e),offset:1}),i;},_createBarPoints:function _createBarPoints(t,e){var i=this.visualMapModel.itemSize;return[[i[0]-e[0],t[0]],[i[0],t[0]],[i[0],t[1]],[i[0]-e[1],t[1]]];},_createBarGroup:function _createBarGroup(t){var e=this._orient,i=this.visualMapModel.get("inverse");return new ii("horizontal"!==e||i?"horizontal"===e&&i?{scale:"bottom"===t?[-1,1]:[1,1],rotation:-Math.PI/2}:"vertical"!==e||i?{scale:"left"===t?[1,1]:[-1,1]}:{scale:"left"===t?[1,-1]:[-1,-1]}:{scale:"bottom"===t?[1,1]:[-1,1],rotation:Math.PI/2});},_updateHandle:function _updateHandle(n,a){if(this._useHandle){var o=this._shapes,r=this.visualMapModel,s=o.handleThumbs,l=o.handleLabels;WT([0,1],function(t){var e=s[t];e.setStyle("fill",a.handlesColor[t]),e.position[1]=n[t];var i=ms(o.handleLabelPoints[t],gs(e,this.group));l[t].setStyle({x:i[0],y:i[1],text:r.formatValueText(this._dataInterval[t]),textVerticalAlign:"middle",textAlign:this._applyTransform("horizontal"===this._orient?0===t?"bottom":"top":"left",o.barGroup)});},this);}},_showIndicator:function _showIndicator(t,e,i,n){var a=this.visualMapModel,o=a.getExtent(),r=a.itemSize,s=[0,r[1]],l=GT(t,o,s,!0),h=this._shapes,u=h.indicator;if(u){var c,d,f,p;u.position[1]=l,u.attr("invisible",!1),u.setShape("points",(c=!!i,d=n,f=l,p=r[1],c?[[0,-FT(d,HT(f,0))],[UT,0],[0,FT(d,HT(p-f,0))]]:[[0,0],[5,-5],[5,5]]));var g=this.getControllerVisual(t,"color",{convertOpacityToAlpha:!0});u.setStyle("fill",g);var m=ms(h.indicatorLabelPoint,gs(u,this.group)),v=h.indicatorLabel;v.attr("invisible",!1);var y=this._applyTransform("left",h.barGroup),x=this._orient;v.setStyle({text:(i||"")+a.formatValueText(e),textVerticalAlign:"horizontal"===x?y:"middle",textAlign:"horizontal"===x?"center":y,x:m[0],y:m[1]});}},_enableHoverLinkToSeries:function _enableHoverLinkToSeries(){var n=this;this._shapes.barGroup.on("mousemove",function(t){if(n._hovering=!0,!n._dragging){var e=n.visualMapModel.itemSize,i=n._applyTransform([t.offsetX,t.offsetY],n._shapes.barGroup,!0,!0);i[1]=FT(HT(0,i[1]),e[1]),n._doHoverLinkToSeries(i[1],0<=i[0]&&i[0]<=e[0]);}}).on("mouseout",function(){n._hovering=!1,!n._dragging&&n._clearHoverLinkToSeries();});},_enableHoverLinkFromSeries:function _enableHoverLinkFromSeries(){var t=this.api.getZr();this.visualMapModel.option.hoverLink?(t.on("mouseover",this._hoverLinkFromSeriesMouseOver,this),t.on("mouseout",this._hideIndicator,this)):this._clearHoverLinkFromSeries();},_doHoverLinkToSeries:function _doHoverLinkToSeries(t,e){var i=this.visualMapModel,n=i.itemSize;if(i.option.hoverLink){var a=[0,n[1]],o=i.getExtent();t=FT(HT(a[0],t),a[1]);var r=function(t,e,i){var n=ZT/2,a=t.get("hoverLinkDataSize");a&&(n=GT(a,e,i,!0)/2);return n;}(i,o,a),s=[t-r,t+r],l=GT(t,a,o,!0),h=[GT(s[0],a,o,!0),GT(s[1],a,o,!0)];s[0]<a[0]&&(h[0]=-1/0),a[1]<s[1]&&(h[1]=1/0),e&&(h[0]===-1/0?this._showIndicator(l,h[1],"< ",r):h[1]===1/0?this._showIndicator(l,h[0],"> ",r):this._showIndicator(l,l,"鈮� ",r));var u=this._hoverLinkDataIndices,c=[];(e||YT(i))&&(c=this._hoverLinkDataIndices=i.findTargetDataIndices(h));var d=function(t,e){var i={},n={};return a(t||[],i),a(e||[],n,i),[o(i),o(n)];function a(t,e,i){for(var n=0,a=t.length;n<a;n++){for(var o=t[n].seriesId,r=ra(t[n].dataIndex),s=i&&i[o],l=0,h=r.length;l<h;l++){var u=r[l];s&&s[u]?s[u]=null:(e[o]||(e[o]={}))[u]=1;}}}function o(t,e){var i=[];for(var n in t){if(t.hasOwnProperty(n)&&null!=t[n])if(e)i.push(+n);else{var a=o(t[n],!0);a.length&&i.push({seriesId:n,dataIndex:a});}}return i;}}(u,c);this._dispatchHighDown("downplay",VT(d[0])),this._dispatchHighDown("highlight",VT(d[1]));}},_hoverLinkFromSeriesMouseOver:function _hoverLinkFromSeriesMouseOver(t){var e=t.target,i=this.visualMapModel;if(e&&null!=e.dataIndex){var n=this.ecModel.getSeriesByIndex(e.seriesIndex);if(i.isTargetSeries(n)){var a=n.getData(e.dataType),o=a.get(i.getDataDimension(a),e.dataIndex,!0);isNaN(o)||this._showIndicator(o,o);}}},_hideIndicator:function _hideIndicator(){var t=this._shapes;t.indicator&&t.indicator.attr("invisible",!0),t.indicatorLabel&&t.indicatorLabel.attr("invisible",!0);},_clearHoverLinkToSeries:function _clearHoverLinkToSeries(){this._hideIndicator();var t=this._hoverLinkDataIndices;this._dispatchHighDown("downplay",VT(t)),t.length=0;},_clearHoverLinkFromSeries:function _clearHoverLinkFromSeries(){this._hideIndicator();var t=this.api.getZr();t.off("mouseover",this._hoverLinkFromSeriesMouseOver),t.off("mouseout",this._hideIndicator);},_applyTransform:function _applyTransform(t,e,i,n){var a=gs(e,n?null:this.group);return ws[E(t)?"applyTransform":"transformDirection"](t,a,i);},_dispatchHighDown:function _dispatchHighDown(t,e){e&&e.length&&this.api.dispatchAction({type:t,batch:e});},dispose:function dispose(){this._clearHoverLinkFromSeries(),this._clearHoverLinkToSeries();},remove:function remove(){this._clearHoverLinkFromSeries(),this._clearHoverLinkToSeries();}});function XT(t,e,i,n){return new xr({shape:{points:t},draggable:!!i,cursor:e,drift:i,onmousemove:function onmousemove(t){Pn(t.event);},ondragend:n});}function YT(t){var e=t.get("hoverLinkOnHandle");return!!(null==e?t.get("realtime"):e);}function qT(t){return"vertical"===t?"ns-resize":"ew-resize";}Hc({type:"selectDataRange",event:"dataRangeSelected",update:"update"},function(e,t){t.eachComponent({mainType:"visualMap",query:e},function(t){t.setSelected(e.selected);});}),Wc(wT);var KT=NT.extend({type:"visualMap.piecewise",defaultOption:{selected:null,minOpen:!1,maxOpen:!1,align:"auto",itemWidth:20,itemHeight:14,itemSymbol:"roundRect",pieceList:null,categories:null,splitNumber:5,selectedMode:"multiple",itemGap:10,hoverLink:!0,showLabel:null},optionUpdated:function optionUpdated(t,e){KT.superApply(this,"optionUpdated",arguments),this._pieceList=[],this.resetExtent();var i=this._mode=this._determineMode();$T[this._mode].call(this),this._resetSelected(t,e);var n=this.option.categories;this.resetVisual(function(t,e){"categories"===i?(t.mappingMethod="category",t.categories=A(n)):(t.dataExtent=this.getExtent(),t.mappingMethod="piecewise",t.pieceList=P(this._pieceList,function(t){t=A(t);return"inRange"!==e&&(t.visual=null),t;}));});},completeVisualOption:function completeVisualOption(){var n=this.option,i={},t=Fv.listVisualTypes(),a=this.isCategory();function o(t,e,i){return t&&t[e]&&(R(t[e])?t[e].hasOwnProperty(i):t[e]===i);}z(n.pieces,function(e){z(t,function(t){e.hasOwnProperty(t)&&(i[t]=1);});}),z(i,function(t,e){var i=0;z(this.stateList,function(t){i|=o(n,t,e)||o(n.target,t,e);},this),!i&&z(this.stateList,function(t){(n[t]||(n[t]={}))[e]=IT.get(e,"inRange"===t?"active":"inactive",a);});},this),NT.prototype.completeVisualOption.apply(this,arguments);},_resetSelected:function _resetSelected(t,e){var i=this.option,n=this._pieceList,a=(e?i:t).selected||{};if(i.selected=a,z(n,function(t,e){var i=this.getSelectedMapKey(t);a.hasOwnProperty(i)||(a[i]=!0);},this),"single"===i.selectedMode){var o=!1;z(n,function(t,e){var i=this.getSelectedMapKey(t);a[i]&&(o?a[i]=!1:o=!0);},this);}},getSelectedMapKey:function getSelectedMapKey(t){return"categories"===this._mode?t.value+"":t.index+"";},getPieceList:function getPieceList(){return this._pieceList;},_determineMode:function _determineMode(){var t=this.option;return t.pieces&&0<t.pieces.length?"pieces":this.option.categories?"categories":"splitNumber";},setSelected:function setSelected(t){this.option.selected=A(t);},getValueState:function getValueState(t){var e=Fv.findPieceIndex(t,this._pieceList);return null!=e&&this.option.selected[this.getSelectedMapKey(this._pieceList[e])]?"inRange":"outOfRange";},findTargetDataIndices:function findTargetDataIndices(n){var a=[];return this.eachTargetSeries(function(t){var i=[],e=t.getData();e.each(this.getDataDimension(e),function(t,e){Fv.findPieceIndex(t,this._pieceList)===n&&i.push(e);},this),a.push({seriesId:t.id,dataIndex:i});},this),a;},getRepresentValue:function getRepresentValue(t){var e;if(this.isCategory())e=t.value;else if(null!=t.value)e=t.value;else{var i=t.interval||[];e=i[0]===-1/0&&i[1]===1/0?0:(i[0]+i[1])/2;}return e;},getVisualMeta:function getVisualMeta(a){if(!this.isCategory()){var o=[],r=[],s=this,t=this._pieceList.slice();if(t.length){var e=t[0].interval[0];e!==-1/0&&t.unshift({interval:[-1/0,e]}),(e=t[t.length-1].interval[1])!==1/0&&t.push({interval:[e,1/0]});}else t.push({interval:[-1/0,1/0]});var i=-1/0;return z(t,function(t){var e=t.interval;e&&(e[0]>i&&n([i,e[0]],"outOfRange"),n(e.slice()),i=e[1]);},this),{stops:o,outerColors:r};}function n(t,e){var i=s.getRepresentValue({interval:t});e||(e=s.getValueState(i));var n=a(i,e);t[0]===-1/0?r[0]=n:t[1]===1/0?r[1]=n:o.push({value:t[0],color:n},{value:t[1],color:n});}}}),$T={splitNumber:function splitNumber(){var t=this.option,e=this._pieceList,i=Math.min(t.precision,20),n=this.getExtent(),a=t.splitNumber;a=Math.max(parseInt(a,10),1),t.splitNumber=a;for(var o=(n[1]-n[0])/a;+o.toFixed(i)!==o&&i<5;){i++;}t.precision=i,o=+o.toFixed(i);var r=0;t.minOpen&&e.push({index:r++,interval:[-1/0,n[0]],close:[0,0]});for(var s=n[0],l=r+a;r<l;s+=o){var h=r===a-1?n[1]:s+o;e.push({index:r++,interval:[s,h],close:[1,1]});}t.maxOpen&&e.push({index:r++,interval:[n[1],1/0],close:[0,0]}),Ks(e),z(e,function(t){t.text=this.formatValueText(t.interval);},this);},categories:function categories(){var t=this.option;z(t.categories,function(t){this._pieceList.push({text:this.formatValueText(t,!0),value:t});},this),JT(t,this._pieceList);},pieces:function pieces(){var t=this.option,d=this._pieceList;z(t.pieces,function(t,e){R(t)||(t={value:t});var i={text:"",index:e};if(null!=t.label&&(i.text=t.label),t.hasOwnProperty("value")){var n=i.value=t.value;i.interval=[n,n],i.close=[1,1];}else{for(var a=i.interval=[],o=i.close=[0,0],r=[1,0,1],s=[-1/0,1/0],l=[],h=0;h<2;h++){for(var u=[["gte","gt","min"],["lte","lt","max"]][h],c=0;c<3&&null==a[h];c++){a[h]=t[u[c]],o[h]=r[c],l[h]=2===c;}null==a[h]&&(a[h]=s[h]);}l[0]&&a[1]===1/0&&(o[0]=0),l[1]&&a[0]===-1/0&&(o[1]=0),a[0]===a[1]&&o[0]&&o[1]&&(i.value=a[0]);}i.visual=Fv.retrieveVisuals(t),d.push(i);},this),JT(t,d),Ks(d),z(d,function(t){var e=t.close,i=[["<","鈮�"][e[1]],[">","鈮�"][e[0]]];t.text=t.text||this.formatValueText(null!=t.value?t.value:t.interval,!1,i);},this);}};function JT(t,e){var i=t.inverse;("vertical"===t.orient?!i:i)&&e.reverse();}zT.extend({type:"visualMap.piecewise",doRender:function doRender(){var o=this.group;o.removeAll();var r=this.visualMapModel,s=r.get("textGap"),t=r.textStyleModel,l=t.getFont(),h=t.getTextColor(),u=this._getItemAlign(),c=r.itemSize,e=this._getViewData(),i=e.endsText,d=W(r.get("showLabel",!0),!i);i&&this._renderEndsText(o,i[0],c,d,u),z(e.viewPieceList,function(t){var e=t.piece,i=new ii();i.onclick=S(this._onItemClick,this,e),this._enableHoverLink(i,t.indexInModelPieceList);var n=r.getRepresentValue(e);if(this._createItemSymbol(i,n,[0,0,c[0],c[1]]),d){var a=this.visualMapModel.getValueState(n);i.add(new hr({style:{x:"right"===u?-s:c[0]+s,y:c[1]/2,text:e.text,textVerticalAlign:"middle",textAlign:u,textFont:l,textFill:h,opacity:"outOfRange"===a?.5:1}}));}o.add(i);},this),i&&this._renderEndsText(o,i[1],c,d,u),_l(r.get("orient"),o,r.get("itemGap")),this.renderBackground(o),this.positionGroup(o);},_enableHoverLink:function _enableHoverLink(t,i){function e(t){var e=this.visualMapModel;e.option.hoverLink&&this.api.dispatchAction({type:t,batch:VT(e.findTargetDataIndices(i))});}t.on("mouseover",S(e,this,"highlight")).on("mouseout",S(e,this,"downplay"));},_getItemAlign:function _getItemAlign(){var t=this.visualMapModel,e=t.option;if("vertical"===e.orient)return BT(t,this.api,t.itemSize);var i=e.align;return i&&"auto"!==i||(i="left"),i;},_renderEndsText:function _renderEndsText(t,e,i,n,a){if(e){var o=new ii(),r=this.visualMapModel.textStyleModel;o.add(new hr({style:{x:n?"right"===a?i[0]:0:i[0]/2,y:i[1]/2,textVerticalAlign:"middle",textAlign:n?a:"center",text:e,textFont:r.getFont(),textFill:r.getTextColor()}})),t.add(o);}},_getViewData:function _getViewData(){var t=this.visualMapModel,e=P(t.getPieceList(),function(t,e){return{piece:t,indexInModelPieceList:e};}),i=t.get("text"),n=t.get("orient"),a=t.get("inverse");return("horizontal"===n?a:!a)?e.reverse():i&&(i=i.slice().reverse()),{viewPieceList:e,endsText:i};},_createItemSymbol:function _createItemSymbol(t,e,i){t.add(Cf(this.getControllerVisual(e,"symbol"),i[0],i[1],i[2],i[3],this.getControllerVisual(e,"color")));},_onItemClick:function _onItemClick(t){var e=this.visualMapModel,i=e.option,n=A(i.selected),a=e.getSelectedMapKey(t);"single"===i.selectedMode?(n[a]=!0,z(n,function(t,e){n[e]=e===a;})):n[a]=!n[a],this.api.dispatchAction({type:"selectDataRange",from:this.uid,visualMapId:this.visualMapModel.id,selected:n});}});Wc(wT);var QT=Qs,tD=al;function eD(t){sa(t,"label",["show"]);}var iD=qc({type:"marker",dependencies:["series","grid","polar","geo"],init:function init(t,e,i,n){this.mergeDefaultAndTheme(t,i),this.mergeOption(t,i,n.createdBySelf,!0);},isAnimationEnabled:function isAnimationEnabled(){if(v.node)return!1;var t=this.__hostSeries;return this.getShallow("animation")&&t&&t.isAnimationEnabled();},mergeOption:function mergeOption(t,n,e,a){var o=this.constructor,r=this.mainType+"Model";e||n.eachSeries(function(t){var e=t.get(this.mainType,!0),i=t[r];e&&e.data?(i?i.mergeOption(e,n,!0):(a&&eD(e),z(e.data,function(t){t instanceof Array?(eD(t[0]),eD(t[1])):eD(t);}),k(i=new o(e,this,n),{mainType:this.mainType,seriesIndex:t.seriesIndex,name:t.name,createdBySelf:!0}),i.__hostSeries=t),t[r]=i):t[r]=null;},this);},formatTooltip:function formatTooltip(t){var e=this.getData(),i=this.getRawValue(t),n=E(i)?P(i,QT).join(", "):QT(i),a=e.getName(t),o=tD(this.name);return(null!=i||a)&&(o+="<br />"),a&&(o+=tD(a),null!=i&&(o+=" : ")),null!=i&&(o+=tD(n)),o;},getData:function getData(){return this._data;},setData:function setData(t){this._data=t;}});w(iD,Fh),iD.extend({type:"markPoint",defaultOption:{zlevel:0,z:5,symbol:"pin",symbolSize:50,tooltip:{trigger:"item"},label:{show:!0,position:"inside"},itemStyle:{borderWidth:2},emphasis:{label:{show:!0}}}});var nD=L;function aD(t,e,i,n,a,o){var r=[],s=Cd(e,n,i)?e.getCalculationInfo("stackResultDimension"):n,l=cD(e,s,t),h=e.indicesOfNearest(s,l)[0];r[a]=e.get(i,h),r[o]=e.get(n,h);var u=Bs(e.get(n,h));return 0<=(u=Math.min(u,20))&&(r[o]=+r[o].toFixed(u)),r;}var oD=N,rD={min:oD(aD,"min"),max:oD(aD,"max"),average:oD(aD,"average")};function sD(t,e){var i,n=t.getData(),a=t.coordinateSystem;if(e&&(i=e,isNaN(parseFloat(i.x))||isNaN(parseFloat(i.y)))&&!E(e.coord)&&a){var o=a.dimensions,r=lD(e,n,a,t);if((e=A(e)).type&&rD[e.type]&&r.baseAxis&&r.valueAxis){var s=nD(o,r.baseAxis.dim),l=nD(o,r.valueAxis.dim);e.coord=rD[e.type](n,r.baseDataDim,r.valueDataDim,s,l),e.value=e.coord[l];}else{for(var h=[null!=e.xAxis?e.xAxis:e.radiusAxis,null!=e.yAxis?e.yAxis:e.angleAxis],u=0;u<2;u++){rD[h[u]]&&(h[u]=cD(n,n.mapDimension(o[u]),h[u]));}e.coord=h;}}return e;}function lD(t,e,i,n){var a={};return null!=t.valueIndex||null!=t.valueDim?(a.valueDataDim=null!=t.valueIndex?e.getDimension(t.valueIndex):t.valueDim,a.valueAxis=i.getAxis(function(t,e){var i=t.getData(),n=i.dimensions;e=i.getDimension(e);for(var a=0;a<n.length;a++){var o=i.getDimensionInfo(n[a]);if(o.name===e)return o.coordDim;}}(n,a.valueDataDim)),a.baseAxis=i.getOtherAxis(a.valueAxis),a.baseDataDim=e.mapDimension(a.baseAxis.dim)):(a.baseAxis=n.getBaseAxis(),a.valueAxis=i.getOtherAxis(a.baseAxis),a.baseDataDim=e.mapDimension(a.baseAxis.dim),a.valueDataDim=e.mapDimension(a.valueAxis.dim)),a;}function hD(t,e){return!(t&&t.containData&&e.coord&&(i=e,isNaN(parseFloat(i.x))&&isNaN(parseFloat(i.y))))||t.containData(e.coord);var i;}function uD(t,e,i,n){return n<2?t.coord&&t.coord[n]:t.value;}function cD(t,e,i){if("average"===i){var n=0,a=0;return t.each(e,function(t,e){isNaN(t)||(n+=t,a++);}),n/a;}return"median"===i?t.getMedian(e):t.getDataExtent(e,!0)["max"===i?1:0];}var dD=Kc({type:"marker",init:function init(){this.markerGroupMap=J();},render:function render(t,i,n){var e=this.markerGroupMap;e.each(function(t){t.__keep=!1;});var a=this.type+"Model";i.eachSeries(function(t){var e=t[a];e&&this.renderSeries(t,e,i,n);},this),e.each(function(t){!t.__keep&&this.group.remove(t.group);},this);},renderSeries:function renderSeries(){}});function fD(s,l,h){var u=l.coordinateSystem;s.each(function(t){var e,i=s.getItemModel(t),n=Es(i.get("x"),h.getWidth()),a=Es(i.get("y"),h.getHeight());if(isNaN(n)||isNaN(a)){if(l.getMarkerPosition)e=l.getMarkerPosition(s.getValues(s.dimensions,t));else if(u){var o=s.get(u.dimensions[0],t),r=s.get(u.dimensions[1],t);e=u.dataToPoint([o,r]);}}else e=[n,a];isNaN(n)||(e[0]=n),isNaN(a)||(e[1]=a),s.setItemLayout(t,e);});}dD.extend({type:"markPoint",updateTransform:function updateTransform(t,e,i){e.eachSeries(function(t){var e=t.markPointModel;e&&(fD(e.getData(),t,i),this.markerGroupMap.get(t.id).updateLayout(e));},this);},renderSeries:function renderSeries(t,n,e,i){var a=t.coordinateSystem,o=t.id,r=t.getData(),s=this.markerGroupMap,l=s.get(o)||s.set(o,new Qf()),h=function(t,i,e){var n;n=t?P(t&&t.dimensions,function(t){var e=i.getData().getDimensionInfo(i.getData().mapDimension(t))||{};return C({name:t},e);}):[{name:"value",type:"float"}];var a=new pd(n,e),o=P(e.get("data"),N(sD,i));t&&(o=T(o,N(hD,t)));return a.initData(o,null,t?uD:function(t){return t.value;}),a;}(a,t,n);n.setData(h),fD(n.getData(),t,i),h.each(function(t){var e=h.getItemModel(t),i=e.getShallow("symbolSize");"function"==typeof i&&(i=i(n.getRawValue(t),n.getDataParams(t))),h.setItemVisual(t,{symbolSize:i,color:e.get("itemStyle.color")||r.getVisual("color"),symbol:e.getShallow("symbol")});}),l.updateData(h),this.group.add(l.group),h.eachItemGraphicEl(function(t){t.traverse(function(t){t.dataModel=n;});}),l.__keep=!0,l.group.silent=n.get("silent")||t.get("silent");}}),Wc(function(t){t.markPoint=t.markPoint||{};}),iD.extend({type:"markLine",defaultOption:{zlevel:0,z:5,symbol:["circle","arrow"],symbolSize:[8,16],precision:2,tooltip:{trigger:"item"},label:{show:!0,position:"end"},lineStyle:{type:"dashed"},emphasis:{label:{show:!0},lineStyle:{width:3}},animationEasing:"linear"}});var pD=function pD(t,e,i,n){var a=t.getData(),o=n.type;if(!E(n)&&("min"===o||"max"===o||"average"===o||"median"===o||null!=n.xAxis||null!=n.yAxis)){var r,s;if(null!=n.yAxis||null!=n.xAxis)r=null!=n.yAxis?"y":"x",e.getAxis(r),s=W(n.yAxis,n.xAxis);else{var l=lD(n,a,e,t);r=l.valueDataDim,l.valueAxis,s=cD(a,r,o);}var h="x"===r?0:1,u=1-h,c=A(n),d={};c.type=null,c.coord=[],d.coord=[],c.coord[u]=-1/0,d.coord[u]=1/0;var f=i.get("precision");0<=f&&"number"==typeof s&&(s=+s.toFixed(Math.min(f,20))),c.coord[h]=d.coord[h]=s,n=[c,d,{type:o,valueIndex:n.valueIndex,value:s}];}return(n=[sD(t,n[0]),sD(t,n[1]),k({},n[2])])[2].type=n[2].type||"",g(n[2],n[0]),g(n[2],n[1]),n;};function gD(t){return!isNaN(t)&&!isFinite(t);}function mD(t,e,i,n){var a=1-t,o=n.dimensions[t];return gD(e[a])&&gD(i[a])&&e[t]===i[t]&&n.getAxis(o).containData(e[t]);}function vD(t,e){if("cartesian2d"===t.type){var i=e[0].coord,n=e[1].coord;if(i&&n&&(mD(1,i,n,t)||mD(0,i,n,t)))return!0;}return hD(t,e[0])&&hD(t,e[1]);}function yD(t,e,i,n,a){var o,r=n.coordinateSystem,s=t.getItemModel(e),l=Es(s.get("x"),a.getWidth()),h=Es(s.get("y"),a.getHeight());if(isNaN(l)||isNaN(h)){if(n.getMarkerPosition)o=n.getMarkerPosition(t.getValues(t.dimensions,e));else{var u=r.dimensions,c=t.get(u[0],e),d=t.get(u[1],e);o=r.dataToPoint([c,d]);}if("cartesian2d"===r.type){var f=r.getAxis("x"),p=r.getAxis("y");u=r.dimensions;gD(t.get(u[0],e))?o[0]=f.toGlobalCoord(f.getExtent()[i?0:1]):gD(t.get(u[1],e))&&(o[1]=p.toGlobalCoord(p.getExtent()[i?0:1]));}isNaN(l)||(o[0]=l),isNaN(h)||(o[1]=h);}else o=[l,h];t.setItemLayout(e,o);}dD.extend({type:"markLine",updateTransform:function updateTransform(t,e,o){e.eachSeries(function(e){var t=e.markLineModel;if(t){var i=t.getData(),n=t.__from,a=t.__to;n.each(function(t){yD(n,t,!0,e,o),yD(a,t,!1,e,o);}),i.each(function(t){i.setItemLayout(t,[n.getItemLayout(t),a.getItemLayout(t)]);}),this.markerGroupMap.get(e.id).updateLayout();}},this);},renderSeries:function renderSeries(a,i,t,o){var e=a.coordinateSystem,n=a.id,r=a.getData(),s=this.markerGroupMap,l=s.get(n)||s.set(n,new zy());this.group.add(l.group);var h=function(t,i,e){var n;n=t?P(t&&t.dimensions,function(t){var e=i.getData().getDimensionInfo(i.getData().mapDimension(t))||{};return C({name:t},e);}):[{name:"value",type:"float"}];var a=new pd(n,e),o=new pd(n,e),r=new pd([],e),s=P(e.get("data"),N(pD,i,t,e));t&&(s=T(s,N(vD,t)));var l=t?uD:function(t){return t.value;};return a.initData(P(s,function(t){return t[0];}),null,l),o.initData(P(s,function(t){return t[1];}),null,l),r.initData(P(s,function(t){return t[2];})),r.hasItemOption=!0,{from:a,to:o,line:r};}(e,a,i),u=h.from,c=h.to,d=h.line;i.__from=u,i.__to=c,i.setData(d);var f=i.get("symbol"),p=i.get("symbolSize");function g(t,e,i){var n=t.getItemModel(e);yD(t,e,i,a,o),t.setItemVisual(e,{symbolSize:n.get("symbolSize")||p[i?0:1],symbol:n.get("symbol",!0)||f[i?0:1],color:n.get("itemStyle.color")||r.getVisual("color")});}E(f)||(f=[f,f]),"number"==typeof p&&(p=[p,p]),h.from.each(function(t){g(u,t,!0),g(c,t,!1);}),d.each(function(t){var e=d.getItemModel(t).get("lineStyle.color");d.setItemVisual(t,{color:e||u.getItemVisual(t,"color")}),d.setItemLayout(t,[u.getItemLayout(t),c.getItemLayout(t)]),d.setItemVisual(t,{fromSymbolSize:u.getItemVisual(t,"symbolSize"),fromSymbol:u.getItemVisual(t,"symbol"),toSymbolSize:c.getItemVisual(t,"symbolSize"),toSymbol:c.getItemVisual(t,"symbol")});}),l.updateData(d),h.line.eachItemGraphicEl(function(t,e){t.traverse(function(t){t.dataModel=i;});}),l.__keep=!0,l.group.silent=i.get("silent")||a.get("silent");}}),Wc(function(t){t.markLine=t.markLine||{};}),iD.extend({type:"markArea",defaultOption:{zlevel:0,z:1,tooltip:{trigger:"item"},animation:!1,label:{show:!0,position:"top"},itemStyle:{borderWidth:0},emphasis:{label:{show:!0,position:"top"}}}});var xD=function xD(t,e,i,n){var a=sD(t,n[0]),o=sD(t,n[1]),r=W,s=a.coord,l=o.coord;s[0]=r(s[0],-1/0),s[1]=r(s[1],-1/0),l[0]=r(l[0],1/0),l[1]=r(l[1],1/0);var h=p([{},a,o]);return h.coord=[a.coord,o.coord],h.x0=a.x,h.y0=a.y,h.x1=o.x,h.y1=o.y,h;};function _D(t){return!isNaN(t)&&!isFinite(t);}function wD(t,e,i,n){var a=1-t;return _D(e[a])&&_D(i[a]);}function bD(t,e){var i=e.coord[0],n=e.coord[1];return!("cartesian2d"!==t.type||!i||!n||!wD(1,i,n)&&!wD(0,i,n))||hD(t,{coord:i,x:e.x0,y:e.y0})||hD(t,{coord:n,x:e.x1,y:e.y1});}function SD(t,e,i,n,a){var o,r=n.coordinateSystem,s=t.getItemModel(e),l=Es(s.get(i[0]),a.getWidth()),h=Es(s.get(i[1]),a.getHeight());if(isNaN(l)||isNaN(h)){if(n.getMarkerPosition)o=n.getMarkerPosition(t.getValues(i,e));else{var u=[f=t.get(i[0],e),p=t.get(i[1],e)];r.clampData&&r.clampData(u,u),o=r.dataToPoint(u,!0);}if("cartesian2d"===r.type){var c=r.getAxis("x"),d=r.getAxis("y"),f=t.get(i[0],e),p=t.get(i[1],e);_D(f)?o[0]=c.toGlobalCoord(c.getExtent()["x0"===i[0]?0:1]):_D(p)&&(o[1]=d.toGlobalCoord(d.getExtent()["y0"===i[1]?0:1]));}isNaN(l)||(o[0]=l),isNaN(h)||(o[1]=h);}else o=[l,h];return o;}var MD=[["x0","y0"],["x1","y0"],["x1","y1"],["x0","y1"]];dD.extend({type:"markArea",updateTransform:function updateTransform(t,e,a){e.eachSeries(function(i){var t=i.markAreaModel;if(t){var n=t.getData();n.each(function(e){var t=P(MD,function(t){return SD(n,e,t,i,a);});n.setItemLayout(e,t),n.getItemGraphicEl(e).setShape("points",t);});}},this);},renderSeries:function renderSeries(i,r,t,n){var e=i.coordinateSystem,a=i.id,o=i.getData(),s=this.markerGroupMap,l=s.get(a)||s.set(a,{group:new ii()});this.group.add(l.group),l.__keep=!0;var h=function(t,n,e){var i,a;t?(i=P(t&&t.dimensions,function(t){var e=n.getData(),i=e.getDimensionInfo(e.mapDimension(t))||{};return C({name:t},i);}),a=new pd(P(["x0","y0","x1","y1"],function(t,e){return{name:t,type:i[e%2].type};}),e)):a=new pd(i=[{name:"value",type:"float"}],e);var o=P(e.get("data"),N(xD,n,t,e));t&&(o=T(o,N(bD,t)));var r=t?function(t,e,i,n){return t.coord[Math.floor(n/2)][n%2];}:function(t){return t.value;};return a.initData(o,null,r),a.hasItemOption=!0,a;}(e,i,r);r.setData(h),h.each(function(e){h.setItemLayout(e,P(MD,function(t){return SD(h,e,t,i,n);})),h.setItemVisual(e,{color:o.getVisual("color")});}),h.diff(l.__data).add(function(t){var e=new xr({shape:{points:h.getItemLayout(t)}});h.setItemGraphicEl(t,e),l.group.add(e);}).update(function(t,e){var i=l.__data.getItemGraphicEl(e);fs(i,{shape:{points:h.getItemLayout(t)}},r,t),l.group.add(i),h.setItemGraphicEl(t,i);}).remove(function(t){var e=l.__data.getItemGraphicEl(t);l.group.remove(e);}).execute(),h.eachItemGraphicEl(function(t,e){var i=h.getItemModel(e),n=i.getModel("label"),a=i.getModel("emphasis.label"),o=h.getItemVisual(e,"color");t.useStyle(C(i.getModel("itemStyle").getItemStyle(),{fill:Ie(o,.4),stroke:o})),t.hoverStyle=i.getModel("emphasis.itemStyle").getItemStyle(),os(t.style,t.hoverStyle,n,a,{labelFetcher:r,labelDataIndex:e,defaultText:h.getName(e)||"",isRectText:!0,autoColor:o}),as(t,{}),t.dataModel=r;}),l.__data=h,l.group.silent=r.get("silent")||i.get("silent");}}),Wc(function(t){t.markArea=t.markArea||{};});function ID(t){var e=t.itemStyle||(t.itemStyle={}),i=e.emphasis||(e.emphasis={}),n=t.label||t.label||{},a=n.normal||(n.normal={}),o={normal:1,emphasis:1};z(n,function(t,e){o[e]||TD(a,e)||(a[e]=t);}),i.label&&!TD(n,"emphasis")&&(n.emphasis=i.label,delete i.label);}function TD(t,e){return t.hasOwnProperty(e);}Cl.registerSubTypeDefaulter("timeline",function(){return"slider";}),Hc({type:"timelineChange",event:"timelineChanged",update:"prepareAndUpdate"},function(t,e){var i=e.getComponent("timeline");return i&&null!=t.currentIndex&&(i.setCurrentIndex(t.currentIndex),!i.get("loop",!0)&&i.isIndexMax()&&i.setPlayState(!1)),e.resetOption("timeline"),C({currentIndex:i.option.currentIndex},t);}),Hc({type:"timelinePlayChange",event:"timelinePlayChanged",update:"update"},function(t,e){var i=e.getComponent("timeline");i&&null!=t.playState&&i.setPlayState(t.playState);});var DD=Cl.extend({type:"timeline",layoutMode:"box",defaultOption:{zlevel:0,z:4,show:!0,axisType:"time",realtime:!0,left:"20%",top:null,right:"20%",bottom:0,width:null,height:40,padding:5,controlPosition:"left",autoPlay:!1,rewind:!1,loop:!0,playInterval:2e3,currentIndex:0,itemStyle:{},label:{color:"#000"},data:[]},init:function init(t,e,i){this._data,this._names,this.mergeDefaultAndTheme(t,i),this._initData();},mergeOption:function mergeOption(t){DD.superApply(this,"mergeOption",arguments),this._initData();},setCurrentIndex:function setCurrentIndex(t){null==t&&(t=this.option.currentIndex);var e=this._data.count();this.option.loop?t=(t%e+e)%e:(e<=t&&(t=e-1),t<0&&(t=0)),this.option.currentIndex=t;},getCurrentIndex:function getCurrentIndex(){return this.option.currentIndex;},isIndexMax:function isIndexMax(){return this.getCurrentIndex()>=this._data.count()-1;},setPlayState:function setPlayState(t){this.option.autoPlay=!!t;},getPlayState:function getPlayState(){return!!this.option.autoPlay;},_initData:function _initData(){var t=this.option,e=t.data||[],i=t.axisType,a=this._names=[];if("category"===i){var o=[];z(e,function(t,e){var i,n=ha(t);R(t)?(i=A(t)).value=e:i=e,o.push(i),D(n)||null!=n&&!isNaN(n)||(n=""),a.push(n+"");}),e=o;}var n={category:"ordinal",time:"time"}[i]||"number";(this._data=new pd([{name:"value",type:n}],this)).initData(e,a);},getData:function getData(){return this._data;},getCategories:function getCategories(){if("category"===this.get("axisType"))return this._names.slice();}});w(DD.extend({type:"timeline.slider",defaultOption:{backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,orient:"horizontal",inverse:!1,tooltip:{trigger:"item"},symbol:"emptyCircle",symbolSize:10,lineStyle:{show:!0,width:2,color:"#304654"},label:{position:"auto",show:!0,interval:"auto",rotate:0,color:"#304654"},itemStyle:{color:"#304654",borderWidth:1},checkpointStyle:{symbol:"circle",symbolSize:13,color:"#c23531",borderWidth:5,borderColor:"rgba(194,53,49, 0.5)",animation:!0,animationDuration:300,animationEasing:"quinticInOut"},controlStyle:{show:!0,showPlayBtn:!0,showPrevBtn:!0,showNextBtn:!0,itemSize:22,itemGap:12,position:"left",playIcon:"path://M31.6,53C17.5,53,6,41.5,6,27.4S17.5,1.8,31.6,1.8C45.7,1.8,57.2,13.3,57.2,27.4S45.7,53,31.6,53z M31.6,3.3 C18.4,3.3,7.5,14.1,7.5,27.4c0,13.3,10.8,24.1,24.1,24.1C44.9,51.5,55.7,40.7,55.7,27.4C55.7,14.1,44.9,3.3,31.6,3.3z M24.9,21.3 c0-2.2,1.6-3.1,3.5-2l10.5,6.1c1.899,1.1,1.899,2.9,0,4l-10.5,6.1c-1.9,1.1-3.5,0.2-3.5-2V21.3z",stopIcon:"path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z",nextIcon:"path://M18.6,50.8l22.5-22.5c0.2-0.2,0.3-0.4,0.3-0.7c0-0.3-0.1-0.5-0.3-0.7L18.7,4.4c-0.1-0.1-0.2-0.3-0.2-0.5 c0-0.4,0.3-0.8,0.8-0.8c0.2,0,0.5,0.1,0.6,0.3l23.5,23.5l0,0c0.2,0.2,0.3,0.4,0.3,0.7c0,0.3-0.1,0.5-0.3,0.7l-0.1,0.1L19.7,52 c-0.1,0.1-0.3,0.2-0.5,0.2c-0.4,0-0.8-0.3-0.8-0.8C18.4,51.2,18.5,51,18.6,50.8z",prevIcon:"path://M43,52.8L20.4,30.3c-0.2-0.2-0.3-0.4-0.3-0.7c0-0.3,0.1-0.5,0.3-0.7L42.9,6.4c0.1-0.1,0.2-0.3,0.2-0.5 c0-0.4-0.3-0.8-0.8-0.8c-0.2,0-0.5,0.1-0.6,0.3L18.3,28.8l0,0c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.3,0.1,0.5,0.3,0.7l0.1,0.1L41.9,54 c0.1,0.1,0.3,0.2,0.5,0.2c0.4,0,0.8-0.3,0.8-0.8C43.2,53.2,43.1,53,43,52.8z",color:"#304654",borderColor:"#304654",borderWidth:1},emphasis:{label:{show:!0,color:"#c23531"},itemStyle:{color:"#c23531"},controlStyle:{color:"#c23531",borderColor:"#c23531",borderWidth:2}},data:[]}}),Fh);var AD=eu.extend({type:"timeline"}),CD=function CD(t,e,i,n){Wf.call(this,t,e,i),this.type=n||"value",this._autoLabelInterval,this.model=null;};CD.prototype={constructor:CD,getLabelInterval:function getLabelInterval(){var t,e=this.model,i=e.getModel("label");return null!=(t=i.get("interval"))&&"auto"!=t||(t=this._autoLabelInterval)||(t=this._autoLabelInterval=vf(P(this.scale.getTicks(),this.dataToCoord,this),yf(this,i.get("formatter")),i.getFont(),"horizontal"===e.get("orient")?0:90,i.get("rotate"))),t;},isLabelIgnored:function isLabelIgnored(t){if("category"===this.type){var e=this.getLabelInterval();return"function"==typeof e&&!e(t,this.scale.getLabel(t))||t%(e+1);}}},_(CD,Wf);var LD=S,kD=z,PD=Math.PI;function ND(t,e,i,n,a,o){var r=e.get("color");a?(a.setColor(r),i.add(a),o&&o.onUpdate(a)):((a=Cf(t.get("symbol"),-1,-1,2,2,r)).setStyle("strokeNoScale",!0),i.add(a),o&&o.onCreate(a));var s=e.getItemStyle(["color","symbol","symbolSize"]);a.setStyle(s),n=g({rectHover:!0,z2:100},n,!0);var l=t.get("symbolSize");(l=l instanceof Array?l.slice():[+l,+l])[0]/=2,l[1]/=2,n.scale=l;var h=t.get("symbolOffset");if(h){var u=n.position=n.position||[0,0];u[0]+=Es(h[0],l[0]),u[1]+=Es(h[1],l[1]);}var c=t.get("symbolRotate");return n.rotation=(c||0)*Math.PI/180||0,a.attr(n),a.updateTransform(),a;}function OD(t,e,i,n,a){if(!t.dragging){var o=n.getModel("checkpointStyle"),r=i.dataToCoord(n.getData().get(["value"],e));a||!o.get("animation",!0)?t.attr({position:[r,0]}):(t.stopAnimation(!0),t.animateTo({position:[r,0]},o.get("animationDuration",!0),o.get("animationEasing",!0)));}}AD.extend({type:"timeline.slider",init:function init(t,e){this.api=e,this._axis,this._viewRect,this._timer,this._currentPointer,this._mainGroup,this._labelGroup;},render:function render(e,t,i,n){if(this.model=e,this.api=i,this.ecModel=t,this.group.removeAll(),e.get("show",!0)){var a=this._layout(e,i),o=this._createGroup("mainGroup"),r=this._createGroup("labelGroup"),s=this._axis=this._createAxis(a,e);e.formatTooltip=function(t){return al(s.scale.getLabel(t));},kD(["AxisLine","AxisTick","Control","CurrentPointer"],function(t){this["_render"+t](a,o,s,e);},this),this._renderAxisLabel(a,r,s,e),this._position(a,e);}this._doPlayStop();},remove:function remove(){this._clearTimer(),this.group.removeAll();},dispose:function dispose(){this._clearTimer();},_layout:function _layout(t,e){var i,n,a=t.get("label.position"),o=t.get("orient"),r=(n=e,wl((i=t).getBoxLayoutParams(),{width:n.getWidth(),height:n.getHeight()},i.get("padding")));null==a||"auto"===a?a="horizontal"===o?r.y+r.height/2<e.getHeight()/2?"-":"+":r.x+r.width/2<e.getWidth()/2?"+":"-":isNaN(a)&&(a={horizontal:{top:"-",bottom:"+"},vertical:{left:"-",right:"+"}}[o][a]);var s,l,h,u,c={horizontal:"center",vertical:0<=a||"+"===a?"left":"right"},d={horizontal:0<=a||"+"===a?"top":"bottom",vertical:"middle"},f={horizontal:0,vertical:PD/2},p="vertical"===o?r.height:r.width,g=t.getModel("controlStyle"),m=g.get("show",!0),v=m?g.get("itemSize"):0,y=m?g.get("itemGap"):0,x=v+y,_=t.get("label.rotate")||0;_=_*PD/180;var w=g.get("position",!0),b=m&&g.get("showPlayBtn",!0),S=m&&g.get("showPrevBtn",!0),M=m&&g.get("showNextBtn",!0),I=0,T=p;return"left"===w||"bottom"===w?(b&&(s=[0,0],I+=x),S&&(l=[I,0],I+=x)):(b&&(s=[T-v,0],T-=x),S&&(l=[0,0],I+=x)),M&&(h=[T-v,0],T-=x),u=[I,T],t.get("inverse")&&u.reverse(),{viewRect:r,mainLength:p,orient:o,rotation:f[o],labelRotation:_,labelPosOpt:a,labelAlign:t.get("label.align")||c[o],labelBaseline:t.get("label.verticalAlign")||t.get("label.baseline")||d[o],playPosition:s,prevBtnPosition:l,nextBtnPosition:h,axisExtent:u,controlSize:v,controlGap:y};},_position:function _position(t,e){var i=this._mainGroup,n=this._labelGroup,a=t.viewRect;if("vertical"===t.orient){var o=Et(),r=a.x,s=a.y+a.height;Vt(o,o,[-r,-s]),Gt(o,o,-PD/2),Vt(o,o,[r,s]),(a=a.clone()).applyTransform(o);}var l=m(a),h=m(i.getBoundingRect()),u=m(n.getBoundingRect()),c=i.position,d=n.position;d[0]=c[0]=l[0][0];var f,p=t.labelPosOpt;isNaN(p)?(v(c,h,l,1,f="+"===p?0:1),v(d,u,l,1,1-f)):(v(c,h,l,1,f=0<=p?0:1),d[1]=c[1]+p);function g(t){var e=t.position;t.origin=[l[0][0]-e[0],l[1][0]-e[1]];}function m(t){return[[t.x,t.x+t.width],[t.y,t.y+t.height]];}function v(t,e,i,n,a){t[n]+=i[n][a]-e[n][a];}i.attr("position",c),n.attr("position",d),i.rotation=n.rotation=t.rotation,g(i),g(n);},_createAxis:function _createAxis(t,e){var i=e.getData(),n=e.get("axisType"),a=mf(e,n),o=i.getDataExtent("value");a.setExtent(o[0],o[1]),this._customizeScale(a,i),a.niceTicks();var r=new CD("value",a,t.axisExtent,n);return r.model=e,r;},_customizeScale:function _customizeScale(t,e){t.getTicks=function(){return e.mapArray(["value"],function(t){return t;});},t.getTicksLabels=function(){return P(this.getTicks(),t.getLabel,t);};},_createGroup:function _createGroup(t){var e=this["_"+t]=new ii();return this.group.add(e),e;},_renderAxisLine:function _renderAxisLine(t,e,i,n){var a=i.getExtent();n.get("lineStyle.show")&&e.add(new br({shape:{x1:a[0],y1:0,x2:a[1],y2:0},style:k({lineCap:"round"},n.getModel("lineStyle").getLineStyle()),silent:!0,z2:1}));},_renderAxisTick:function _renderAxisTick(t,l,h,u){var c=u.getData(),e=h.scale.getTicks();kD(e,function(t,e){var i=h.dataToCoord(t),n=c.getItemModel(e),a=n.getModel("itemStyle"),o=n.getModel("emphasis.itemStyle"),r={position:[i,0],onclick:LD(this._changeTimeline,this,e)},s=ND(n,a,l,r);as(s,o.getItemStyle()),n.get("tooltip")?(s.dataIndex=e,s.dataModel=u):s.dataIndex=s.dataModel=null;},this);},_renderAxisLabel:function _renderAxisLabel(s,l,h,t){var e=t.getModel("label");if(e.get("show")){var u=t.getData(),i=h.scale.getTicks(),c=yf(h,e.get("formatter")),d=h.getLabelInterval();kD(i,function(t,e){if(!h.isLabelIgnored(e,d)){var i=u.getItemModel(e),n=i.getModel("label"),a=i.getModel("emphasis.label"),o=h.dataToCoord(t),r=new hr({position:[o,0],rotation:s.labelRotation-s.rotation,onclick:LD(this._changeTimeline,this,e),silent:!1});rs(r.style,n,{text:c[e],textAlign:s.labelAlign,textVerticalAlign:s.labelBaseline}),l.add(r),as(r,rs({},a));}},this);}},_renderControl:function _renderControl(t,l,e,h){var u=t.controlSize,c=t.rotation,d=h.getModel("controlStyle").getItemStyle(),f=h.getModel("emphasis.controlStyle").getItemStyle(),p=[0,-u/2,u,u],i=h.getPlayState(),n=h.get("inverse",!0);function a(t,e,i,n){if(t){var a,o,r,s=(a=e,o=p,r={position:t,origin:[u/2,0],rotation:n?-c:0,rectHover:!0,style:d,onclick:i},Br(h.get(a).replace(/^path:\/\//,""),A(r||{}),new ei(o[0],o[1],o[2],o[3]),"center"));l.add(s),as(s,f);}}a(t.nextBtnPosition,"controlStyle.nextIcon",LD(this._changeTimeline,this,n?"-":"+")),a(t.prevBtnPosition,"controlStyle.prevIcon",LD(this._changeTimeline,this,n?"+":"-")),a(t.playPosition,"controlStyle."+(i?"stopIcon":"playIcon"),LD(this._handlePlayClick,this,!i),!0);},_renderCurrentPointer:function _renderCurrentPointer(t,e,i,n){var a=n.getData(),o=n.getCurrentIndex(),r=a.getItemModel(o).getModel("checkpointStyle"),s=this,l={onCreate:function onCreate(t){t.draggable=!0,t.drift=LD(s._handlePointerDrag,s),t.ondragend=LD(s._handlePointerDragend,s),OD(t,o,i,n,!0);},onUpdate:function onUpdate(t){OD(t,o,i,n);}};this._currentPointer=ND(r,r,this._mainGroup,{},this._currentPointer,l);},_handlePlayClick:function _handlePlayClick(t){this._clearTimer(),this.api.dispatchAction({type:"timelinePlayChange",playState:t,from:this.uid});},_handlePointerDrag:function _handlePointerDrag(t,e,i){this._clearTimer(),this._pointerChangeTimeline([i.offsetX,i.offsetY]);},_handlePointerDragend:function _handlePointerDragend(t){this._pointerChangeTimeline([t.offsetX,t.offsetY],!0);},_pointerChangeTimeline:function _pointerChangeTimeline(t,e){var i=this._toAxisCoord(t)[0],n=zs(this._axis.getExtent().slice());i>n[1]&&(i=n[1]),i<n[0]&&(i=n[0]),this._currentPointer.position[0]=i,this._currentPointer.dirty();var a=this._findNearestTick(i),o=this.model;(e||a!==o.getCurrentIndex()&&o.get("realtime"))&&this._changeTimeline(a);},_doPlayStop:function _doPlayStop(){this._clearTimer(),this.model.getPlayState()&&(this._timer=setTimeout(LD(function(){var t=this.model;this._changeTimeline(t.getCurrentIndex()+(t.get("rewind",!0)?-1:1));},this),this.model.get("playInterval")));},_toAxisCoord:function _toAxisCoord(t){return ms(t,this._mainGroup.getLocalTransform(),!0);},_findNearestTick:function _findNearestTick(a){var o,t=this.model.getData(),r=1/0,s=this._axis;return t.each(["value"],function(t,e){var i=s.dataToCoord(t),n=Math.abs(i-a);n<r&&(r=n,o=e);}),o;},_clearTimer:function _clearTimer(){this._timer&&(clearTimeout(this._timer),this._timer=null);},_changeTimeline:function _changeTimeline(t){var e=this.model.getCurrentIndex();"+"===t?t=e+1:"-"===t&&(t=e-1),this.api.dispatchAction({type:"timelineChange",currentIndex:t,from:this.uid});}}),Wc(function(t){var e=t&&t.timeline;E(e)||(e=e?[e]:[]),z(e,function(t){t&&function(t){var e=t.type,i={number:"value",time:"time"};if(i[e]&&(t.axisType=i[e],delete t.type),ID(t),TD(t,"controlPosition")){var n=t.controlStyle||(t.controlStyle={});TD(n,"position")||(n.position=t.controlPosition),"none"!==n.position||TD(n,"show")||(n.show=!1,delete n.position),delete t.controlPosition;}z(t.data||[],function(t){R(t)&&!E(t)&&(!TD(t,"value")&&TD(t,"name")&&(t.value=t.name),ID(t));});}(t);});});var ED=qc({type:"toolbox",layoutMode:{type:"box",ignoreSize:!0},optionUpdated:function optionUpdated(){ED.superApply(this,"optionUpdated",arguments),z(this.option.feature,function(t,e){var i=SI(e);i&&g(t,i.defaultOption);});},defaultOption:{show:!0,z:6,zlevel:0,orient:"horizontal",left:"right",top:"top",backgroundColor:"transparent",borderColor:"#ccc",borderRadius:0,borderWidth:0,padding:5,itemSize:15,itemGap:8,showTitle:!0,iconStyle:{borderColor:"#666",color:"none"},emphasis:{iconStyle:{borderColor:"#3E98C5"}}}});Kc({type:"toolbox",render:function render(u,c,d,s){var f=this.group;if(f.removeAll(),u.get("show")){var t,e,i,n,a,o,r,p=+u.get("itemSize"),l=u.get("feature")||{},h=this._features||(this._features={}),g=[];z(l,function(t,e){g.push(e);}),new ed(this._featureNames||[],g).add(m).update(m).remove(N(m,null)).execute(),this._featureNames=g,t=f,i=d,n=(e=u).getBoxLayoutParams(),a=e.get("padding"),o={width:i.getWidth(),height:i.getHeight()},r=wl(n,o,a),_l(e.get("orient"),t,e.get("itemGap"),r.width,r.height),bl(t,n,o,a),f.add(ZS(f.getBoundingRect(),u)),f.eachChild(function(t){var e=t.__title,i=t.hoverStyle;if(i&&e){var n=Vi(e,$i(i)),a=t.position[0]+f.position[0],o=!1;t.position[1]+f.position[1]+p+n.height>d.getHeight()&&(i.textPosition="top",o=!0);var r=o?-5-n.height:p+8;a+n.width/2>d.getWidth()?(i.textPosition=["100%",r],i.textAlign="right"):a-n.width/2<0&&(i.textPosition=[0,r],i.textAlign="left");}});}function m(t,e){var i,n=g[t],a=g[e],o=new As(l[n],u,u.ecModel);if(n&&!a){if(0===n.indexOf("my"))i={model:o,onclick:o.option.onclick,featureName:n};else{var r=SI(n);if(!r)return;i=new r(o,c,d);}h[n]=i;}else{if(!(i=h[a]))return;i.model=o,i.ecModel=c,i.api=d;}n||!a?o.get("show")&&!i.unusable?(!function(n,a,t){var o=n.getModel("iconStyle"),r=n.getModel("emphasis.iconStyle"),e=a.getIcons?a.getIcons():n.get("icon"),s=n.get("title")||{};if("string"==typeof e){var i=e,l=s;s={},(e={})[t]=i,s[t]=l;}var h=n.iconPaths={};z(e,function(t,e){var i=_s(t,{},{x:-p/2,y:-p/2,width:p,height:p});i.setStyle(o.getItemStyle()),i.hoverStyle=r.getItemStyle(),as(i),u.get("showTitle")&&(i.__title=s[e],i.on("mouseover",function(){var t=r.getItemStyle();i.setStyle({text:s[e],textPosition:t.textPosition||"bottom",textFill:t.fill||t.stroke||"#000",textAlign:t.textAlign||"center"});}).on("mouseout",function(){i.setStyle({textFill:null});})),i.trigger(n.get("iconStatus."+e)||"normal"),f.add(i),i.on("click",S(a.onclick,a,c,d,e)),h[e]=i;});}(o,i,n),o.setIconStatus=function(t,e){var i=this.option,n=this.iconPaths;i.iconStatus=i.iconStatus||{},i.iconStatus[t]=e,n[t]&&n[t].trigger(e);},i.render&&i.render(o,c,d,s)):i.remove&&i.remove(c,d):i.dispose&&i.dispose(c,d);}},updateView:function updateView(t,e,i,n){z(this._features,function(t){t.updateView&&t.updateView(t.model,e,i,n);});},remove:function remove(e,i){z(this._features,function(t){t.remove&&t.remove(e,i);}),this.group.removeAll();},dispose:function dispose(e,i){z(this._features,function(t){t.dispose&&t.dispose(e,i);});}});var RD=_u.toolbox.saveAsImage;function zD(t){this.model=t;}zD.defaultOption={show:!0,icon:"M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0",title:RD.title,type:"png",name:"",excludeComponents:["toolbox"],pixelRatio:1,lang:RD.lang.slice()},zD.prototype.unusable=!v.canvasSupported,zD.prototype.onclick=function(t,e){var i=this.model,n=i.get("name")||t.get("title.0.text")||"echarts",a=document.createElement("a"),o=i.get("type",!0)||"png";a.download=n+"."+o,a.target="_blank";var r=e.getConnectedDataURL({type:o,backgroundColor:i.get("backgroundColor",!0)||t.get("backgroundColor")||"#fff",excludeComponents:i.get("excludeComponents"),pixelRatio:i.get("pixelRatio")});if(a.href=r,"function"!=typeof MouseEvent||v.browser.ie||v.browser.edge){if(window.navigator.msSaveOrOpenBlob){for(var s=atob(r.split(",")[1]),l=s.length,h=new Uint8Array(l);l--;){h[l]=s.charCodeAt(l);}var u=new Blob([h]);window.navigator.msSaveOrOpenBlob(u,n+"."+o);}else{var c=i.get("lang"),d='<body style="margin:0;"><img src="'+r+'" style="max-width:100%;" title="'+(c&&c[0]||"")+'" /></body>';window.open().document.write(d);}}else{var f=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1});a.dispatchEvent(f);}},bI("saveAsImage",zD);var BD=_u.toolbox.magicType;function VD(t){this.model=t;}VD.defaultOption={show:!0,type:[],icon:{line:"M4.1,28.9h7.1l9.3-22l7.4,38l9.7-19.7l3,12.8h14.9M4.1,58h51.4",bar:"M6.7,22.9h10V48h-10V22.9zM24.9,13h10v35h-10V13zM43.2,2h10v46h-10V2zM3.1,58h53.7",stack:"M8.2,38.4l-8.4,4.1l30.6,15.3L60,42.5l-8.1-4.1l-21.5,11L8.2,38.4z M51.9,30l-8.1,4.2l-13.4,6.9l-13.9-6.9L8.2,30l-8.4,4.2l8.4,4.2l22.2,11l21.5-11l8.1-4.2L51.9,30z M51.9,21.7l-8.1,4.2L35.7,30l-5.3,2.8L24.9,30l-8.4-4.1l-8.3-4.2l-8.4,4.2L8.2,30l8.3,4.2l13.9,6.9l13.4-6.9l8.1-4.2l8.1-4.1L51.9,21.7zM30.4,2.2L-0.2,17.5l8.4,4.1l8.3,4.2l8.4,4.2l5.5,2.7l5.3-2.7l8.1-4.2l8.1-4.2l8.1-4.1L30.4,2.2z",tiled:"M2.3,2.2h22.8V25H2.3V2.2z M35,2.2h22.8V25H35V2.2zM2.3,35h22.8v22.8H2.3V35z M35,35h22.8v22.8H35V35z"},title:A(BD.title),option:{},seriesIndex:{}};var GD=VD.prototype;GD.getIcons=function(){var t=this.model,e=t.get("icon"),i={};return z(t.get("type"),function(t){e[t]&&(i[t]=e[t]);}),i;};var WD={line:function line(t,e,i,n){if("bar"===t)return g({id:e,type:"line",data:i.get("data"),stack:i.get("stack"),markPoint:i.get("markPoint"),markLine:i.get("markLine")},n.get("option.line")||{},!0);},bar:function bar(t,e,i,n){if("line"===t)return g({id:e,type:"bar",data:i.get("data"),stack:i.get("stack"),markPoint:i.get("markPoint"),markLine:i.get("markLine")},n.get("option.bar")||{},!0);},stack:function stack(t,e,i,n){if("line"===t||"bar"===t)return g({id:e,stack:"__ec_magicType_stack__"},n.get("option.stack")||{},!0);},tiled:function tiled(t,e,i,n){if("line"===t||"bar"===t)return g({id:e,stack:""},n.get("option.tiled")||{},!0);}},FD=[["line","bar"],["stack","tiled"]];GD.onclick=function(h,t,u){var c=this.model,e=c.get("seriesIndex."+u);if(WD[u]){var d={series:[]};z(FD,function(t){0<=L(t,u)&&z(t,function(t){c.setIconStatus(t,"normal");});}),c.setIconStatus(u,"emphasis"),h.eachComponent({mainType:"series",query:null==e?null:{seriesIndex:e}},function(t){var e=t.subType,i=t.id,n=WD[u](e,i,t,c);n&&(C(n,t.option),d.series.push(n));var a=t.coordinateSystem;if(a&&"cartesian2d"===a.type&&("line"===u||"bar"===u)){var o=a.getAxesByScale("ordinal")[0];if(o){var r=o.dim+"Axis",s=h.queryComponents({mainType:r,index:t.get(name+"Index"),id:t.get(name+"Id")})[0].componentIndex;d[r]=d[r]||[];for(var l=0;l<=s;l++){d[r][s]=d[r][s]||{};}d[r][s].boundaryGap="bar"===u;}}}),t.dispatchAction({type:"changeMagicType",currentType:u,newOption:d});}},Hc({type:"changeMagicType",event:"magicTypeChanged",update:"prepareAndUpdate"},function(t,e){e.mergeOption(t.newOption);}),bI("magicType",VD);var HD=_u.toolbox.dataView,ZD=new Array(60).join("-"),UD="\t";function jD(t){var a,o,r,e,i,u,n=(a={},o=[],r=[],t.eachRawSeries(function(t){var e=t.coordinateSystem;if(!e||"cartesian2d"!==e.type&&"polar"!==e.type)o.push(t);else{var i=e.getBaseAxis();if("category"===i.type){var n=i.dim+"_"+i.index;a[n]||(a[n]={categoryAxis:i,valueAxis:e.getOtherAxis(i),series:[]},r.push({axisDim:i.dim,axisIndex:i.index})),a[n].series.push(t);}else o.push(t);}}),{seriesGroupByCategoryAxis:a,other:o,meta:r});return{value:T([(i=n.seriesGroupByCategoryAxis,u=[],z(i,function(t,e){var i=t.categoryAxis,n=t.valueAxis.dim,a=[" "].concat(P(t.series,function(t){return t.name;})),o=[i.model.getCategories()];z(t.series,function(t){o.push(t.getRawData().mapArray(n,function(t){return t;}));});for(var r=[a.join(UD)],s=0;s<o[0].length;s++){for(var l=[],h=0;h<o.length;h++){l.push(o[h][s]);}r.push(l.join(UD));}u.push(r.join("\n"));}),u.join("\n\n"+ZD+"\n\n")),(e=n.other,P(e,function(t){var a=t.getRawData(),o=[t.name],r=[];return a.each(a.dimensions,function(){for(var t=arguments.length,e=arguments[t-1],i=a.getName(e),n=0;n<t-1;n++){r[n]=arguments[n];}o.push((i?i+UD:"")+r.join(UD));}),o.join("\n");}).join("\n\n"+ZD+"\n\n"))],function(t){return t.replace(/[\n\t\s]/g,"");}).join("\n\n"+ZD+"\n\n"),meta:n.meta};}function XD(t){return t.replace(/^\s\s*/,"").replace(/\s\s*$/,"");}var YD=new RegExp("["+UD+"]+","g");function qD(t,o){var e=t.split(new RegExp("\n*"+ZD+"\n*","g")),r={series:[]};return z(e,function(t,e){if(function(t){if(0<=t.slice(0,t.indexOf("\n")).indexOf(UD))return!0;}(t)){var i=function(t){for(var e=t.split(/\n+/g),i=[],n=P(XD(e.shift()).split(YD),function(t){return{name:t,data:[]};}),a=0;a<e.length;a++){var o=XD(e[a]).split(YD);i.push(o.shift());for(var r=0;r<o.length;r++){n[r]&&(n[r].data[a]=o[r]);}}return{series:n,categories:i};}(t),n=o[e],a=n.axisDim+"Axis";n&&(r[a]=r[a]||[],r[a][n.axisIndex]={data:i.categories},r.series=r.series.concat(i.series));}else{i=function(t){for(var e=t.split(/\n+/g),i=XD(e.shift()),n=[],a=0;a<e.length;a++){var o,r=XD(e[a]).split(YD),s="",l=!1;isNaN(r[0])?(l=!0,s=r[0],r=r.slice(1),n[a]={name:s,value:[]},o=n[a].value):o=n[a]=[];for(var h=0;h<r.length;h++){o.push(+r[h]);}1===o.length&&(l?n[a].value=o[0]:n[a]=o[0]);}return{name:i,data:n};}(t);r.series.push(i);}}),r;}function KD(t){this._dom=null,this.model=t;}KD.defaultOption={show:!0,readOnly:!1,optionToContent:null,contentToOption:null,icon:"M17.5,17.3H33 M17.5,17.3H33 M45.4,29.5h-28 M11.5,2v56H51V14.8L38.4,2H11.5z M38.4,2.2v12.7H51 M45.4,41.7h-28",title:A(HD.title),lang:A(HD.lang),backgroundColor:"#fff",textColor:"#000",textareaColor:"#fff",textareaBorderColor:"#333",buttonColor:"#c23531",buttonTextColor:"#fff"},KD.prototype.onclick=function(t,e){var i=e.getDom(),n=this.model;this._dom&&i.removeChild(this._dom);var a=document.createElement("div");a.style.cssText="position:absolute;left:5px;top:5px;bottom:5px;right:5px;",a.style.backgroundColor=n.get("backgroundColor")||"#fff";var o=document.createElement("h4"),r=n.get("lang")||[];o.innerHTML=r[0]||n.get("title"),o.style.cssText="margin: 10px 20px;",o.style.color=n.get("textColor");var s=document.createElement("div"),l=document.createElement("textarea");s.style.cssText="display:block;width:100%;overflow:auto;";var h=n.get("optionToContent"),u=n.get("contentToOption"),c=jD(t);if("function"==typeof h){var d=h(e.getOption());"string"==typeof d?s.innerHTML=d:V(d)&&s.appendChild(d);}else s.appendChild(l),l.readOnly=n.get("readOnly"),l.style.cssText="width:100%;height:100%;font-family:monospace;font-size:14px;line-height:1.6rem;",l.style.color=n.get("textColor"),l.style.borderColor=n.get("textareaBorderColor"),l.style.backgroundColor=n.get("textareaColor"),l.value=c.value;var f=c.meta,p=document.createElement("div");p.style.cssText="position:absolute;bottom:0;left:0;right:0;";var g="float:right;margin-right:20px;border:none;cursor:pointer;padding:2px 5px;font-size:12px;border-radius:3px",m=document.createElement("div"),v=document.createElement("div");g+=";background-color:"+n.get("buttonColor"),g+=";color:"+n.get("buttonTextColor");var y=this;function x(){i.removeChild(a),y._dom=null;}kn(m,"click",x),kn(v,"click",function(){var t;try{t="function"==typeof u?u(s,e.getOption()):qD(l.value,f);}catch(t){throw x(),new Error("Data view format error "+t);}t&&e.dispatchAction({type:"changeDataView",newOption:t}),x();}),m.innerHTML=r[1],v.innerHTML=r[2],v.style.cssText=g,m.style.cssText=g,!n.get("readOnly")&&p.appendChild(v),p.appendChild(m),kn(l,"keydown",function(t){if(9===(t.keyCode||t.which)){var e=this.value,i=this.selectionStart,n=this.selectionEnd;this.value=e.substring(0,i)+UD+e.substring(n),this.selectionStart=this.selectionEnd=i+1,Pn(t);}}),a.appendChild(o),a.appendChild(s),a.appendChild(p),s.style.height=i.clientHeight-80+"px",i.appendChild(a),this._dom=a;},KD.prototype.remove=function(t,e){this._dom&&e.getDom().removeChild(this._dom);},KD.prototype.dispose=function(t,e){this.remove(t,e);},bI("dataView",KD),Hc({type:"changeDataView",event:"dataViewChanged",update:"prepareAndUpdate"},function(t,o){var r=[];z(t.newOption.series,function(t){var e,n,i=o.getSeriesByName(t.name)[0];if(i){var a=i.get("data");r.push({name:t.name,data:(e=t.data,n=a,P(e,function(t,e){var i=n&&n[e];return R(i)&&!E(i)?(R(t)&&!E(t)&&(t=t.value),C({value:t},i)):t;}))});}else r.push(k({type:"scatter"},t));}),o.mergeOption(C({series:r},t.newOption));});var $D=z,JD="\0_ec_hist_store";function QD(t){var e=t[JD];return e||(e=t[JD]=[{}]),e;}jI.extend({type:"dataZoom.select"}),qI.extend({type:"dataZoom.select"});var tA=_u.toolbox.dataZoom,eA=z,iA="\0_ec_\0toolbox-dataZoom_";function nA(t,e,i){(this._brushController=new Fx(i.getZr())).on("brush",S(this._onBrush,this)).mount(),this._isZoomActive;}nA.defaultOption={show:!0,icon:{zoom:"M0,13.5h26.9 M13.5,26.9V0 M32.1,13.5H58V58H13.5 V32.1",back:"M22,1.4L9.9,13.5l12.3,12.3 M10.3,13.5H54.9v44.6 H10.3v-26"},title:A(tA.title)};var aA=nA.prototype;aA.render=function(t,e,i,n){var a;(function(t,e,i,n,a){var o=i._isZoomActive;n&&"takeGlobalCursor"===n.type&&(o="dataZoomSelect"===n.key&&n.dataZoomSelectActive);i._isZoomActive=o,t.setIconStatus("zoom",o?"emphasis":"normal");var r=new $M(rA(t.option),e,{include:["grid"]});i._brushController.setPanels(r.makePanelOpts(a,function(t){return t.xAxisDeclared&&!t.yAxisDeclared?"lineX":!t.xAxisDeclared&&t.yAxisDeclared?"lineY":"rect";})).enableBrush(!!o&&{brushType:"auto",brushStyle:{lineWidth:0,fill:"rgba(0,0,0,0.2)"}});})(this.model=t,this.ecModel=e,this,n,this.api=i),a=e,t.setIconStatus("back",1<QD(a).length?"emphasis":"normal");},aA.onclick=function(t,e,i){oA[i].call(this);},aA.remove=function(t,e){this._brushController.unmount();},aA.dispose=function(t,e){this._brushController.dispose();};var oA={zoom:function zoom(){var t=!this._isZoomActive;this.api.dispatchAction({type:"takeGlobalCursor",key:"dataZoomSelect",dataZoomSelectActive:t});},back:function back(){this._dispatchZoomAction(function(t){var n=QD(t),e=n[n.length-1];1<n.length&&n.pop();var a={};return $D(e,function(t,e){for(var i=n.length-1;0<=i;i--){if(t=n[i][e]){a[e]=t;break;}}}),a;}(this.ecModel));}};function rA(e){var i={};return z(["xAxisIndex","yAxisIndex"],function(t){i[t]=e[t],null==i[t]&&(i[t]="all"),(!1===i[t]||"none"===i[t])&&(i[t]=[]);}),i;}aA._onBrush=function(t,e){if(e.isEnd&&t.length){var o,i,r,u={},c=this.ecModel;this._brushController.updateCovers([]),new $M(rA(this.model.option),c,{include:["grid"]}).matchOutputRanges(t,c,function(t,e,i){if("cartesian2d"===i.type){var n=t.brushType;"rect"===n?(a("x",i,e[0]),a("y",i,e[1])):a({lineX:"x",lineY:"y"}[n],i,e);}}),i=u,r=QD(o=c),$D(i,function(t,e){for(var i=r.length-1;0<=i&&!r[i][e];i--){}if(i<0){var n=o.queryComponents({mainType:"dataZoom",subType:"select",id:e})[0];if(n){var a=n.getPercentRange();r[0][e]={dataZoomId:e,start:a[0],end:a[1]};}}}),r.push(i),this._dispatchZoomAction(u);}function a(t,e,i){var n,a,o,r=e.getAxis(t),s=r.model,l=(n=t,a=s,c.eachComponent({mainType:"dataZoom",subType:"select"},function(t){t.getAxisModel(n,a.componentIndex)&&(o=t);}),o),h=l.findRepresentativeAxisProxy(s).getMinMaxSpan();null==h.minValueSpan&&null==h.maxValueSpan||(i=px(0,i.slice(),r.scale.getExtent(),0,h.minValueSpan,h.maxValueSpan)),l&&(u[l.id]={dataZoomId:l.id,startValue:i[0],endValue:i[1]});}},aA._dispatchZoomAction=function(t){var i=[];eA(t,function(t,e){i.push(A(t));}),i.length&&this.api.dispatchAction({type:"dataZoom",from:this.uid,batch:i});},bI("dataZoom",nA),Wc(function(r){if(r){var s=r.dataZoom||(r.dataZoom=[]);E(s)||(r.dataZoom=s=[s]);var t=r.toolbox;if(t&&(E(t)&&(t=t[0]),t&&t.feature)){var e=t.feature.dataZoom;i("xAxis",e),i("yAxis",e);}}function i(n,t){if(t){var a=n+"Index",o=t[a];null==o||"all"==o||E(o)||(o=!1===o||"none"===o?[]:[o]),function(t,e){var i=r[t];E(i)||(i=i?[i]:[]);eA(i,e);}(n,function(t,e){if(null==o||"all"==o||-1!==L(o,e)){var i={type:"select",$fromToolbox:!0,id:iA+n+e};i[a]=e,s.push(i);}});}}});var sA=_u.toolbox.restore;function lA(t){this.model=t;}lA.defaultOption={show:!0,icon:"M3.8,33.4 M47,18.9h9.8V8.7 M56.3,20.1 C52.1,9,40.5,0.6,26.8,2.1C12.6,3.7,1.6,16.2,2.1,30.6 M13,41.1H3.1v10.2 M3.7,39.9c4.2,11.1,15.8,19.5,29.5,18 c14.2-1.6,25.2-14.1,24.7-28.5",title:sA.title},lA.prototype.onclick=function(t,e,i){t[JD]=null,e.dispatchAction({type:"restore",from:this.uid});},bI("restore",lA),Hc({type:"restore",event:"restore",update:"prepareAndUpdate"},function(t,e){e.resetOption("recreate");});var hA,uA="urn:schemas-microsoft-com:vml",cA="undefined"==typeof window?null:window,dA=!1,fA=cA&&cA.document;function pA(t){return hA(t);}if(fA&&!v.canvasSupported)try{!fA.namespaces.zrvml&&fA.namespaces.add("zrvml",uA),hA=function hA(t){return fA.createElement("<zrvml:"+t+' class="zrvml">');};}catch(t){hA=function hA(t){return fA.createElement("<"+t+' xmlns="'+uA+'" class="zrvml">');};}var gA,mA=To.CMD,vA=Math.round,yA=Math.sqrt,xA=Math.abs,_A=Math.cos,wA=Math.sin,bA=Math.max;if(!v.canvasSupported){var SA=",",MA="progid:DXImageTransform.Microsoft",IA=21600,TA=IA/2,DA=function DA(t){t.style.cssText="position:absolute;left:0;top:0;width:1px;height:1px;",t.coordsize=IA+","+IA,t.coordorigin="0,0";},AA=function AA(t,e,i){return"rgb("+[t,e,i].join(",")+")";},CA=function CA(t,e){e&&t&&e.parentNode!==t&&t.appendChild(e);},LA=function LA(t,e){e&&t&&e.parentNode===t&&t.removeChild(e);},kA=function kA(t,e,i){return 1e5*(parseFloat(t)||0)+1e3*(parseFloat(e)||0)+i;},PA=function PA(t,e){return"string"==typeof t?0<=t.lastIndexOf("%")?parseFloat(t)/100*e:parseFloat(t):t;},NA=function NA(t,e,i){var n=me(e);i=+i,isNaN(i)&&(i=1),n&&(t.color=AA(n[0],n[1],n[2]),t.opacity=i*n[3]);},OA=function OA(t,e,i,n){var a,o,r="fill"==e,s=t.getElementsByTagName(e)[0];null!=i[e]&&"none"!==i[e]&&(r||!r&&i.lineWidth)?(t[r?"filled":"stroked"]="true",i[e]instanceof Ar&&LA(t,s),s||(s=pA(e)),r?function(t,e,i){var n,a,o=e.fill;if(null!=o)if(o instanceof Ar){var r,s=0,l=[0,0],h=0,u=1,c=i.getBoundingRect(),d=c.width,f=c.height;if("linear"===o.type){r="gradient";var p=i.transform,g=[o.x*d,o.y*f],m=[o.x2*d,o.y2*f];p&&(wt(g,g,p),wt(m,m,p));var v=m[0]-g[0],y=m[1]-g[1];(s=180*Math.atan2(v,y)/Math.PI)<0&&(s+=360),s<1e-6&&(s=0);}else{r="gradientradial",g=[o.x*d,o.y*f],p=i.transform;var x=i.scale,_=d,w=f;l=[(g[0]-c.x)/_,(g[1]-c.y)/w],p&&wt(g,g,p),_/=x[0]*IA,w/=x[1]*IA;var b=bA(_,w);h=0/b,u=2*o.r/b-h;}var S=o.colorStops.slice();S.sort(function(t,e){return t.offset-e.offset;});for(var M=S.length,I=[],T=[],D=0;D<M;D++){var A=S[D],C=(n=A.color,a=me(n),[AA(a[0],a[1],a[2]),a[3]]);T.push(A.offset*u+h+" "+C[0]),0!==D&&D!==M-1||I.push(C);}if(2<=M){var L=I[0][0],k=I[1][0],P=I[0][1]*e.opacity,N=I[1][1]*e.opacity;t.type=r,t.method="none",t.focus="100%",t.angle=s,t.color=L,t.color2=k,t.colors=T.join(","),t.opacity=N,t.opacity2=P;}"radial"===r&&(t.focusposition=l.join(","));}else NA(t,o,e.opacity);}(s,i,n):(a=s,null!=(o=i).lineDash&&(a.dashstyle=o.lineDash.join(" ")),null==o.stroke||o.stroke instanceof Ar||NA(a,o.stroke,o.opacity)),CA(t,s)):(t[r?"filled":"stroked"]="false",LA(t,s));},EA=[[],[],[]];Xo.prototype.brushVML=function(t){var e=this.style,i=this._vmlEl;i||(i=pA("shape"),DA(i),this._vmlEl=i),OA(i,"fill",e,this),OA(i,"stroke",e,this);var n=this.transform,a=null!=n,o=i.getElementsByTagName("stroke")[0];if(o){var r=e.lineWidth;if(a&&!e.strokeNoScale){var s=n[0]*n[3]-n[1]*n[2];r*=yA(xA(s));}o.weight=r+"px";}var l=this.path||(this.path=new To());this.__dirtyPath&&(l.beginPath(),this.buildPath(l,this.shape),l.toStatic(),this.__dirtyPath=!1),i.path=function(t,e){var i,n,a,o,r,s,l=mA.M,h=mA.C,u=mA.L,c=mA.A,d=mA.Q,f=[],p=t.data,g=t.len();for(o=0;o<g;){switch(n="",i=0,a=p[o++]){case l:n=" m ",i=1,r=p[o++],s=p[o++],EA[0][0]=r,EA[0][1]=s;break;case u:n=" l ",i=1,r=p[o++],s=p[o++],EA[0][0]=r,EA[0][1]=s;break;case d:case h:n=" c ",i=3;var m,v,y=p[o++],x=p[o++],_=p[o++],w=p[o++];a===d?(_=((m=_)+2*y)/3,w=((v=w)+2*x)/3,y=(r+2*y)/3,x=(s+2*x)/3):(m=p[o++],v=p[o++]),EA[0][0]=y,EA[0][1]=x,EA[1][0]=_,EA[1][1]=w,r=EA[2][0]=m,s=EA[2][1]=v;break;case c:var b=0,S=0,M=1,I=1,T=0;e&&(b=e[4],S=e[5],M=yA(e[0]*e[0]+e[1]*e[1]),I=yA(e[2]*e[2]+e[3]*e[3]),T=Math.atan2(-e[1]/I,e[0]/M));var D=p[o++],A=p[o++],C=p[o++],L=p[o++],k=p[o++]+T,P=p[o++]+k+T;o++;var N=p[o++],O=D+_A(k)*C,E=A+wA(k)*L,R=(y=D+_A(P)*C,x=A+wA(P)*L,N?" wa ":" at ");Math.abs(O-y)<1e-4&&(.01<Math.abs(P-k)?N&&(O+=.0125):Math.abs(E-A)<1e-4?N&&O<D||!N&&D<O?x-=.0125:x+=.0125:N&&E<A||!N&&A<E?y+=.0125:y-=.0125),f.push(R,vA(((D-C)*M+b)*IA-TA),SA,vA(((A-L)*I+S)*IA-TA),SA,vA(((D+C)*M+b)*IA-TA),SA,vA(((A+L)*I+S)*IA-TA),SA,vA((O*M+b)*IA-TA),SA,vA((E*I+S)*IA-TA),SA,vA((y*M+b)*IA-TA),SA,vA((x*I+S)*IA-TA)),r=y,s=x;break;case mA.R:var z=EA[0],B=EA[1];z[0]=p[o++],z[1]=p[o++],B[0]=z[0]+p[o++],B[1]=z[1]+p[o++],e&&(wt(z,z,e),wt(B,B,e)),z[0]=vA(z[0]*IA-TA),B[0]=vA(B[0]*IA-TA),z[1]=vA(z[1]*IA-TA),B[1]=vA(B[1]*IA-TA),f.push(" m ",z[0],SA,z[1]," l ",B[0],SA,z[1]," l ",B[0],SA,B[1]," l ",z[0],SA,B[1]);break;case mA.Z:f.push(" x ");}if(0<i){f.push(n);for(var V=0;V<i;V++){var G=EA[V];e&&wt(G,G,e),f.push(vA(G[0]*IA-TA),SA,vA(G[1]*IA-TA),V<i-1?SA:"");}}}return f.join("");}(l,this.transform),i.style.zIndex=kA(this.zlevel,this.z,this.z2),CA(t,i),null!=e.text?this.drawRectText(t,this.getBoundingRect()):this.removeRectText(t);},Xo.prototype.onRemove=function(t){LA(t,this._vmlEl),this.removeRectText(t);},Xo.prototype.onAdd=function(t){CA(t,this._vmlEl),this.appendRectText(t);};_n.prototype.brushVML=function(t){var e,i,n,a=this.style,o=a.image;if("object"==_typeof(n=o)&&n.tagName&&"IMG"===n.tagName.toUpperCase()){var r=o.src;if(r===this._imageSrc)e=this._imageWidth,i=this._imageHeight;else{var s=o.runtimeStyle,l=s.width,h=s.height;s.width="auto",s.height="auto",e=o.width,i=o.height,s.width=l,s.height=h,this._imageSrc=r,this._imageWidth=e,this._imageHeight=i;}o=r;}else o===this._imageSrc&&(e=this._imageWidth,i=this._imageHeight);if(o){var u=a.x||0,c=a.y||0,d=a.width,f=a.height,p=a.sWidth,g=a.sHeight,m=a.sx||0,v=a.sy||0,y=p&&g,x=this._vmlEl;x||(x=fA.createElement("div"),DA(x),this._vmlEl=x);var _,w=x.style,b=!1,S=1,M=1;if(this.transform&&(_=this.transform,S=yA(_[0]*_[0]+_[1]*_[1]),M=yA(_[2]*_[2]+_[3]*_[3]),b=_[1]||_[2]),b){var I=[u,c],T=[u+d,c],D=[u,c+f],A=[u+d,c+f];wt(I,I,_),wt(T,T,_),wt(D,D,_),wt(A,A,_);var C=bA(I[0],T[0],D[0],A[0]),L=bA(I[1],T[1],D[1],A[1]),k=[];k.push("M11=",_[0]/S,SA,"M12=",_[2]/M,SA,"M21=",_[1]/S,SA,"M22=",_[3]/M,SA,"Dx=",vA(u*S+_[4]),SA,"Dy=",vA(c*M+_[5])),w.padding="0 "+vA(C)+"px "+vA(L)+"px 0",w.filter=MA+".Matrix("+k.join("")+", SizingMethod=clip)";}else _&&(u=u*S+_[4],c=c*M+_[5]),w.filter="",w.left=vA(u)+"px",w.top=vA(c)+"px";var P=this._imageEl,N=this._cropEl;P||(P=fA.createElement("div"),this._imageEl=P);var O=P.style;if(y){if(e&&i)O.width=vA(S*e*d/p)+"px",O.height=vA(M*i*f/g)+"px";else{var E=new Image(),R=this;E.onload=function(){E.onload=null,e=E.width,i=E.height,O.width=vA(S*e*d/p)+"px",O.height=vA(M*i*f/g)+"px",R._imageWidth=e,R._imageHeight=i,R._imageSrc=o;},E.src=o;}N||((N=fA.createElement("div")).style.overflow="hidden",this._cropEl=N);var z=N.style;z.width=vA((d+m*d/p)*S),z.height=vA((f+v*f/g)*M),z.filter=MA+".Matrix(Dx="+-m*d/p*S+",Dy="+-v*f/g*M+")",N.parentNode||x.appendChild(N),P.parentNode!=N&&N.appendChild(P);}else O.width=vA(S*d)+"px",O.height=vA(M*f)+"px",x.appendChild(P),N&&N.parentNode&&(x.removeChild(N),this._cropEl=null);var B="",V=a.opacity;V<1&&(B+=".Alpha(opacity="+vA(100*V)+") "),B+=MA+".AlphaImageLoader(src="+o+", SizingMethod=scale)",O.filter=B,x.style.zIndex=kA(this.zlevel,this.z,this.z2),CA(t,x),null!=a.text&&this.drawRectText(t,this.getBoundingRect());}},_n.prototype.onRemove=function(t){LA(t,this._vmlEl),this._vmlEl=null,this._cropEl=null,this._imageEl=null,this.removeRectText(t);},_n.prototype.onAdd=function(t){CA(t,this._vmlEl),this.appendRectText(t);};var RA,zA="normal",BA={},VA=0,GA=document.createElement("div");gA=function gA(t,e){var i=fA;RA||((RA=i.createElement("div")).style.cssText="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;",fA.body.appendChild(RA));try{RA.style.font=e;}catch(t){}return RA.innerHTML="",RA.appendChild(i.createTextNode(t)),{width:RA.offsetWidth};},zi["measureText"]=gA;for(var WA=new ei(),FA=function FA(t,e,i,n){var a=this.style;this.__dirty&&en(a);var o=a.text;if(null!=o&&(o+=""),o){if(a.rich){var r=qi(o,a);o=[];for(var s=0;s<r.lines.length;s++){for(var l=r.lines[s].tokens,h=[],u=0;u<l.length;u++){h.push(l[u].text);}o.push(h.join(""));}o=o.join("\n");}var c,d,f=a.textAlign,p=a.textVerticalAlign,g=function(t){var e=BA[t];if(!e){100<VA&&(VA=0,BA={});var i,n=GA.style;try{n.font=t,i=n.fontFamily.split(",")[0];}catch(t){}e={style:n.fontStyle||zA,variant:n.fontVariant||zA,weight:n.fontWeight||zA,size:0|parseFloat(n.fontSize||12),family:i||"Microsoft YaHei"},BA[t]=e,VA++;}return e;}(a.font),m=g.style+" "+g.variant+" "+g.weight+" "+g.size+'px "'+g.family+'"';i=i||Vi(o,m,f,p);var v=this.transform;if(v&&!n&&(WA.copy(e),WA.applyTransform(v),e=WA),n)c=e.x,d=e.y;else{var y=a.textPosition,x=a.textDistance;if(y instanceof Array)c=e.x+PA(y[0],e.width),d=e.y+PA(y[1],e.height),f=f||"left";else{var _=Fi(y,e,x);c=_.x,d=_.y,f=f||_.textAlign,p=p||_.textVerticalAlign;}}c=Gi(c,i.width,f),d=Wi(d,i.height,p),d+=i.height/2;var w,b,S,M=pA,I=this._textVmlEl;I?b=(w=(S=I.firstChild).nextSibling).nextSibling:(I=M("line"),w=M("path"),b=M("textpath"),S=M("skew"),b.style["v-text-align"]="left",DA(I),w.textpathok=!0,b.on=!0,I.from="0 0",I.to="1000 0.05",CA(I,S),CA(I,w),CA(I,b),this._textVmlEl=I);var T=[c,d],D=I.style;v&&n?(wt(T,T,v),S.on=!0,S.matrix=v[0].toFixed(3)+SA+v[2].toFixed(3)+SA+v[1].toFixed(3)+SA+v[3].toFixed(3)+",0,0",S.offset=(vA(T[0])||0)+","+(vA(T[1])||0),S.origin="0 0",D.left="0px",D.top="0px"):(S.on=!1,D.left=vA(c)+"px",D.top=vA(d)+"px"),b.string=String(o).replace(/&/g,"&amp;").replace(/"/g,"&quot;");try{b.style.font=m;}catch(t){}OA(I,"fill",{fill:a.textFill,opacity:a.opacity},this),OA(I,"stroke",{stroke:a.textStroke,opacity:a.opacity,lineDash:a.lineDash},this),I.style.zIndex=kA(this.zlevel,this.z,this.z2),CA(t,I);}},HA=function HA(t){LA(t,this._textVmlEl),this._textVmlEl=null;},ZA=function ZA(t){CA(t,this._textVmlEl);},UA=[yn,xn,_n,Xo,hr],jA=0;jA<UA.length;jA++){var XA=UA[jA].prototype;XA.drawRectText=FA,XA.removeRectText=HA,XA.appendRectText=ZA;}hr.prototype.brushVML=function(t){var e=this.style;null!=e.text?this.drawRectText(t,{x:e.x||0,y:e.y||0,width:0,height:0},this.getBoundingRect(),!0):this.removeRectText(t);},hr.prototype.onRemove=function(t){this.removeRectText(t);},hr.prototype.onAdd=function(t){this.appendRectText(t);};}function YA(t){return parseInt(t,10);}function qA(t,e){!function(){if(!dA&&fA){dA=!0;var t=fA.styleSheets;t.length<31?fA.createStyleSheet().addRule(".zrvml","behavior:url(#default#VML)"):t[0].addRule(".zrvml","behavior:url(#default#VML)");}}(),this.root=t,this.storage=e;var i=document.createElement("div"),n=document.createElement("div");i.style.cssText="display:inline-block;overflow:hidden;position:relative;width:300px;height:150px;",n.style.cssText="position:absolute;left:0;top:0;",t.appendChild(i),this._vmlRoot=n,this._vmlViewport=i,this.resize();var a=e.delFromStorage,o=e.addToStorage;e.delFromStorage=function(t){a.call(e,t),t&&t.onRemove&&t.onRemove(n);},e.addToStorage=function(t){t.onAdd&&t.onAdd(n),o.call(e,t);},this._firstPaint=!0;}qA.prototype={constructor:qA,getType:function getType(){return"vml";},getViewportRoot:function getViewportRoot(){return this._vmlViewport;},getViewportRootOffset:function getViewportRootOffset(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0};},refresh:function refresh(){var t=this.storage.getDisplayList(!0,!0);this._paintList(t);},_paintList:function _paintList(t){for(var e=this._vmlRoot,i=0;i<t.length;i++){var n=t[i];n.invisible||n.ignore?(n.__alreadyNotVisible||n.onRemove(e),n.__alreadyNotVisible=!0):(n.__alreadyNotVisible&&n.onAdd(e),n.__alreadyNotVisible=!1,n.__dirty&&(n.beforeBrush&&n.beforeBrush(),(n.brushVML||n.brush).call(n,e),n.afterBrush&&n.afterBrush())),n.__dirty=!1;}this._firstPaint&&(this._vmlViewport.appendChild(e),this._firstPaint=!1);},resize:function resize(t,e){t=null==t?this._getWidth():t,e=null==e?this._getHeight():e;if(this._width!=t||this._height!=e){this._width=t,this._height=e;var i=this._vmlViewport.style;i.width=t+"px",i.height=e+"px";}},dispose:function dispose(){this.root.innerHTML="",this._vmlRoot=this._vmlViewport=this.storage=null;},getWidth:function getWidth(){return this._width;},getHeight:function getHeight(){return this._height;},clear:function clear(){this._vmlViewport&&this.root.removeChild(this._vmlViewport);},_getWidth:function _getWidth(){var t=this.root,e=t.currentStyle;return(t.clientWidth||YA(e.width))-YA(e.paddingLeft)-YA(e.paddingRight)|0;},_getHeight:function _getHeight(){var t=this.root,e=t.currentStyle;return(t.clientHeight||YA(e.height))-YA(e.paddingTop)-YA(e.paddingBottom)|0;}},z(["getLayer","insertLayer","eachLayer","eachBuiltinLayer","eachOtherLayer","getLayers","modLayer","delLayer","clearLayer","toDataURL","pathToImage"],function(t){var e;qA.prototype[t]=(e=t,function(){Ue('In IE8.0 VML mode painter not support method "'+e+'"');});}),Qn("vml",qA);var KA="http://www.w3.org/2000/svg";function $A(t){return document.createElementNS(KA,t);}var JA=To.CMD,QA=Array.prototype.join,tC="none",eC=Math.round,iC=Math.sin,nC=Math.cos,aC=Math.PI,oC=2*Math.PI,rC=180/aC,sC=1e-4;function lC(t){return eC(1e4*t)/1e4;}function hC(t){return t<sC&&-sC<t;}function uC(t,e){e&&cC(t,"transform","matrix("+QA.call(e,",")+")");}function cC(t,e,i){(!i||"linear"!==i.type&&"radial"!==i.type)&&t.setAttribute(e,i);}function dC(t,e,i){if(a=e,null!=(o=i?a.textFill:a.fill)&&o!==tC){var n=i?e.textFill:e.fill;n="transparent"===n?tC:n,"none"!==t.getAttribute("clip-path")&&n===tC&&(n="rgba(0, 0, 0, 0.002)"),cC(t,"fill",n),cC(t,"fill-opacity",e.opacity);}else cC(t,"fill",tC);var a,o,r,s;if(r=e,null!=(s=i?r.textStroke:r.stroke)&&s!==tC){var l=i?e.textStroke:e.stroke;cC(t,"stroke",l="transparent"===l?tC:l),cC(t,"stroke-width",(i?e.textStrokeWidth:e.lineWidth)/(!i&&e.strokeNoScale?e.host.getLineScale():1)),cC(t,"paint-order",i?"stroke":"fill"),cC(t,"stroke-opacity",e.opacity),e.lineDash?(cC(t,"stroke-dasharray",e.lineDash.join(",")),cC(t,"stroke-dashoffset",eC(e.lineDashOffset||0))):cC(t,"stroke-dasharray",""),e.lineCap&&cC(t,"stroke-linecap",e.lineCap),e.lineJoin&&cC(t,"stroke-linejoin",e.lineJoin),e.miterLimit&&cC(t,"stroke-miterlimit",e.miterLimit);}else cC(t,"stroke",tC);}var fC={};fC.brush=function(t){var e=t.style,i=t.__svgEl;i||(i=$A("path"),t.__svgEl=i),t.path||t.createPathProxy();var n=t.path;if(t.__dirtyPath){n.beginPath(),t.buildPath(n,t.shape),t.__dirtyPath=!1;var a=function(t){for(var e=[],i=t.data,n=t.len(),a=0;a<n;){var o="",r=0;switch(i[a++]){case JA.M:o="M",r=2;break;case JA.L:o="L",r=2;break;case JA.Q:o="Q",r=4;break;case JA.C:o="C",r=6;break;case JA.A:var s=i[a++],l=i[a++],h=i[a++],u=i[a++],c=i[a++],d=i[a++],f=i[a++],p=i[a++],g=Math.abs(d),m=hC(g-oC)&&!hC(g),v=!1;v=oC<=g||!hC(g)&&(-aC<d&&d<0||aC<d)==!!p;var y=lC(s+h*nC(c)),x=lC(l+u*iC(c));m&&(d=p?oC-1e-4:1e-4-oC,v=!0,9===a&&e.push("M",y,x));var _=lC(s+h*nC(c+d)),w=lC(l+u*iC(c+d));e.push("A",lC(h),lC(u),eC(f*rC),+v,+p,_,w);break;case JA.Z:o="Z";break;case JA.R:_=lC(i[a++]),w=lC(i[a++]);var b=lC(i[a++]),S=lC(i[a++]);e.push("M",_,w,"L",_+b,w,"L",_+b,w+S,"L",_,w+S,"L",_,w);}o&&e.push(o);for(var M=0;M<r;M++){e.push(lC(i[a++]));}}return e.join(" ");}(n);a.indexOf("NaN")<0&&cC(i,"d",a);}dC(i,e),uC(i,t.transform),null!=e.text&&vC(t,t.getBoundingRect());};var pC={brush:function brush(t){var e=t.style,i=e.image;i instanceof HTMLImageElement&&(i=i.src);if(i){var n,a,o=e.x||0,r=e.y||0,s=e.width,l=e.height,h=t.__svgEl;h||(h=$A("image"),t.__svgEl=h),i!==t.__imageSrc&&(n="href",a=i,h.setAttributeNS("http://www.w3.org/1999/xlink",n,a),t.__imageSrc=i),cC(h,"width",s),cC(h,"height",l),cC(h,"x",o),cC(h,"y",r),uC(h,t.transform),null!=e.text&&vC(t,t.getBoundingRect());}}},gC={},mC=new ei(),vC=function vC(t,e,i){var n=t.style;t.__dirty&&en(n);var a=n.text;if(null!=a){a+="";var o,r,s=t.__textSvgEl;s||(s=$A("text"),t.__textSvgEl=s);var l=n.textPosition,h=n.textDistance,u=n.textAlign||"left";"number"==typeof n.fontSize&&(n.fontSize+="px");var c=n.font||[n.fontStyle||"",n.fontWeight||"",n.fontSize||"",n.fontFamily||""].join(" ")||Ri,d=yC(n.textVerticalAlign),f=(i=Vi(a,c,u,d)).lineHeight;if(l instanceof Array)o=e.x+l[0],r=e.y+l[1];else{var p=Fi(l,e,h);o=p.x,r=p.y,d=yC(p.textVerticalAlign),u=p.textAlign;}cC(s,"alignment-baseline",d),c&&(s.style.font=c);var g=n.textPadding;if(cC(s,"x",o),cC(s,"y",r),dC(s,n,!0),t instanceof hr||t.style.transformText)uC(s,t.transform);else{if(t.transform)mC.copy(e),mC.applyTransform(t.transform),e=mC;else{var m=t.transformCoordToGlobal(e.x,e.y);e.x=m[0],e.y=m[1];}var v=n.textOrigin;"center"===v?(o=i.width/2+o,r=i.height/2+r):v&&(o=v[0]+o,r=v[1]+r),cC(s,"transform","rotate("+180*-n.textRotation/Math.PI+","+o+","+r+")");}var y=a.split("\n"),x=y.length,_=u;"left"===_?(_="start",g&&(o+=g[3])):"right"===_?(_="end",g&&(o-=g[1])):"center"===_&&(_="middle",g&&(o+=(g[3]-g[1])/2));var w=0;if("baseline"===d?(w=-i.height+f,g&&(w-=g[2])):"middle"===d?(w=(-i.height+f)/2,g&&(r+=(g[0]-g[2])/2)):g&&(w+=g[0]),t.__text!==a||t.__textFont!==c){var b=t.__tspanList||[];t.__tspanList=b;for(var S=0;S<x;S++){(I=b[S])?I.innerHTML="":(I=b[S]=$A("tspan"),s.appendChild(I),cC(I,"alignment-baseline",d),cC(I,"text-anchor",_)),cC(I,"x",o),cC(I,"y",r+S*f+w),I.appendChild(document.createTextNode(y[S]));}for(;S<b.length;S++){s.removeChild(b[S]);}b.length=x,t.__text=a,t.__textFont=c;}else if(t.__tspanList.length){var M=t.__tspanList.length;for(S=0;S<M;++S){var I;(I=t.__tspanList[S])&&(cC(I,"x",o),cC(I,"y",r+S*f+w));}}}};function yC(t){return"middle"===t?"middle":"bottom"===t?"baseline":"hanging";}function xC(){}function _C(t,e,i,n){for(var a=0,o=e.length,r=0,s=0;a<o;a++){var l=e[a];if(l.removed){for(h=[],u=s;u<s+l.count;u++){h.push(u);}l.indices=h,s+=l.count;}else{for(var h=[],u=r;u<r+l.count;u++){h.push(u);}l.indices=h,r+=l.count,l.added||(s+=l.count);}}return e;}gC.drawRectText=vC,gC.brush=function(t){var e=t.style;null!=e.text&&(e.textPosition=[0,0],vC(t,{x:e.x||0,y:e.y||0,width:0,height:0},t.getBoundingRect()));},xC.prototype={diff:function diff(l,h,t){t||(t=function t(_t3,e){return _t3===e;}),this.equals=t;var u=this;l=l.slice();var c=(h=h.slice()).length,d=l.length,f=1,e=c+d,p=[{newPos:-1,components:[]}],i=this.extractCommon(p[0],h,l,0);if(p[0].newPos+1>=c&&d<=i+1){for(var n=[],a=0;a<h.length;a++){n.push(a);}return[{indices:n,count:h.length}];}function o(){for(var t=-1*f;t<=f;t+=2){var e,i=p[t-1],n=p[t+1],a=(n?n.newPos:0)-t;i&&(p[t-1]=void 0);var o=i&&i.newPos+1<c,r=n&&0<=a&&a<d;if(o||r){if(!o||r&&i.newPos<n.newPos?(e={newPos:(s=n).newPos,components:s.components.slice(0)},u.pushComponent(e.components,void 0,!0)):((e=i).newPos++,u.pushComponent(e.components,!0,void 0)),a=u.extractCommon(e,h,l,t),e.newPos+1>=c&&d<=a+1)return _C(u,e.components,h,l);p[t]=e;}else p[t]=void 0;}var s;f++;}for(;f<=e;){var r=o();if(r)return r;}},pushComponent:function pushComponent(t,e,i){var n=t[t.length-1];n&&n.added===e&&n.removed===i?t[t.length-1]={count:n.count+1,added:e,removed:i}:t.push({count:1,added:e,removed:i});},extractCommon:function extractCommon(t,e,i,n){for(var a=e.length,o=i.length,r=t.newPos,s=r-n,l=0;r+1<a&&s+1<o&&this.equals(e[r+1],i[s+1]);){r++,s++,l++;}return l&&t.components.push({count:l}),t.newPos=r,s;},tokenize:function tokenize(t){return t.slice();},join:function join(t){return t.slice();}};var wC=new xC();function bC(t,e,i,n,a){this._zrId=t,this._svgRoot=e,this._tagNames="string"==typeof i?[i]:i,this._markLabel=n,this._domName=a||"_dom",this.nextId=0;}function SC(t,e){bC.call(this,t,e,["linearGradient","radialGradient"],"__gradient_in_use__");}function MC(t,e){bC.call(this,t,e,"clipPath","__clippath_in_use__");}function IC(t,e){bC.call(this,t,e,["filter"],"__filter_in_use__","_shadowDom");}function TC(t){return t&&(t.shadowBlur||t.shadowOffsetX||t.shadowOffsetY||t.textShadowBlur||t.textShadowOffsetX||t.textShadowOffsetY);}function DC(t){return parseInt(t,10);}function AC(t,e){return e&&t&&e.parentNode!==t;}function CC(t,e,i){if(AC(t,e)&&i){var n=i.nextSibling;n?t.insertBefore(e,n):t.appendChild(e);}}function LC(t,e){if(AC(t,e)){var i=t.firstChild;i?t.insertBefore(e,i):t.appendChild(e);}}function kC(t,e){e&&t&&e.parentNode===t&&t.removeChild(e);}function PC(t){return t.__textSvgEl;}function NC(t){return t.__svgEl;}bC.prototype.createElement=$A,bC.prototype.getDefs=function(t){var e=this._svgRoot,n=this._svgRoot.getElementsByTagName("defs");return 0===n.length?t?((n=e.insertBefore(this.createElement("defs"),e.firstChild)).contains||(n.contains=function(t){var e=n.children;if(!e)return!1;for(var i=e.length-1;0<=i;--i){if(e[i]===t)return!0;}return!1;}),n):null:n[0];},bC.prototype.update=function(t,e){if(t){var i=this.getDefs(!1);if(t[this._domName]&&i.contains(t[this._domName]))"function"==typeof e&&e(t);else{var n=this.add(t);n&&(t[this._domName]=n);}}},bC.prototype.addDom=function(t){this.getDefs(!0).appendChild(t);},bC.prototype.removeDom=function(t){var e=this.getDefs(!1);e&&t[this._domName]&&(e.removeChild(t[this._domName]),t[this._domName]=null);},bC.prototype.getDoms=function(){var i=this.getDefs(!1);if(!i)return[];var n=[];return z(this._tagNames,function(t){var e=i.getElementsByTagName(t);n=n.concat([].slice.call(e));}),n;},bC.prototype.markAllUnused=function(){var t=this.getDoms(),e=this;z(t,function(t){t[e._markLabel]="0";});},bC.prototype.markUsed=function(t){t&&(t[this._markLabel]="1");},bC.prototype.removeUnused=function(){var e=this.getDefs(!1);if(e){var t=this.getDoms(),i=this;z(t,function(t){"1"!==t[i._markLabel]&&e.removeChild(t);});}},bC.prototype.getSvgProxy=function(t){return t instanceof Xo?fC:t instanceof _n?pC:t instanceof hr?gC:fC;},bC.prototype.getTextSvgElement=function(t){return t.__textSvgEl;},bC.prototype.getSvgElement=function(t){return t.__svgEl;},_(SC,bC),SC.prototype.addWithoutUpdate=function(o,r){if(r&&r.style){var s=this;z(["fill","stroke"],function(t){if(r.style[t]&&("linear"===r.style[t].type||"radial"===r.style[t].type)){var e,i=r.style[t],n=s.getDefs(!0);i._dom?(e=i._dom,n.contains(i._dom)||s.addDom(e)):e=s.add(i),s.markUsed(r);var a=e.getAttribute("id");o.setAttribute(t,"url(#"+a+")");}});}},SC.prototype.add=function(t){var e;if("linear"===t.type)e=this.createElement("linearGradient");else{if("radial"!==t.type)return Ue("Illegal gradient type."),null;e=this.createElement("radialGradient");}return t.id=t.id||this.nextId++,e.setAttribute("id","zr"+this._zrId+"-gradient-"+t.id),this.updateDom(t,e),this.addDom(e),e;},SC.prototype.update=function(i){var n=this;bC.prototype.update.call(this,i,function(){var t=i.type,e=i._dom.tagName;"linear"===t&&"linearGradient"===e||"radial"===t&&"radialGradient"===e?n.updateDom(i,i._dom):(n.removeDom(i),n.add(i));});},SC.prototype.updateDom=function(t,e){if("linear"===t.type)e.setAttribute("x1",t.x),e.setAttribute("y1",t.y),e.setAttribute("x2",t.x2),e.setAttribute("y2",t.y2);else{if("radial"!==t.type)return void Ue("Illegal gradient type.");e.setAttribute("cx",t.x),e.setAttribute("cy",t.y),e.setAttribute("r",t.r);}t.global?e.setAttribute("gradientUnits","userSpaceOnUse"):e.setAttribute("gradientUnits","objectBoundingBox"),e.innerHTML="";for(var i=t.colorStops,n=0,a=i.length;n<a;++n){var o=this.createElement("stop");o.setAttribute("offset",100*i[n].offset+"%"),o.setAttribute("stop-color",i[n].color),e.appendChild(o);}t._dom=e;},SC.prototype.markUsed=function(t){if(t.style){var e=t.style.fill;e&&e._dom&&bC.prototype.markUsed.call(this,e._dom),(e=t.style.stroke)&&e._dom&&bC.prototype.markUsed.call(this,e._dom);}},_(MC,bC),MC.prototype.update=function(t){var e=this.getSvgElement(t);e&&this.updateDom(e,t.__clipPaths,!1);var i=this.getTextSvgElement(t);i&&this.updateDom(i,t.__clipPaths,!0),this.markUsed(t);},MC.prototype.updateDom=function(t,e,i){if(e&&0<e.length){var n,a,o=this.getDefs(!0),r=e[0],s=i?"_textDom":"_dom";r[s]?(a=r[s].getAttribute("id"),n=r[s],o.contains(n)||o.appendChild(n)):(a="zr"+this._zrId+"-clip-"+this.nextId,++this.nextId,(n=this.createElement("clipPath")).setAttribute("id",a),o.appendChild(n),r[s]=n);var l=this.getSvgProxy(r);if(r.transform&&r.parent.invTransform&&!i){var h=Array.prototype.slice.call(r.transform);Bt(r.transform,r.parent.invTransform,r.transform),l.brush(r),r.transform=h;}else l.brush(r);var u=this.getSvgElement(r);n.innerHTML="",n.appendChild(u.cloneNode()),t.setAttribute("clip-path","url(#"+a+")"),1<e.length&&this.updateDom(n,e.slice(1),i);}else t&&t.setAttribute("clip-path","none");},MC.prototype.markUsed=function(t){var e=this;t.__clipPaths&&0<t.__clipPaths.length&&z(t.__clipPaths,function(t){t._dom&&bC.prototype.markUsed.call(e,t._dom),t._textDom&&bC.prototype.markUsed.call(e,t._textDom);});},_(IC,bC),IC.prototype.addWithoutUpdate=function(t,e){if(e&&TC(e.style)){var i,n=e.style;if(n._shadowDom)i=n._shadowDom,this.getDefs(!0).contains(n._shadowDom)||this.addDom(i);else i=this.add(e);this.markUsed(e);var a=i.getAttribute("id");t.style.filter="url(#"+a+")";}},IC.prototype.add=function(t){var e=this.createElement("filter"),i=t.style;return i._shadowDomId=i._shadowDomId||this.nextId++,e.setAttribute("id","zr"+this._zrId+"-shadow-"+i._shadowDomId),this.updateDom(t,e),this.addDom(e),e;},IC.prototype.update=function(t,e){var i=e.style;if(TC(i)){var n=this;bC.prototype.update.call(this,e,function(t){n.updateDom(e,t._shadowDom);});}else this.remove(t,i);},IC.prototype.remove=function(t,e){null!=e._shadowDomId&&(this.removeDom(e),t.style.filter="");},IC.prototype.updateDom=function(t,e){var i=e.getElementsByTagName("feDropShadow");i=0===i.length?this.createElement("feDropShadow"):i[0];var n,a,o,r,s=t.style,l=t.scale&&t.scale[0]||1,h=t.scale&&t.scale[1]||1;if(s.shadowBlur||s.shadowOffsetX||s.shadowOffsetY)n=s.shadowOffsetX||0,a=s.shadowOffsetY||0,o=s.shadowBlur,r=s.shadowColor;else{if(!s.textShadowBlur)return void this.removeDom(e,s);n=s.textShadowOffsetX||0,a=s.textShadowOffsetY||0,o=s.textShadowBlur,r=s.textShadowColor;}i.setAttribute("dx",n/l),i.setAttribute("dy",a/h),i.setAttribute("flood-color",r);var u=o/2/l+" "+o/2/h;i.setAttribute("stdDeviation",u),e.setAttribute("x","-100%"),e.setAttribute("y","-100%"),e.setAttribute("width",Math.ceil(o/2*200)+"%"),e.setAttribute("height",Math.ceil(o/2*200)+"%"),e.appendChild(i),s._shadowDom=e;},IC.prototype.markUsed=function(t){var e=t.style;e&&e._shadowDom&&bC.prototype.markUsed.call(this,e._shadowDom);};var OC=function OC(t,e,i,n){this.root=t,this.storage=e,this._opts=i=k({},i||{});var a=$A("svg");a.setAttribute("xmlns","http://www.w3.org/2000/svg"),a.setAttribute("version","1.1"),a.setAttribute("baseProfile","full"),a.style.cssText="user-select:none;position:absolute;left:0;top:0;",this.gradientManager=new SC(n,a),this.clipPathManager=new MC(n,a),this.shadowManager=new IC(n,a);var o=document.createElement("div");o.style.cssText="overflow:hidden;position:relative",this._svgRoot=a,this._viewport=o,t.appendChild(o),o.appendChild(a),this.resize(i.width,i.height),this._visibleList=[];};OC.prototype={constructor:OC,getType:function getType(){return"svg";},getViewportRoot:function getViewportRoot(){return this._viewport;},getViewportRootOffset:function getViewportRootOffset(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0};},refresh:function refresh(){var t=this.storage.getDisplayList(!0);this._paintList(t);},setBackgroundColor:function setBackgroundColor(t){this._viewport.style.background=t;},_paintList:function _paintList(t){this.gradientManager.markAllUnused(),this.clipPathManager.markAllUnused(),this.shadowManager.markAllUnused();var e,i,n=this._svgRoot,a=this._visibleList,o=t.length,r=[];for(e=0;e<o;e++){var s=t[e],l=(i=s)instanceof Xo?fC:i instanceof _n?pC:i instanceof hr?gC:fC,h=NC(s)||PC(s);s.invisible||(s.__dirty&&(l&&l.brush(s),this.clipPathManager.update(s),s.style&&(this.gradientManager.update(s.style.fill),this.gradientManager.update(s.style.stroke),this.shadowManager.update(h,s)),s.__dirty=!1),r.push(s));}var u,c,d,f,p=(u=a,c=r,wC.diff(u,c,d));for(e=0;e<p.length;e++){if((v=p[e]).removed)for(var g=0;g<v.count;g++){h=NC(s=a[v.indices[g]]);var m=PC(s);kC(n,h),kC(n,m);}}for(e=0;e<p.length;e++){var v;if((v=p[e]).added)for(g=0;g<v.count;g++){h=NC(s=r[v.indices[g]]),m=PC(s);f?CC(n,h,f):LC(n,h),h?CC(n,m,h):f?CC(n,m,f):LC(n,m),CC(n,m,h),f=m||h||f,this.gradientManager.addWithoutUpdate(h,s),this.shadowManager.addWithoutUpdate(f,s),this.clipPathManager.markUsed(s);}else if(!v.removed)for(g=0;g<v.count;g++){f=h=PC(s=r[v.indices[g]])||NC(s)||f,this.gradientManager.markUsed(s),this.gradientManager.addWithoutUpdate(h,s),this.shadowManager.markUsed(s),this.shadowManager.addWithoutUpdate(h,s),this.clipPathManager.markUsed(s);}}this.gradientManager.removeUnused(),this.clipPathManager.removeUnused(),this.shadowManager.removeUnused(),this._visibleList=r;},_getDefs:function _getDefs(t){var n,e=this._svgRoot;return 0===(n=this._svgRoot.getElementsByTagName("defs")).length?t?((n=e.insertBefore($A("defs"),e.firstChild)).contains||(n.contains=function(t){var e=n.children;if(!e)return!1;for(var i=e.length-1;0<=i;--i){if(e[i]===t)return!0;}return!1;}),n):null:n[0];},resize:function resize(t,e){var i=this._viewport;i.style.display="none";var n=this._opts;if(null!=t&&(n.width=t),null!=e&&(n.height=e),t=this._getSize(0),e=this._getSize(1),i.style.display="",this._width!==t||this._height!==e){this._width=t,this._height=e;var a=i.style;a.width=t+"px",a.height=e+"px";var o=this._svgRoot;o.setAttribute("width",t),o.setAttribute("height",e);}},getWidth:function getWidth(){return this._width;},getHeight:function getHeight(){return this._height;},_getSize:function _getSize(t){var e=this._opts,i=["width","height"][t],n=["clientWidth","clientHeight"][t],a=["paddingLeft","paddingTop"][t],o=["paddingRight","paddingBottom"][t];if(null!=e[i]&&"auto"!==e[i])return parseFloat(e[i]);var r=this.root,s=document.defaultView.getComputedStyle(r);return(r[n]||DC(s[i])||DC(r.style[i]))-(DC(s[a])||0)-(DC(s[o])||0)|0;},dispose:function dispose(){this.root.innerHTML="",this._svgRoot=this._viewport=this.storage=null;},clear:function clear(){this._viewport&&this.root.removeChild(this._viewport);},pathToDataUrl:function pathToDataUrl(){return this.refresh(),"data:image/svg+xml;charset=UTF-8,"+this._svgRoot.outerHTML;}},z(["getLayer","insertLayer","eachLayer","eachBuiltinLayer","eachOtherLayer","getLayers","modLayer","delLayer","clearLayer","toDataURL","pathToImage"],function(t){var e;OC.prototype[t]=(e=t,function(){Ue('In SVG mode painter not support method "'+e+'"');});}),Qn("svg",OC),t.version="4.0.4",t.dependencies={zrender:"4.0.3"},t.PRIORITY=tc,t.init=function(t,e,i){var n=Vc(t);if(n)return n;var a=new rc(t,e,i);return a.id="ec_"+Nc++,kc[a.id]=a,xa(t,Ec,a.id),function(n){var a="__connectUpdateStatus";function o(t,e){for(var i=0;i<t.length;i++){t[i][a]=e;}}Xu(Mc,function(t,e){n._messageCenter.on(e,function(t){if(Pc[n.group]&&0!==n[a]){if(t&&t.escapeConnect)return;var e=n.makeActionFromEvent(t),i=[];Xu(kc,function(t){t!==n&&t.group===n.group&&i.push(t);}),o(i,0),Xu(i,function(t){1!==t[a]&&t.dispatchAction(e);}),o(i,2);}});});}(a),a;},t.connect=function(e){if(E(e)){var t=e;e=null,Xu(t,function(t){null!=t.group&&(e=t.group);}),e=e||"g_"+Oc++,Xu(t,function(t){t.group=e;});}return Pc[e]=!0,e;},t.disConnect=zc,t.disconnect=Bc,t.dispose=function(t){"string"==typeof t?t=kc[t]:t instanceof rc||(t=Vc(t)),t instanceof rc&&!t.isDisposed()&&t.dispose();},t.getInstanceByDom=Vc,t.getInstanceById=function(t){return kc[t];},t.registerTheme=Gc,t.registerPreprocessor=Wc,t.registerProcessor=Fc,t.registerPostUpdate=function(t){Dc.push(t);},t.registerAction=Hc,t.registerCoordinateSystem=Zc,t.getCoordinateSystemDimensions=function(t){var e=ah.get(t);if(e)return e.getDimensionsInfo?e.getDimensionsInfo():e.dimensions.slice();},t.registerLayout=Uc,t.registerVisual=jc,t.registerLoading=Yc,t.extendComponentModel=qc,t.extendComponentView=Kc,t.extendSeriesModel=$c,t.extendChartView=Jc,t.setCanvasCreator=function(t){f("createCanvas",t);},t.registerMap=function(t,e,i){e.geoJson&&!e.features&&(i=e.specialAreas,e=e.geoJson),"string"==typeof e&&(e="undefined"!=typeof JSON&&JSON.parse?JSON.parse(e):new Function("return ("+e+");")()),Rc[t]={geoJson:e,specialAreas:i};},t.getMap=Qc,t.dataTool={},t.zrender=ea,t.graphic=ws,t.number=Js,t.format=gl,t.throttle=mu,t.helper=kf,t.matrix=Zt,t.vector=Mt,t.color=De,t.parseGeoJSON=zf,t.parseGeoJson=Ff,t.util=Hf,t.List=pd,t.Model=As,t.Axis=Wf,t.env=v;});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! iScroll v5.2.0-snapshot ~ (c) 2008-2017 Matteo Spinelli ~ http://cubiq.org/license */
var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
	window.setTimeout(callback, 1000 / 60);
};

var utils = function () {
	var me = {};

	var _elementStyle = document.createElement('div').style;
	var _vendor = function () {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
		    transform,
		    i = 0,
		    l = vendors.length;

		for (; i < l; i++) {
			transform = vendors[i] + 'ransform';
			if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
		}

		return false;
	}();

	function _prefixStyle(style) {
		if (_vendor === false) return false;
		if (_vendor === '') return style;
		return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}

	me.getTime = Date.now || function getTime() {
		return new Date().getTime();
	};

	me.extend = function (target, obj) {
		for (var i in obj) {
			target[i] = obj[i];
		}
	};

	me.addEvent = function (el, type, fn, capture) {
		el.addEventListener(type, fn, !!capture);
	};

	me.removeEvent = function (el, type, fn, capture) {
		el.removeEventListener(type, fn, !!capture);
	};

	me.prefixPointerEvent = function (pointerEvent) {
		return window.MSPointerEvent ? 'MSPointer' + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8) : pointerEvent;
	};

	me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
		var distance = current - start,
		    speed = Math.abs(distance) / time,
		    destination,
		    duration;

		deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
		duration = speed / deceleration;

		if (destination < lowerMargin) {
			destination = wrapperSize ? lowerMargin - wrapperSize / 2.5 * (speed / 8) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if (destination > 0) {
			destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}

		return {
			destination: Math.round(destination),
			duration: duration
		};
	};

	var _transform = _prefixStyle('transform');

	me.extend(me, {
		hasTransform: _transform !== false,
		hasPerspective: _prefixStyle('perspective') in _elementStyle,
		hasTouch: 'ontouchstart' in window,
		hasPointer: !!(window.PointerEvent || window.MSPointerEvent), // IE10 is prefixed
		hasTransition: _prefixStyle('transition') in _elementStyle
	});

	/*
 This should find all Android browsers lower than build 535.19 (both stock browser and webview)
 - galaxy S2 is ok
    - 2.3.6 : `AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
    - 4.0.4 : `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S3 is badAndroid (stock brower, webview)
     `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S4 is badAndroid (stock brower, webview)
     `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S5 is OK
     `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
   - galaxy S6 is OK
     `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
  */
	me.isBadAndroid = function () {
		var appVersion = window.navigator.appVersion;
		// Android browser is not a chrome browser.
		if (/Android/.test(appVersion) && !/Chrome\/\d/.test(appVersion)) {
			var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
			if (safariVersion && (typeof safariVersion === 'undefined' ? 'undefined' : _typeof(safariVersion)) === "object" && safariVersion.length >= 2) {
				return parseFloat(safariVersion[1]) < 535.19;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}();

	me.extend(me.style = {}, {
		transform: _transform,
		transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
		transitionDuration: _prefixStyle('transitionDuration'),
		transitionDelay: _prefixStyle('transitionDelay'),
		transformOrigin: _prefixStyle('transformOrigin'),
		touchAction: _prefixStyle('touchAction')
	});

	me.hasClass = function (e, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
		return re.test(e.className);
	};

	me.addClass = function (e, c) {
		if (me.hasClass(e, c)) {
			return;
		}

		var newclass = e.className.split(' ');
		newclass.push(c);
		e.className = newclass.join(' ');
	};

	me.removeClass = function (e, c) {
		if (!me.hasClass(e, c)) {
			return;
		}

		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
		e.className = e.className.replace(re, ' ');
	};

	me.offset = function (el) {
		var left = -el.offsetLeft,
		    top = -el.offsetTop;

		// jshint -W084
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		// jshint +W084

		return {
			left: left,
			top: top
		};
	};

	me.preventDefaultException = function (el, exceptions) {
		for (var i in exceptions) {
			if (exceptions[i].test(el[i])) {
				return true;
			}
		}

		return false;
	};

	me.extend(me.eventType = {}, {
		touchstart: 1,
		touchmove: 1,
		touchend: 1,

		mousedown: 2,
		mousemove: 2,
		mouseup: 2,

		pointerdown: 3,
		pointermove: 3,
		pointerup: 3,

		MSPointerDown: 3,
		MSPointerMove: 3,
		MSPointerUp: 3
	});

	me.extend(me.ease = {}, {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function fn(k) {
				return k * (2 - k);
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)', // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
			fn: function fn(k) {
				return Math.sqrt(1 - --k * k);
			}
		},
		back: {
			style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			fn: function fn(k) {
				var b = 4;
				return (k = k - 1) * k * ((b + 1) * k + b) + 1;
			}
		},
		bounce: {
			style: '',
			fn: function fn(k) {
				if ((k /= 1) < 1 / 2.75) {
					return 7.5625 * k * k;
				} else if (k < 2 / 2.75) {
					return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
				} else if (k < 2.5 / 2.75) {
					return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
				} else {
					return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
				}
			}
		},
		elastic: {
			style: '',
			fn: function fn(k) {
				var f = 0.22,
				    e = 0.4;

				if (k === 0) {
					return 0;
				}
				if (k == 1) {
					return 1;
				}

				return e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1;
			}
		}
	});

	me.tap = function (e, eventName) {
		var ev = document.createEvent('Event');
		ev.initEvent(eventName, true, true);
		ev.pageX = e.pageX;
		ev.pageY = e.pageY;
		e.target.dispatchEvent(ev);
	};

	me.click = function (e) {
		var target = e.target,
		    ev;

		if (!/(SELECT|INPUT|TEXTAREA)/i.test(target.tagName)) {
			// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
			// initMouseEvent is deprecated.
			ev = document.createEvent(window.MouseEvent ? 'MouseEvents' : 'Event');
			ev.initEvent('click', true, true);
			ev.view = e.view || window;
			ev.detail = 1;
			ev.screenX = target.screenX || 0;
			ev.screenY = target.screenY || 0;
			ev.clientX = target.clientX || 0;
			ev.clientY = target.clientY || 0;
			ev.ctrlKey = !!e.ctrlKey;
			ev.altKey = !!e.altKey;
			ev.shiftKey = !!e.shiftKey;
			ev.metaKey = !!e.metaKey;
			ev.button = 0;
			ev.relatedTarget = null;
			ev._constructed = true;
			target.dispatchEvent(ev);
		}
	};

	me.getTouchAction = function (eventPassthrough, addPinch) {
		var touchAction = 'none';
		if (eventPassthrough === 'vertical') {
			touchAction = 'pan-y';
		} else if (eventPassthrough === 'horizontal') {
			touchAction = 'pan-x';
		}
		if (addPinch && touchAction != 'none') {
			// add pinch-zoom support if the browser supports it, but if not (eg. Chrome <55) do nothing
			touchAction += ' pinch-zoom';
		}
		return touchAction;
	};

	me.getRect = function (el) {
		if (el instanceof SVGElement) {
			var rect = el.getBoundingClientRect();
			return {
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height
			};
		} else {
			return {
				top: el.offsetTop,
				left: el.offsetLeft,
				width: el.offsetWidth,
				height: el.offsetHeight
			};
		}
	};

	return me;
}();
function IScroll(el, options) {
	this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
	this.scroller = this.wrapper.children[0];
	this.scrollerStyle = this.scroller.style; // cache style for better performance

	this.options = {

		resizeScrollbars: true,

		mouseWheelSpeed: 20,

		snapThreshold: 0.334,

		// INSERT POINT: OPTIONS
		disablePointer: !utils.hasPointer,
		disableTouch: utils.hasPointer || !utils.hasTouch,
		disableMouse: utils.hasPointer || utils.hasTouch,
		startX: 0,
		startY: 0,
		scrollY: true,
		directionLockThreshold: 5,
		momentum: true,

		bounce: true,
		bounceTime: 600,
		bounceEasing: '',

		preventDefault: true,
		preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

		HWCompositing: true,
		useTransition: true,
		useTransform: true,
		bindToWrapper: typeof window.onmousedown === "undefined"
	};

	for (var i in options) {
		this.options[i] = options[i];
	}

	// Normalize options
	this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

	this.options.useTransition = utils.hasTransition && this.options.useTransition;
	this.options.useTransform = utils.hasTransform && this.options.useTransform;

	this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
	this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

	// If you want eventPassthrough I have to lock one of the axes
	this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
	this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

	// With eventPassthrough we also need lockDirection mechanism
	this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
	this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

	this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

	this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

	if (this.options.tap === true) {
		this.options.tap = 'tap';
	}

	// https://github.com/cubiq/iscroll/issues/1029
	if (!this.options.useTransition && !this.options.useTransform) {
		if (!/relative|absolute/i.test(this.scrollerStyle.position)) {
			this.scrollerStyle.position = "relative";
		}
	}

	if (this.options.shrinkScrollbars == 'scale') {
		this.options.useTransition = false;
	}

	this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

	// INSERT POINT: NORMALIZATION

	// Some defaults
	this.x = 0;
	this.y = 0;
	this.directionX = 0;
	this.directionY = 0;
	this._events = {};

	// INSERT POINT: DEFAULTS

	this._init();
	this.refresh();

	this.scrollTo(this.options.startX, this.options.startY);
	this.enable();
}

IScroll.prototype = {
	version: '5.2.0-snapshot',

	_init: function _init() {
		this._initEvents();

		if (this.options.scrollbars || this.options.indicators) {
			this._initIndicators();
		}

		if (this.options.mouseWheel) {
			this._initWheel();
		}

		if (this.options.snap) {
			this._initSnap();
		}

		if (this.options.keyBindings) {
			this._initKeys();
		}

		// INSERT POINT: _init
	},

	destroy: function destroy() {
		this._initEvents(true);
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = null;
		this._execEvent('destroy');
	},

	_transitionEnd: function _transitionEnd(e) {
		if (e.target != this.scroller || !this.isInTransition) {
			return;
		}

		this._transitionTime();
		if (!this.resetPosition(this.options.bounceTime)) {
			this.isInTransition = false;
			this._execEvent('scrollEnd');
		}
	},

	_start: function _start(e) {
		// React to left mouse button only
		if (utils.eventType[e.type] != 1) {
			// for button property
			// http://unixpapa.com/js/mouse.html
			var button;
			if (!e.which) {
				/* IE case */
				button = e.button < 2 ? 0 : e.button == 4 ? 1 : 2;
			} else {
				/* All others */
				button = e.button;
			}
			if (button !== 0) {
				return;
			}
		}

		if (!this.enabled || this.initiated && utils.eventType[e.type] !== this.initiated) {
			return;
		}

		if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
			e.preventDefault();
		}

		var point = e.touches ? e.touches[0] : e,
		    pos;

		this.initiated = utils.eventType[e.type];
		this.moved = false;
		this.distX = 0;
		this.distY = 0;
		this.directionX = 0;
		this.directionY = 0;
		this.directionLocked = 0;

		this.startTime = utils.getTime();

		if (this.options.useTransition && this.isInTransition) {
			this._transitionTime();
			this.isInTransition = false;
			pos = this.getComputedPosition();
			this._translate(Math.round(pos.x), Math.round(pos.y));
			this._execEvent('scrollEnd');
		} else if (!this.options.useTransition && this.isAnimating) {
			this.isAnimating = false;
			this._execEvent('scrollEnd');
		}

		this.startX = this.x;
		this.startY = this.y;
		this.absStartX = this.x;
		this.absStartY = this.y;
		this.pointX = point.pageX;
		this.pointY = point.pageY;

		this._execEvent('beforeScrollStart');
	},

	_move: function _move(e) {
		if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
			return;
		}

		if (this.options.preventDefault) {
			// increases performance on Android? TODO: check!
			e.preventDefault();
		}

		var point = e.touches ? e.touches[0] : e,
		    deltaX = point.pageX - this.pointX,
		    deltaY = point.pageY - this.pointY,
		    timestamp = utils.getTime(),
		    newX,
		    newY,
		    absDistX,
		    absDistY;

		this.pointX = point.pageX;
		this.pointY = point.pageY;

		this.distX += deltaX;
		this.distY += deltaY;
		absDistX = Math.abs(this.distX);
		absDistY = Math.abs(this.distY);

		// We need to move at least 10 pixels for the scrolling to initiate
		if (timestamp - this.endTime > 300 && absDistX < 10 && absDistY < 10) {
			return;
		}

		// If you are scrolling in one direction lock the other
		if (!this.directionLocked && !this.options.freeScroll) {
			if (absDistX > absDistY + this.options.directionLockThreshold) {
				this.directionLocked = 'h'; // lock horizontally
			} else if (absDistY >= absDistX + this.options.directionLockThreshold) {
				this.directionLocked = 'v'; // lock vertically
			} else {
				this.directionLocked = 'n'; // no lock
			}
		}

		if (this.directionLocked == 'h') {
			if (this.options.eventPassthrough == 'vertical') {
				e.preventDefault();
			} else if (this.options.eventPassthrough == 'horizontal') {
				this.initiated = false;
				return;
			}

			deltaY = 0;
		} else if (this.directionLocked == 'v') {
			if (this.options.eventPassthrough == 'horizontal') {
				e.preventDefault();
			} else if (this.options.eventPassthrough == 'vertical') {
				this.initiated = false;
				return;
			}

			deltaX = 0;
		}

		deltaX = this.hasHorizontalScroll ? deltaX : 0;
		deltaY = this.hasVerticalScroll ? deltaY : 0;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < this.maxScrollX) {
			newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
		}
		if (newY > 0 || newY < this.maxScrollY) {
			newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
		}

		this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (!this.moved) {
			this._execEvent('scrollStart');
		}

		this.moved = true;

		this._translate(newX, newY);

		/* REPLACE START: _move */

		if (timestamp - this.startTime > 300) {
			this.startTime = timestamp;
			this.startX = this.x;
			this.startY = this.y;
		}

		/* REPLACE END: _move */
	},

	_end: function _end(e) {
		if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
			return;
		}

		if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
			e.preventDefault();
		}

		var momentumX,
		    momentumY,
		    duration = utils.getTime() - this.startTime,
		    newX = Math.round(this.x),
		    newY = Math.round(this.y),
		    distanceX = Math.abs(newX - this.startX),
		    distanceY = Math.abs(newY - this.startY),
		    time = 0,
		    easing = '';

		this.isInTransition = 0;
		this.initiated = 0;
		this.endTime = utils.getTime();

		// reset if we are outside of the boundaries
		if (this.resetPosition(this.options.bounceTime)) {
			return;
		}

		this.scrollTo(newX, newY); // ensures that the last position is rounded

		// we scrolled less than 10 pixels
		if (!this.moved) {
			if (this.options.tap) {
				utils.tap(e, this.options.tap);
			}

			if (this.options.click) {
				utils.click(e);
			}

			this._execEvent('scrollCancel');
			return;
		}

		if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
			this._execEvent('flick');
			return;
		}

		// start momentum animation if needed
		if (this.options.momentum && duration < 300) {
			momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
			momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
			newX = momentumX.destination;
			newY = momentumY.destination;
			time = Math.max(momentumX.duration, momentumY.duration);
			this.isInTransition = 1;
		}

		if (this.options.snap) {
			var snap = this._nearestSnap(newX, newY);
			this.currentPage = snap;
			time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(newX - snap.x), 1000), Math.min(Math.abs(newY - snap.y), 1000)), 300);
			newX = snap.x;
			newY = snap.y;

			this.directionX = 0;
			this.directionY = 0;
			easing = this.options.bounceEasing;
		}

		// INSERT POINT: _end

		if (newX != this.x || newY != this.y) {
			// change easing function when scroller goes out of the boundaries
			if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
				easing = utils.ease.quadratic;
			}

			this.scrollTo(newX, newY, time, easing);
			return;
		}

		this._execEvent('scrollEnd');
	},

	_resize: function _resize() {
		var that = this;

		clearTimeout(this.resizeTimeout);

		this.resizeTimeout = setTimeout(function () {
			that.refresh();
		}, this.options.resizePolling);
	},

	resetPosition: function resetPosition(time) {
		var x = this.x,
		    y = this.y;

		time = time || 0;

		if (!this.hasHorizontalScroll || this.x > 0) {
			x = 0;
		} else if (this.x < this.maxScrollX) {
			x = this.maxScrollX;
		}

		if (!this.hasVerticalScroll || this.y > 0) {
			y = 0;
		} else if (this.y < this.maxScrollY) {
			y = this.maxScrollY;
		}

		if (x == this.x && y == this.y) {
			return false;
		}

		this.scrollTo(x, y, time, this.options.bounceEasing);

		return true;
	},

	disable: function disable() {
		this.enabled = false;
	},

	enable: function enable() {
		this.enabled = true;
	},

	refresh: function refresh() {
		utils.getRect(this.wrapper); // Force reflow

		this.wrapperWidth = this.wrapper.clientWidth;
		this.wrapperHeight = this.wrapper.clientHeight;

		var rect = utils.getRect(this.scroller);
		/* REPLACE START: refresh */

		this.scrollerWidth = rect.width;
		this.scrollerHeight = rect.height;

		this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
		this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

		/* REPLACE END: refresh */

		this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
		this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

		if (!this.hasHorizontalScroll) {
			this.maxScrollX = 0;
			this.scrollerWidth = this.wrapperWidth;
		}

		if (!this.hasVerticalScroll) {
			this.maxScrollY = 0;
			this.scrollerHeight = this.wrapperHeight;
		}

		this.endTime = 0;
		this.directionX = 0;
		this.directionY = 0;

		if (utils.hasPointer && !this.options.disablePointer) {
			// The wrapper should have `touchAction` property for using pointerEvent.
			this.wrapper.style[utils.style.touchAction] = utils.getTouchAction(this.options.eventPassthrough, true);

			// case. not support 'pinch-zoom'
			// https://github.com/cubiq/iscroll/issues/1118#issuecomment-270057583
			if (!this.wrapper.style[utils.style.touchAction]) {
				this.wrapper.style[utils.style.touchAction] = utils.getTouchAction(this.options.eventPassthrough, false);
			}
		}
		this.wrapperOffset = utils.offset(this.wrapper);

		this._execEvent('refresh');

		this.resetPosition();

		// INSERT POINT: _refresh
	},

	on: function on(type, fn) {
		if (!this._events[type]) {
			this._events[type] = [];
		}

		this._events[type].push(fn);
	},

	off: function off(type, fn) {
		if (!this._events[type]) {
			return;
		}

		var index = this._events[type].indexOf(fn);

		if (index > -1) {
			this._events[type].splice(index, 1);
		}
	},

	_execEvent: function _execEvent(type) {
		if (!this._events[type]) {
			return;
		}

		var i = 0,
		    l = this._events[type].length;

		if (!l) {
			return;
		}

		for (; i < l; i++) {
			this._events[type][i].apply(this, [].slice.call(arguments, 1));
		}
	},

	scrollBy: function scrollBy(x, y, time, easing) {
		x = this.x + x;
		y = this.y + y;
		time = time || 0;

		this.scrollTo(x, y, time, easing);
	},

	scrollTo: function scrollTo(x, y, time, easing) {
		easing = easing || utils.ease.circular;

		this.isInTransition = this.options.useTransition && time > 0;
		var transitionType = this.options.useTransition && easing.style;
		if (!time || transitionType) {
			if (transitionType) {
				this._transitionTimingFunction(easing.style);
				this._transitionTime(time);
			}
			this._translate(x, y);
		} else {
			this._animate(x, y, time, easing.fn);
		}
	},

	scrollToElement: function scrollToElement(el, time, offsetX, offsetY, easing) {
		el = el.nodeType ? el : this.scroller.querySelector(el);

		if (!el) {
			return;
		}

		var pos = utils.offset(el);

		pos.left -= this.wrapperOffset.left;
		pos.top -= this.wrapperOffset.top;

		// if offsetX/Y are true we center the element to the screen
		var elRect = utils.getRect(el);
		var wrapperRect = utils.getRect(this.wrapper);
		if (offsetX === true) {
			offsetX = Math.round(elRect.width / 2 - wrapperRect.width / 2);
		}
		if (offsetY === true) {
			offsetY = Math.round(elRect.height / 2 - wrapperRect.height / 2);
		}

		pos.left -= offsetX || 0;
		pos.top -= offsetY || 0;

		pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
		pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

		time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

		this.scrollTo(pos.left, pos.top, time, easing);
	},

	_transitionTime: function _transitionTime(time) {
		if (!this.options.useTransition) {
			return;
		}
		time = time || 0;
		var durationProp = utils.style.transitionDuration;
		if (!durationProp) {
			return;
		}

		this.scrollerStyle[durationProp] = time + 'ms';

		if (!time && utils.isBadAndroid) {
			this.scrollerStyle[durationProp] = '0.0001ms';
			// remove 0.0001ms
			var self = this;
			rAF(function () {
				if (self.scrollerStyle[durationProp] === '0.0001ms') {
					self.scrollerStyle[durationProp] = '0s';
				}
			});
		}

		if (this.indicators) {
			for (var i = this.indicators.length; i--;) {
				this.indicators[i].transitionTime(time);
			}
		}

		// INSERT POINT: _transitionTime
	},

	_transitionTimingFunction: function _transitionTimingFunction(easing) {
		this.scrollerStyle[utils.style.transitionTimingFunction] = easing;

		if (this.indicators) {
			for (var i = this.indicators.length; i--;) {
				this.indicators[i].transitionTimingFunction(easing);
			}
		}

		// INSERT POINT: _transitionTimingFunction
	},

	_translate: function _translate(x, y) {
		if (this.options.useTransform) {

			/* REPLACE START: _translate */

			this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

			/* REPLACE END: _translate */
		} else {
			x = Math.round(x);
			y = Math.round(y);
			this.scrollerStyle.left = x + 'px';
			this.scrollerStyle.top = y + 'px';
		}

		this.x = x;
		this.y = y;

		if (this.indicators) {
			for (var i = this.indicators.length; i--;) {
				this.indicators[i].updatePosition();
			}
		}

		// INSERT POINT: _translate
	},

	_initEvents: function _initEvents(remove) {
		var eventType = remove ? utils.removeEvent : utils.addEvent,
		    target = this.options.bindToWrapper ? this.wrapper : window;

		eventType(window, 'orientationchange', this);
		eventType(window, 'resize', this);

		if (this.options.click) {
			eventType(this.wrapper, 'click', this, true);
		}

		if (!this.options.disableMouse) {
			eventType(this.wrapper, 'mousedown', this);
			eventType(target, 'mousemove', this);
			eventType(target, 'mousecancel', this);
			eventType(target, 'mouseup', this);
		}

		if (utils.hasPointer && !this.options.disablePointer) {
			eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
			eventType(target, utils.prefixPointerEvent('pointermove'), this);
			eventType(target, utils.prefixPointerEvent('pointercancel'), this);
			eventType(target, utils.prefixPointerEvent('pointerup'), this);
		}

		if (utils.hasTouch && !this.options.disableTouch) {
			eventType(this.wrapper, 'touchstart', this);
			eventType(target, 'touchmove', this);
			eventType(target, 'touchcancel', this);
			eventType(target, 'touchend', this);
		}

		eventType(this.scroller, 'transitionend', this);
		eventType(this.scroller, 'webkitTransitionEnd', this);
		eventType(this.scroller, 'oTransitionEnd', this);
		eventType(this.scroller, 'MSTransitionEnd', this);
	},

	getComputedPosition: function getComputedPosition() {
		var matrix = window.getComputedStyle(this.scroller, null),
		    x,
		    y;

		if (this.options.useTransform) {
			matrix = matrix[utils.style.transform].split(')')[0].split(', ');
			x = +(matrix[12] || matrix[4]);
			y = +(matrix[13] || matrix[5]);
		} else {
			x = +matrix.left.replace(/[^-\d.]/g, '');
			y = +matrix.top.replace(/[^-\d.]/g, '');
		}

		return { x: x, y: y };
	},
	_initIndicators: function _initIndicators() {
		var interactive = this.options.interactiveScrollbars,
		    customStyle = typeof this.options.scrollbars != 'string',
		    indicators = [],
		    indicator;

		var that = this;

		this.indicators = [];

		if (this.options.scrollbars) {
			// Vertical scrollbar
			if (this.options.scrollY) {
				indicator = {
					el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenX: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}

			// Horizontal scrollbar
			if (this.options.scrollX) {
				indicator = {
					el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenY: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}
		}

		if (this.options.indicators) {
			// TODO: check concat compatibility
			indicators = indicators.concat(this.options.indicators);
		}

		for (var i = indicators.length; i--;) {
			this.indicators.push(new Indicator(this, indicators[i]));
		}

		// TODO: check if we can use array.map (wide compatibility and performance issues)
		function _indicatorsMap(fn) {
			if (that.indicators) {
				for (var i = that.indicators.length; i--;) {
					fn.call(that.indicators[i]);
				}
			}
		}

		if (this.options.fadeScrollbars) {
			this.on('scrollEnd', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollCancel', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1);
				});
			});

			this.on('beforeScrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1, true);
				});
			});
		}

		this.on('refresh', function () {
			_indicatorsMap(function () {
				this.refresh();
			});
		});

		this.on('destroy', function () {
			_indicatorsMap(function () {
				this.destroy();
			});

			delete this.indicators;
		});
	},

	_initWheel: function _initWheel() {
		utils.addEvent(this.wrapper, 'wheel', this);
		utils.addEvent(this.wrapper, 'mousewheel', this);
		utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

		this.on('destroy', function () {
			clearTimeout(this.wheelTimeout);
			this.wheelTimeout = null;
			utils.removeEvent(this.wrapper, 'wheel', this);
			utils.removeEvent(this.wrapper, 'mousewheel', this);
			utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
		});
	},

	_wheel: function _wheel(e) {
		if (!this.enabled) {
			return;
		}

		e.preventDefault();

		var wheelDeltaX,
		    wheelDeltaY,
		    newX,
		    newY,
		    that = this;

		if (this.wheelTimeout === undefined) {
			that._execEvent('scrollStart');
		}

		// Execute the scrollEnd event after 400ms the wheel stopped scrolling
		clearTimeout(this.wheelTimeout);
		this.wheelTimeout = setTimeout(function () {
			if (!that.options.snap) {
				that._execEvent('scrollEnd');
			}
			that.wheelTimeout = undefined;
		}, 400);

		if ('deltaX' in e) {
			if (e.deltaMode === 1) {
				wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
				wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
			} else {
				wheelDeltaX = -e.deltaX;
				wheelDeltaY = -e.deltaY;
			}
		} else if ('wheelDeltaX' in e) {
			wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
			wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
		} else if ('wheelDelta' in e) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
		} else {
			return;
		}

		wheelDeltaX *= this.options.invertWheelDirection;
		wheelDeltaY *= this.options.invertWheelDirection;

		if (!this.hasVerticalScroll) {
			wheelDeltaX = wheelDeltaY;
			wheelDeltaY = 0;
		}

		if (this.options.snap) {
			newX = this.currentPage.pageX;
			newY = this.currentPage.pageY;

			if (wheelDeltaX > 0) {
				newX--;
			} else if (wheelDeltaX < 0) {
				newX++;
			}

			if (wheelDeltaY > 0) {
				newY--;
			} else if (wheelDeltaY < 0) {
				newY++;
			}

			this.goToPage(newX, newY);

			return;
		}

		newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
		newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

		this.directionX = wheelDeltaX > 0 ? -1 : wheelDeltaX < 0 ? 1 : 0;
		this.directionY = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? 1 : 0;

		if (newX > 0) {
			newX = 0;
		} else if (newX < this.maxScrollX) {
			newX = this.maxScrollX;
		}

		if (newY > 0) {
			newY = 0;
		} else if (newY < this.maxScrollY) {
			newY = this.maxScrollY;
		}

		this.scrollTo(newX, newY, 0);

		// INSERT POINT: _wheel
	},

	_initSnap: function _initSnap() {
		this.currentPage = {};

		if (typeof this.options.snap == 'string') {
			this.options.snap = this.scroller.querySelectorAll(this.options.snap);
		}

		this.on('refresh', function () {
			var i = 0,
			    l,
			    m = 0,
			    n,
			    cx,
			    cy,
			    x = 0,
			    y,
			    stepX = this.options.snapStepX || this.wrapperWidth,
			    stepY = this.options.snapStepY || this.wrapperHeight,
			    el,
			    rect;

			this.pages = [];

			if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
				return;
			}

			if (this.options.snap === true) {
				cx = Math.round(stepX / 2);
				cy = Math.round(stepY / 2);

				while (x > -this.scrollerWidth) {
					this.pages[i] = [];
					l = 0;
					y = 0;

					while (y > -this.scrollerHeight) {
						this.pages[i][l] = {
							x: Math.max(x, this.maxScrollX),
							y: Math.max(y, this.maxScrollY),
							width: stepX,
							height: stepY,
							cx: x - cx,
							cy: y - cy
						};

						y -= stepY;
						l++;
					}

					x -= stepX;
					i++;
				}
			} else {
				el = this.options.snap;
				l = el.length;
				n = -1;

				for (; i < l; i++) {
					rect = utils.getRect(el[i]);
					if (i === 0 || rect.left <= utils.getRect(el[i - 1]).left) {
						m = 0;
						n++;
					}

					if (!this.pages[m]) {
						this.pages[m] = [];
					}

					x = Math.max(-rect.left, this.maxScrollX);
					y = Math.max(-rect.top, this.maxScrollY);
					cx = x - Math.round(rect.width / 2);
					cy = y - Math.round(rect.height / 2);

					this.pages[m][n] = {
						x: x,
						y: y,
						width: rect.width,
						height: rect.height,
						cx: cx,
						cy: cy
					};

					if (x > this.maxScrollX) {
						m++;
					}
				}
			}

			this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

			// Update snap threshold if needed
			if (this.options.snapThreshold % 1 === 0) {
				this.snapThresholdX = this.options.snapThreshold;
				this.snapThresholdY = this.options.snapThreshold;
			} else {
				this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
				this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
			}
		});

		this.on('flick', function () {
			var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.x - this.startX), 1000), Math.min(Math.abs(this.y - this.startY), 1000)), 300);

			this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, time);
		});
	},

	_nearestSnap: function _nearestSnap(x, y) {
		if (!this.pages.length) {
			return { x: 0, y: 0, pageX: 0, pageY: 0 };
		}

		var i = 0,
		    l = this.pages.length,
		    m = 0;

		// Check if we exceeded the snap threshold
		if (Math.abs(x - this.absStartX) < this.snapThresholdX && Math.abs(y - this.absStartY) < this.snapThresholdY) {
			return this.currentPage;
		}

		if (x > 0) {
			x = 0;
		} else if (x < this.maxScrollX) {
			x = this.maxScrollX;
		}

		if (y > 0) {
			y = 0;
		} else if (y < this.maxScrollY) {
			y = this.maxScrollY;
		}

		for (; i < l; i++) {
			if (x >= this.pages[i][0].cx) {
				x = this.pages[i][0].x;
				break;
			}
		}

		l = this.pages[i].length;

		for (; m < l; m++) {
			if (y >= this.pages[0][m].cy) {
				y = this.pages[0][m].y;
				break;
			}
		}

		if (i == this.currentPage.pageX) {
			i += this.directionX;

			if (i < 0) {
				i = 0;
			} else if (i >= this.pages.length) {
				i = this.pages.length - 1;
			}

			x = this.pages[i][0].x;
		}

		if (m == this.currentPage.pageY) {
			m += this.directionY;

			if (m < 0) {
				m = 0;
			} else if (m >= this.pages[0].length) {
				m = this.pages[0].length - 1;
			}

			y = this.pages[0][m].y;
		}

		return {
			x: x,
			y: y,
			pageX: i,
			pageY: m
		};
	},

	goToPage: function goToPage(x, y, time, easing) {
		easing = easing || this.options.bounceEasing;

		if (x >= this.pages.length) {
			x = this.pages.length - 1;
		} else if (x < 0) {
			x = 0;
		}

		if (y >= this.pages[x].length) {
			y = this.pages[x].length - 1;
		} else if (y < 0) {
			y = 0;
		}

		var posX = this.pages[x][y].x,
		    posY = this.pages[x][y].y;

		time = time === undefined ? this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(posX - this.x), 1000), Math.min(Math.abs(posY - this.y), 1000)), 300) : time;

		this.currentPage = {
			x: posX,
			y: posY,
			pageX: x,
			pageY: y
		};

		this.scrollTo(posX, posY, time, easing);
	},

	next: function next(time, easing) {
		var x = this.currentPage.pageX,
		    y = this.currentPage.pageY;

		x++;

		if (x >= this.pages.length && this.hasVerticalScroll) {
			x = 0;
			y++;
		}

		this.goToPage(x, y, time, easing);
	},

	prev: function prev(time, easing) {
		var x = this.currentPage.pageX,
		    y = this.currentPage.pageY;

		x--;

		if (x < 0 && this.hasVerticalScroll) {
			x = 0;
			y--;
		}

		this.goToPage(x, y, time, easing);
	},

	_initKeys: function _initKeys(e) {
		// default key bindings
		var keys = {
			pageUp: 33,
			pageDown: 34,
			end: 35,
			home: 36,
			left: 37,
			up: 38,
			right: 39,
			down: 40
		};
		var i;

		// if you give me characters I give you keycode
		if (_typeof(this.options.keyBindings) == 'object') {
			for (i in this.options.keyBindings) {
				if (typeof this.options.keyBindings[i] == 'string') {
					this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
				}
			}
		} else {
			this.options.keyBindings = {};
		}

		for (i in keys) {
			this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
		}

		utils.addEvent(window, 'keydown', this);

		this.on('destroy', function () {
			utils.removeEvent(window, 'keydown', this);
		});
	},

	_key: function _key(e) {
		if (!this.enabled) {
			return;
		}

		var snap = this.options.snap,
		    // we are using this alot, better to cache it
		newX = snap ? this.currentPage.pageX : this.x,
		    newY = snap ? this.currentPage.pageY : this.y,
		    now = utils.getTime(),
		    prevTime = this.keyTime || 0,
		    acceleration = 0.250,
		    pos;

		if (this.options.useTransition && this.isInTransition) {
			pos = this.getComputedPosition();

			this._translate(Math.round(pos.x), Math.round(pos.y));
			this.isInTransition = false;
		}

		this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

		switch (e.keyCode) {
			case this.options.keyBindings.pageUp:
				if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
					newX += snap ? 1 : this.wrapperWidth;
				} else {
					newY += snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.pageDown:
				if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
					newX -= snap ? 1 : this.wrapperWidth;
				} else {
					newY -= snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.end:
				newX = snap ? this.pages.length - 1 : this.maxScrollX;
				newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
				break;
			case this.options.keyBindings.home:
				newX = 0;
				newY = 0;
				break;
			case this.options.keyBindings.left:
				newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
				break;
			case this.options.keyBindings.up:
				newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
				break;
			case this.options.keyBindings.right:
				newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
				break;
			case this.options.keyBindings.down:
				newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
				break;
			default:
				return;
		}

		if (snap) {
			this.goToPage(newX, newY);
			return;
		}

		if (newX > 0) {
			newX = 0;
			this.keyAcceleration = 0;
		} else if (newX < this.maxScrollX) {
			newX = this.maxScrollX;
			this.keyAcceleration = 0;
		}

		if (newY > 0) {
			newY = 0;
			this.keyAcceleration = 0;
		} else if (newY < this.maxScrollY) {
			newY = this.maxScrollY;
			this.keyAcceleration = 0;
		}

		this.scrollTo(newX, newY, 0);

		this.keyTime = now;
	},

	_animate: function _animate(destX, destY, duration, easingFn) {
		var that = this,
		    startX = this.x,
		    startY = this.y,
		    startTime = utils.getTime(),
		    destTime = startTime + duration;

		function step() {
			var now = utils.getTime(),
			    newX,
			    newY,
			    easing;

			if (now >= destTime) {
				that.isAnimating = false;
				that._translate(destX, destY);

				if (!that.resetPosition(that.options.bounceTime)) {
					that._execEvent('scrollEnd');
				}

				return;
			}

			now = (now - startTime) / duration;
			easing = easingFn(now);
			newX = (destX - startX) * easing + startX;
			newY = (destY - startY) * easing + startY;
			that._translate(newX, newY);

			if (that.isAnimating) {
				rAF(step);
			}
		}

		this.isAnimating = true;
		step();
	},
	handleEvent: function handleEvent(e) {
		switch (e.type) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this._resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this._transitionEnd(e);
				break;
			case 'wheel':
			case 'DOMMouseScroll':
			case 'mousewheel':
				this._wheel(e);
				break;
			case 'keydown':
				this._key(e);
				break;
			case 'click':
				if (this.enabled && !e._constructed) {
					e.preventDefault();
					e.stopPropagation();
				}
				break;
		}
	}
};
function createDefaultScrollbar(direction, interactive, type) {
	var scrollbar = document.createElement('div'),
	    indicator = document.createElement('div');

	if (type === true) {
		scrollbar.style.cssText = 'position:absolute;z-index:9999';
		indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
	}

	indicator.className = 'iScrollIndicator';

	if (direction == 'h') {
		if (type === true) {
			scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
			indicator.style.height = '100%';
		}
		scrollbar.className = 'iScrollHorizontalScrollbar';
	} else {
		if (type === true) {
			scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
			indicator.style.width = '100%';
		}
		scrollbar.className = 'iScrollVerticalScrollbar';
	}

	scrollbar.style.cssText += ';overflow:hidden';

	if (!interactive) {
		scrollbar.style.pointerEvents = 'none';
	}

	scrollbar.appendChild(indicator);

	return scrollbar;
}

function Indicator(scroller, options) {
	this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
	this.wrapperStyle = this.wrapper.style;
	this.indicator = this.wrapper.children[0];
	this.indicatorStyle = this.indicator.style;
	this.scroller = scroller;

	this.options = {
		listenX: true,
		listenY: true,
		interactive: false,
		resize: true,
		defaultScrollbars: false,
		shrink: false,
		fade: false,
		speedRatioX: 0,
		speedRatioY: 0
	};

	for (var i in options) {
		this.options[i] = options[i];
	}

	this.sizeRatioX = 1;
	this.sizeRatioY = 1;
	this.maxPosX = 0;
	this.maxPosY = 0;

	if (this.options.interactive) {
		if (!this.options.disableTouch) {
			utils.addEvent(this.indicator, 'touchstart', this);
			utils.addEvent(window, 'touchend', this);
		}
		if (!this.options.disablePointer) {
			utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
			utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
		}
		if (!this.options.disableMouse) {
			utils.addEvent(this.indicator, 'mousedown', this);
			utils.addEvent(window, 'mouseup', this);
		}
	}

	if (this.options.fade) {
		this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
		var durationProp = utils.style.transitionDuration;
		if (!durationProp) {
			return;
		}
		this.wrapperStyle[durationProp] = utils.isBadAndroid ? '0.0001ms' : '0ms';
		// remove 0.0001ms
		var self = this;
		if (utils.isBadAndroid) {
			rAF(function () {
				if (self.wrapperStyle[durationProp] === '0.0001ms') {
					self.wrapperStyle[durationProp] = '0s';
				}
			});
		}
		this.wrapperStyle.opacity = '0';
	}
}

Indicator.prototype = {
	handleEvent: function handleEvent(e) {
		switch (e.type) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
		}
	},

	destroy: function destroy() {
		if (this.options.fadeScrollbars) {
			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;
		}
		if (this.options.interactive) {
			utils.removeEvent(this.indicator, 'touchstart', this);
			utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
			utils.removeEvent(this.indicator, 'mousedown', this);

			utils.removeEvent(window, 'touchmove', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
			utils.removeEvent(window, 'mousemove', this);

			utils.removeEvent(window, 'touchend', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
			utils.removeEvent(window, 'mouseup', this);
		}

		if (this.options.defaultScrollbars && this.wrapper.parentNode) {
			this.wrapper.parentNode.removeChild(this.wrapper);
		}
	},

	_start: function _start(e) {
		var point = e.touches ? e.touches[0] : e;

		e.preventDefault();
		e.stopPropagation();

		this.transitionTime();

		this.initiated = true;
		this.moved = false;
		this.lastPointX = point.pageX;
		this.lastPointY = point.pageY;

		this.startTime = utils.getTime();

		if (!this.options.disableTouch) {
			utils.addEvent(window, 'touchmove', this);
		}
		if (!this.options.disablePointer) {
			utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
		}
		if (!this.options.disableMouse) {
			utils.addEvent(window, 'mousemove', this);
		}

		this.scroller._execEvent('beforeScrollStart');
	},

	_move: function _move(e) {
		var point = e.touches ? e.touches[0] : e,
		    deltaX,
		    deltaY,
		    newX,
		    newY;

		if (!this.moved) {
			this.scroller._execEvent('scrollStart');
		}

		this.moved = true;

		deltaX = point.pageX - this.lastPointX;
		this.lastPointX = point.pageX;

		deltaY = point.pageY - this.lastPointY;
		this.lastPointY = point.pageY;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		this._pos(newX, newY);

		// INSERT POINT: indicator._move

		e.preventDefault();
		e.stopPropagation();
	},

	_end: function _end(e) {
		if (!this.initiated) {
			return;
		}

		this.initiated = false;

		e.preventDefault();
		e.stopPropagation();

		utils.removeEvent(window, 'touchmove', this);
		utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
		utils.removeEvent(window, 'mousemove', this);

		if (this.scroller.options.snap) {
			var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

			var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.scroller.x - snap.x), 1000), Math.min(Math.abs(this.scroller.y - snap.y), 1000)), 300);

			if (this.scroller.x != snap.x || this.scroller.y != snap.y) {
				this.scroller.directionX = 0;
				this.scroller.directionY = 0;
				this.scroller.currentPage = snap;
				this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
			}
		}

		if (this.moved) {
			this.scroller._execEvent('scrollEnd');
		}
	},

	transitionTime: function transitionTime(time) {
		time = time || 0;
		var durationProp = utils.style.transitionDuration;
		if (!durationProp) {
			return;
		}

		this.indicatorStyle[durationProp] = time + 'ms';

		if (!time && utils.isBadAndroid) {
			this.indicatorStyle[durationProp] = '0.0001ms';
			// remove 0.0001ms
			var self = this;
			rAF(function () {
				if (self.indicatorStyle[durationProp] === '0.0001ms') {
					self.indicatorStyle[durationProp] = '0s';
				}
			});
		}
	},

	transitionTimingFunction: function transitionTimingFunction(easing) {
		this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
	},

	refresh: function refresh() {
		this.transitionTime();

		if (this.options.listenX && !this.options.listenY) {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
		} else if (this.options.listenY && !this.options.listenX) {
			this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
		} else {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
		}

		if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
			utils.addClass(this.wrapper, 'iScrollBothScrollbars');
			utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

			if (this.options.defaultScrollbars && this.options.customStyle) {
				if (this.options.listenX) {
					this.wrapper.style.right = '8px';
				} else {
					this.wrapper.style.bottom = '8px';
				}
			}
		} else {
			utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
			utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

			if (this.options.defaultScrollbars && this.options.customStyle) {
				if (this.options.listenX) {
					this.wrapper.style.right = '2px';
				} else {
					this.wrapper.style.bottom = '2px';
				}
			}
		}

		utils.getRect(this.wrapper); // force refresh

		if (this.options.listenX) {
			this.wrapperWidth = this.wrapper.clientWidth;
			if (this.options.resize) {
				this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
				this.indicatorStyle.width = this.indicatorWidth + 'px';
			} else {
				this.indicatorWidth = this.indicator.clientWidth;
			}

			this.maxPosX = this.wrapperWidth - this.indicatorWidth;

			if (this.options.shrink == 'clip') {
				this.minBoundaryX = -this.indicatorWidth + 8;
				this.maxBoundaryX = this.wrapperWidth - 8;
			} else {
				this.minBoundaryX = 0;
				this.maxBoundaryX = this.maxPosX;
			}

			this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX;
		}

		if (this.options.listenY) {
			this.wrapperHeight = this.wrapper.clientHeight;
			if (this.options.resize) {
				this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
				this.indicatorStyle.height = this.indicatorHeight + 'px';
			} else {
				this.indicatorHeight = this.indicator.clientHeight;
			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;

			if (this.options.shrink == 'clip') {
				this.minBoundaryY = -this.indicatorHeight + 8;
				this.maxBoundaryY = this.wrapperHeight - 8;
			} else {
				this.minBoundaryY = 0;
				this.maxBoundaryY = this.maxPosY;
			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;
			this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY;
		}

		this.updatePosition();
	},

	updatePosition: function updatePosition() {
		var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
		    y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

		if (!this.options.ignoreBoundaries) {
			if (x < this.minBoundaryX) {
				if (this.options.shrink == 'scale') {
					this.width = Math.max(this.indicatorWidth + x, 8);
					this.indicatorStyle.width = this.width + 'px';
				}
				x = this.minBoundaryX;
			} else if (x > this.maxBoundaryX) {
				if (this.options.shrink == 'scale') {
					this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
					this.indicatorStyle.width = this.width + 'px';
					x = this.maxPosX + this.indicatorWidth - this.width;
				} else {
					x = this.maxBoundaryX;
				}
			} else if (this.options.shrink == 'scale' && this.width != this.indicatorWidth) {
				this.width = this.indicatorWidth;
				this.indicatorStyle.width = this.width + 'px';
			}

			if (y < this.minBoundaryY) {
				if (this.options.shrink == 'scale') {
					this.height = Math.max(this.indicatorHeight + y * 3, 8);
					this.indicatorStyle.height = this.height + 'px';
				}
				y = this.minBoundaryY;
			} else if (y > this.maxBoundaryY) {
				if (this.options.shrink == 'scale') {
					this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
					this.indicatorStyle.height = this.height + 'px';
					y = this.maxPosY + this.indicatorHeight - this.height;
				} else {
					y = this.maxBoundaryY;
				}
			} else if (this.options.shrink == 'scale' && this.height != this.indicatorHeight) {
				this.height = this.indicatorHeight;
				this.indicatorStyle.height = this.height + 'px';
			}
		}

		this.x = x;
		this.y = y;

		if (this.scroller.options.useTransform) {
			this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
		} else {
			this.indicatorStyle.left = x + 'px';
			this.indicatorStyle.top = y + 'px';
		}
	},

	_pos: function _pos(x, y) {
		if (x < 0) {
			x = 0;
		} else if (x > this.maxPosX) {
			x = this.maxPosX;
		}

		if (y < 0) {
			y = 0;
		} else if (y > this.maxPosY) {
			y = this.maxPosY;
		}

		x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
		y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

		this.scroller.scrollTo(x, y);
	},

	fade: function fade(val, hold) {
		if (hold && !this.visible) {
			return;
		}

		clearTimeout(this.fadeTimeout);
		this.fadeTimeout = null;

		var time = val ? 250 : 500,
		    delay = val ? 0 : 300;

		val = val ? '1' : '0';

		this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

		this.fadeTimeout = setTimeout(function (val) {
			this.wrapperStyle.opacity = val;
			this.visible = +val;
		}.bind(this, val), delay);
	}
};

IScroll.utils = utils;

if (typeof module != 'undefined' && module.exports) {
	module.exports = IScroll;
} else if (true) {
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
		return IScroll;
	}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
	window.IScroll = IScroll;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    "lowPriceList": [{
        "price": 630,
        "priceWithTax": 0,
        "date": "2018-04-16",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-16",
        "month": 1522512000000
    }, {
        "price": 630,
        "priceWithTax": 0,
        "date": "2018-04-17",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-17",
        "month": 1522512000000
    }, {
        "price": 630,
        "priceWithTax": 0,
        "date": "2018-04-18",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-18",
        "month": 1522512000000
    }, {
        "price": 530,
        "priceWithTax": 0,
        "date": "2018-04-19",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-19",
        "month": 1522512000000
    }, {
        "price": 610,
        "priceWithTax": 0,
        "date": "2018-04-20",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-04-20",
        "month": 1522512000000
    }, {
        "price": 396,
        "priceWithTax": 0,
        "date": "2018-04-21",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-21",
        "month": 1522512000000
    }, {
        "price": 512,
        "priceWithTax": 0,
        "date": "2018-04-22",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-22",
        "month": 1522512000000
    }, {
        "price": 210,
        "priceWithTax": 0,
        "date": "2018-04-23",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-23",
        "month": 1522512000000
    }, {
        "price": 194,
        "priceWithTax": 194,
        "date": "2018-04-24",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-24",
        "month": 1522512000000
    }, {
        "price": 240,
        "priceWithTax": 0,
        "date": "2018-04-25",
        "flightno": "SC4622",
        "flightType": 1,
        "carrier": "SC4622",
        "depDate": "2018-04-25",
        "month": 1522512000000
    }, {
        "price": 270,
        "priceWithTax": 0,
        "date": "2018-04-26",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-26",
        "month": 1522512000000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-04-27",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-04-27",
        "month": 1522512000000
    }, {
        "price": 615,
        "priceWithTax": 0,
        "date": "2018-04-28",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-04-28",
        "month": 1522512000000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-04-29",
        "flightno": "SC4622",
        "flightType": 1,
        "carrier": "SC4622",
        "depDate": "2018-04-29",
        "month": 1522512000000
    }, {
        "price": 270,
        "priceWithTax": 0,
        "date": "2018-04-30",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-30",
        "month": 1522512000000
    }, {
        "price": 460,
        "priceWithTax": 0,
        "date": "2018-05-01",
        "flightno": "ZH3030",
        "flightType": 1,
        "carrier": "ZH3030",
        "depDate": "2018-05-01",
        "month": 1525104000000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-05-02",
        "flightno": "SC4622",
        "flightType": 1,
        "carrier": "SC4622",
        "depDate": "2018-05-02",
        "month": 1525104000000
    }, {
        "price": 290,
        "priceWithTax": 0,
        "date": "2018-05-03",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-05-03",
        "month": 1525104000000
    }, {
        "price": 340,
        "priceWithTax": 0,
        "date": "2018-05-04",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-05-04",
        "month": 1525104000000
    }, {
        "price": 290,
        "priceWithTax": 0,
        "date": "2018-05-05",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-05-05",
        "month": 1525104000000
    }, {
        "price": 340,
        "priceWithTax": 0,
        "date": "2018-05-06",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-05-06",
        "month": 1525104000000
    }, {
        "price": 290,
        "priceWithTax": 0,
        "date": "2018-05-07",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-05-07",
        "month": 1525104000000
    }, {
        "price": 290,
        "priceWithTax": 0,
        "date": "2018-05-08",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-05-08",
        "month": 1525104000000
    }, {
        "price": 290,
        "priceWithTax": 0,
        "date": "2018-05-09",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-05-09",
        "month": 1525104000000
    }, {
        "price": 290,
        "priceWithTax": 0,
        "date": "2018-05-10",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-05-10",
        "month": 1525104000000
    }, {
        "price": 340,
        "priceWithTax": 0,
        "date": "2018-05-11",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-05-11",
        "month": 1525104000000
    }, {
        "price": 290,
        "priceWithTax": 0,
        "date": "2018-05-12",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-05-12",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-13",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-13",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-14",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-14",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-15",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-15",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-16",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-16",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-17",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-17",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-18",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-18",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-19",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-19",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-20",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-20",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-21",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-21",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-22",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-22",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-23",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-23",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-24",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-24",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-25",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-25",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-26",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-26",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-27",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-27",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-28",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-28",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-29",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-29",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-30",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-30",
        "month": 1525104000000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-05-31",
        "flightno": "3U1014",
        "flightType": 1,
        "carrier": "3U1014",
        "depDate": "2018-05-31",
        "month": 1525104000000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-01",
        "flightno": "SC4622",
        "flightType": 1,
        "carrier": "SC4622",
        "depDate": "2018-06-01",
        "month": 1527782400000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-06-02",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-06-02",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-03",
        "flightno": "SC4622",
        "flightType": 1,
        "carrier": "SC4622",
        "depDate": "2018-06-03",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-04",
        "flightno": "SC4622",
        "flightType": 1,
        "carrier": "SC4622",
        "depDate": "2018-06-04",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-05",
        "flightno": "SC4622",
        "flightType": 1,
        "carrier": "SC4622",
        "depDate": "2018-06-05",
        "month": 1527782400000
    }, {
        "price": 640,
        "priceWithTax": 0,
        "date": "2018-06-06",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-06-06",
        "month": 1527782400000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-06-07",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-06-07",
        "month": 1527782400000
    }, {
        "price": 640,
        "priceWithTax": 0,
        "date": "2018-06-08",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-06-08",
        "month": 1527782400000
    }, {
        "price": 540,
        "priceWithTax": 0,
        "date": "2018-06-09",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-06-09",
        "month": 1527782400000
    }, {
        "price": 650,
        "priceWithTax": 0,
        "date": "2018-06-10",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-06-10",
        "month": 1527782400000
    }, {
        "price": 650,
        "priceWithTax": 0,
        "date": "2018-06-11",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-06-11",
        "month": 1527782400000
    }, {
        "price": 650,
        "priceWithTax": 0,
        "date": "2018-06-12",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-06-12",
        "month": 1527782400000
    }, {
        "price": 640,
        "priceWithTax": 0,
        "date": "2018-06-13",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-06-13",
        "month": 1527782400000
    }, {
        "price": 650,
        "priceWithTax": 0,
        "date": "2018-06-14",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-06-14",
        "month": 1527782400000
    }, {
        "price": 630,
        "priceWithTax": 0,
        "date": "2018-06-15",
        "flightno": "SC4622",
        "flightType": 1,
        "carrier": "SC4622",
        "depDate": "2018-06-15",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-16",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-06-16",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-17",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-06-17",
        "month": 1527782400000
    }, {
        "price": 630,
        "priceWithTax": 0,
        "date": "2018-06-18",
        "flightno": "SC4622",
        "flightType": 1,
        "carrier": "SC4622",
        "depDate": "2018-06-18",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-19",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-06-19",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-20",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-06-20",
        "month": 1527782400000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-06-21",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-06-21",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-22",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-06-22",
        "month": 1527782400000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-06-23",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-06-23",
        "month": 1527782400000
    }, {
        "price": 389,
        "priceWithTax": 0,
        "date": "2018-06-24",
        "flightno": "G54626",
        "flightType": 1,
        "carrier": "G54626",
        "depDate": "2018-06-24",
        "month": 1527782400000
    }, {
        "price": 389,
        "priceWithTax": 0,
        "date": "2018-06-25",
        "flightno": "G54626",
        "flightType": 1,
        "carrier": "G54626",
        "depDate": "2018-06-25",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-26",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-06-26",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-27",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-06-27",
        "month": 1527782400000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-06-28",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-06-28",
        "month": 1527782400000
    }, {
        "price": 410,
        "priceWithTax": 0,
        "date": "2018-06-29",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-06-29",
        "month": 1527782400000
    }, {
        "price": 400,
        "priceWithTax": 0,
        "date": "2018-06-30",
        "flightno": "CZ6479",
        "flightType": 1,
        "carrier": "CZ6479",
        "depDate": "2018-06-30",
        "month": 1527782400000
    }, {
        "price": 770,
        "priceWithTax": 0,
        "date": "2018-07-01",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-01",
        "month": 1530374400000
    }, {
        "price": 760,
        "priceWithTax": 0,
        "date": "2018-07-02",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-02",
        "month": 1530374400000
    }, {
        "price": 770,
        "priceWithTax": 0,
        "date": "2018-07-03",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-03",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-04",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-04",
        "month": 1530374400000
    }, {
        "price": 790,
        "priceWithTax": 0,
        "date": "2018-07-05",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-05",
        "month": 1530374400000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-07-06",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-06",
        "month": 1530374400000
    }, {
        "price": 770,
        "priceWithTax": 0,
        "date": "2018-07-07",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-07",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-08",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-08",
        "month": 1530374400000
    }, {
        "price": 760,
        "priceWithTax": 0,
        "date": "2018-07-09",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-09",
        "month": 1530374400000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-07-10",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-10",
        "month": 1530374400000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-07-11",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-11",
        "month": 1530374400000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-07-12",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-12",
        "month": 1530374400000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-07-13",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-13",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-14",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-14",
        "month": 1530374400000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-07-15",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-15",
        "month": 1530374400000
    }, {
        "price": 770,
        "priceWithTax": 0,
        "date": "2018-07-16",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-16",
        "month": 1530374400000
    }, {
        "price": 790,
        "priceWithTax": 0,
        "date": "2018-07-17",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-17",
        "month": 1530374400000
    }, {
        "price": 790,
        "priceWithTax": 0,
        "date": "2018-07-18",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-18",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-19",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-19",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-20",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-20",
        "month": 1530374400000
    }, {
        "price": 770,
        "priceWithTax": 0,
        "date": "2018-07-21",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-21",
        "month": 1530374400000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-07-22",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-22",
        "month": 1530374400000
    }, {
        "price": 760,
        "priceWithTax": 0,
        "date": "2018-07-23",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-23",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-24",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-24",
        "month": 1530374400000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-07-25",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-25",
        "month": 1530374400000
    }, {
        "price": 830,
        "priceWithTax": 0,
        "date": "2018-07-26",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-26",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-27",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-27",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-28",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-28",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-29",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-29",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-30",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-30",
        "month": 1530374400000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-07-31",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-07-31",
        "month": 1530374400000
    }, {
        "price": 790,
        "priceWithTax": 0,
        "date": "2018-08-01",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-01",
        "month": 1533052800000
    }, {
        "price": 790,
        "priceWithTax": 0,
        "date": "2018-08-02",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-02",
        "month": 1533052800000
    }, {
        "price": 790,
        "priceWithTax": 0,
        "date": "2018-08-03",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-03",
        "month": 1533052800000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-08-04",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-04",
        "month": 1533052800000
    }, {
        "price": 820,
        "priceWithTax": 0,
        "date": "2018-08-05",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-05",
        "month": 1533052800000
    }, {
        "price": 790,
        "priceWithTax": 0,
        "date": "2018-08-06",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-06",
        "month": 1533052800000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-08-07",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-07",
        "month": 1533052800000
    }, {
        "price": 790,
        "priceWithTax": 0,
        "date": "2018-08-08",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-08",
        "month": 1533052800000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-08-09",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-09",
        "month": 1533052800000
    }, {
        "price": 830,
        "priceWithTax": 0,
        "date": "2018-08-10",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-10",
        "month": 1533052800000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-08-11",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-11",
        "month": 1533052800000
    }, {
        "price": 840,
        "priceWithTax": 0,
        "date": "2018-08-12",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-12",
        "month": 1533052800000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-08-13",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-13",
        "month": 1533052800000
    }, {
        "price": 840,
        "priceWithTax": 0,
        "date": "2018-08-14",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-14",
        "month": 1533052800000
    }, {
        "price": 840,
        "priceWithTax": 0,
        "date": "2018-08-15",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-15",
        "month": 1533052800000
    }, {
        "price": 840,
        "priceWithTax": 0,
        "date": "2018-08-16",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-16",
        "month": 1533052800000
    }, {
        "price": 830,
        "priceWithTax": 0,
        "date": "2018-08-17",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-17",
        "month": 1533052800000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-08-18",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-18",
        "month": 1533052800000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-08-19",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-19",
        "month": 1533052800000
    }, {
        "price": 840,
        "priceWithTax": 0,
        "date": "2018-08-20",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-20",
        "month": 1533052800000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-08-21",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-21",
        "month": 1533052800000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-08-22",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-22",
        "month": 1533052800000
    }, {
        "price": 830,
        "priceWithTax": 0,
        "date": "2018-08-23",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-23",
        "month": 1533052800000
    }, {
        "price": 830,
        "priceWithTax": 0,
        "date": "2018-08-24",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-24",
        "month": 1533052800000
    }, {
        "price": 840,
        "priceWithTax": 0,
        "date": "2018-08-25",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-25",
        "month": 1533052800000
    }, {
        "price": 840,
        "priceWithTax": 0,
        "date": "2018-08-26",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-26",
        "month": 1533052800000
    }, {
        "price": 650,
        "priceWithTax": 0,
        "date": "2018-08-27",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-27",
        "month": 1533052800000
    }, {
        "price": 650,
        "priceWithTax": 0,
        "date": "2018-08-28",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-28",
        "month": 1533052800000
    }, {
        "price": 660,
        "priceWithTax": 0,
        "date": "2018-08-29",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-29",
        "month": 1533052800000
    }, {
        "price": 660,
        "priceWithTax": 0,
        "date": "2018-08-30",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-30",
        "month": 1533052800000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-08-31",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-08-31",
        "month": 1533052800000
    }, {
        "price": 680,
        "priceWithTax": 0,
        "date": "2018-09-01",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-01",
        "month": 1535731200000
    }, {
        "price": 680,
        "priceWithTax": 0,
        "date": "2018-09-02",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-02",
        "month": 1535731200000
    }, {
        "price": 650,
        "priceWithTax": 0,
        "date": "2018-09-03",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-03",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-04",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-04",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-05",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-05",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-06",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-06",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-07",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-07",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-08",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-08",
        "month": 1535731200000
    }, {
        "price": 650,
        "priceWithTax": 0,
        "date": "2018-09-09",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-09",
        "month": 1535731200000
    }, {
        "price": 680,
        "priceWithTax": 0,
        "date": "2018-09-10",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-10",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-11",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-11",
        "month": 1535731200000
    }, {
        "price": 680,
        "priceWithTax": 0,
        "date": "2018-09-12",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-12",
        "month": 1535731200000
    }, {
        "price": 840,
        "priceWithTax": 0,
        "date": "2018-09-13",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-13",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-14",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-14",
        "month": 1535731200000
    }, {
        "price": 680,
        "priceWithTax": 0,
        "date": "2018-09-15",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-15",
        "month": 1535731200000
    }, {
        "price": 680,
        "priceWithTax": 0,
        "date": "2018-09-16",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-16",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-17",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-17",
        "month": 1535731200000
    }, {
        "price": 680,
        "priceWithTax": 0,
        "date": "2018-09-18",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-18",
        "month": 1535731200000
    }, {
        "price": 640,
        "priceWithTax": 0,
        "date": "2018-09-19",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-19",
        "month": 1535731200000
    }, {
        "price": 670,
        "priceWithTax": 0,
        "date": "2018-09-20",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-20",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-21",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-21",
        "month": 1535731200000
    }, {
        "price": 680,
        "priceWithTax": 0,
        "date": "2018-09-22",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-22",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-23",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-23",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-24",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-24",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-25",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-25",
        "month": 1535731200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-09-26",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-26",
        "month": 1535731200000
    }, {
        "price": 840,
        "priceWithTax": 0,
        "date": "2018-09-27",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-27",
        "month": 1535731200000
    }, {
        "price": 800,
        "priceWithTax": 0,
        "date": "2018-09-28",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-28",
        "month": 1535731200000
    }, {
        "price": 830,
        "priceWithTax": 0,
        "date": "2018-09-29",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-29",
        "month": 1535731200000
    }, {
        "price": 830,
        "priceWithTax": 0,
        "date": "2018-09-30",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-09-30",
        "month": 1535731200000
    }, {
        "price": 810,
        "priceWithTax": 0,
        "date": "2018-10-01",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-10-01",
        "month": 1538323200000
    }, {
        "price": 830,
        "priceWithTax": 0,
        "date": "2018-10-02",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-10-02",
        "month": 1538323200000
    }, {
        "price": 880,
        "priceWithTax": 0,
        "date": "2018-10-03",
        "flightno": "CA8917",
        "flightType": 1,
        "carrier": "CA8917",
        "depDate": "2018-10-03",
        "month": 1538323200000
    }, {
        "price": 880,
        "priceWithTax": 0,
        "date": "2018-10-04",
        "flightno": "CA8917",
        "flightType": 1,
        "carrier": "CA8917",
        "depDate": "2018-10-04",
        "month": 1538323200000
    }, {
        "price": 880,
        "priceWithTax": 0,
        "date": "2018-10-05",
        "flightno": "CA8917",
        "flightType": 1,
        "carrier": "CA8917",
        "depDate": "2018-10-05",
        "month": 1538323200000
    }, {
        "price": 880,
        "priceWithTax": 0,
        "date": "2018-10-06",
        "flightno": "CA8917",
        "flightType": 1,
        "carrier": "CA8917",
        "depDate": "2018-10-06",
        "month": 1538323200000
    }, {
        "price": 830,
        "priceWithTax": 0,
        "date": "2018-10-07",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-10-07",
        "month": 1538323200000
    }, {
        "price": 830,
        "priceWithTax": 0,
        "date": "2018-10-08",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-10-08",
        "month": 1538323200000
    }, {
        "price": 880,
        "priceWithTax": 0,
        "date": "2018-10-09",
        "flightno": "CA8917",
        "flightType": 1,
        "carrier": "CA8917",
        "depDate": "2018-10-09",
        "month": 1538323200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-10-10",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-10-10",
        "month": 1538323200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-10-11",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-10-11",
        "month": 1538323200000
    }, {
        "price": 690,
        "priceWithTax": 0,
        "date": "2018-10-12",
        "flightno": "MU2518",
        "flightType": 1,
        "carrier": "MU2518",
        "depDate": "2018-10-12",
        "month": 1538323200000
    }],
    "priceTrendDetailInfo": {
        "price": 194,
        "priceWithTax": 194,
        "date": "2018-04-24",
        "flightno": "SC4626",
        "flightType": 1,
        "carrier": "SC4626",
        "depDate": "2018-04-24",
        "month": 1522512000000
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);