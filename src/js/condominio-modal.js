define(function() {
    var condominioModal = { };

    condominioModal.transitionSelect = function() {
	var el = document.createElement("div");
	if(el.style.WebkitTransition) {
	    return "webkitTransitionEnd";
	}
	if(el.style.OTransition) {
	    return "oTransitionEnd";
	}
	return "transitionend";
    };
    condominioModal.objExtension = function(objTo, objFrom) {
	for(var p in objFrom) {
	    if(objFrom.hasOwnProperty(p)) {
		objTo[p] = objFrom[p];
	    }
	}
	return objTo;
    };
    condominioModal.Modal = function() {
	var self = this;

	self.btnClose = null;
	self.onClose = null;
	self.modal = null;
	self.overlay = null;

	var defaults = {
	    className: "fade-and-drop",
	    btnClose: true,
	    content: "",
	    maxWidth: 500,
	    minWidth: 250,
	    overlay: true
	};

	self.options = defaults;
	var param = arguments[0];
	if(param && typeof param === "object") {
	    self.options = condominioModal.objExtension(defaults, param);
	}
	["btnClose", "onClose", "modal", "overlay"].forEach(function(p) {
	    self[p] = self.options[p];
	});
	self.close = function() {
	    ["modal", "overlay"].forEach(function(p) {
		self[p].className = self[p].className.replace(" condominio-open", "");
		self[p].addEventListener(condominioModal.transitionSelect(), function() {
		    if(self[p].parentNode) {
			self[p].parentNode.removeChild(self[p]);
		    }
		});
	    });
	    if(self.onClose && typeof self.onClose === "function") {
		self.onClose.call(self);
	    }
	};

	self.open = function() {
	    build.call(self, function() {
		if(self.btnClose) {
		    ["btnClose", "overlay"].forEach(function(i) {
			self[i].addEventListener("click", self.close.bind(self));
		    });
		}
		window.getComputedStyle(self.modal).height;

		self.overlay.className = self.overlay.className + " condominio-open";
		self.modal.className = self.modal.className + " condominio-open";
		if(self.modal.offsetHeight > window.innerHeight) {
		    self.modal.className + " condominio-anchored";
		}
	    });
	};

	var build = function(callback) {
	    var content, contentHolder, docFrag;

	    docFrag = document.createDocumentFragment();
	    if(typeof self.options.content === "string") {
		content = self.options.content;
	    } else {
		content = self.options.content.innerHTML;
	    }
	    self.modal = document.createElement("div");
	    self.modal.className = "condominio-modal " + self.options.className;
	    self.modal.style.minWidth = self.options.minWidth + "px";
	    self.modal.style.maxWidth = self.options.maxWidth + "px";

	    if (self.options.btnClose === true) {
		self.btnClose = document.createElement("button");
		self.btnClose.className = "condominio-close close-button";
		self.btnClose.innerHTML = "x";
		self.modal.appendChild(self.btnClose);
	    }

	    if (self.options.overlay === true) {
		self.overlay = document.createElement("div");
		self.overlay.className = "condominio-overlay " + self.options.classname;
		docFrag.appendChild(self.overlay);
	    }

	    contentHolder = document.createElement("div");
	    contentHolder.className = "condominio-content";
	    contentHolder.innerHTML = content;
	    self.modal.appendChild(contentHolder);

	    docFrag.appendChild(self.modal);

	    document.body.appendChild(docFrag);

	    if(callback && typeof callback === "function") {
		callback.call(self);
	    }
	}
    };
    return condominioModal;
});