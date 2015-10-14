import voidTags from '../spec/voidTags';
import validNamespaces from '../util/validNamespaces';

let ATTRIBUTE_REGEX = /([\w-]+)|('[^\']*')|("[^\"]*")/g;
let attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
let html5Data = /(data-)/g; // TODO
let rmultiDash = /[A-Z]/g; // TODO

export default tag => {
	let tokenIndex = 0;
	let key;
	let res = {
		type: 'tag',
		name: '',
		voidElement: false,
		attrs: {},
		children: []
	};

	// handle dynamic tags
	tag = tag.replace(/(__\$props__\[.*\])/g, "'$1'");
    // FIX ME! tag names should be validated to avoid chinese and arabic tags, and also avoid numberic and special chars.
	tag.replace(ATTRIBUTE_REGEX, match => {
		if (tokenIndex === 0) {
			if (voidTags[match] || tag.charAt(tag.length - 2) === '/') { // 'charAt' slow - consider slice etc?
				res.voidElement = true;
			}
			res.name = match;
		}
		else if (tokenIndex % 2) {
			key = match;
		}
		// Attributes - This need a heavy re-write
		else {
			// FIX ME! This doesn't handle HTML5 -* data, and dataset attribute correctly.
			
			// FIX ME! This doesn't handle boolean attributes / properties correctly. Overloaded booleans are not counted etc.

            // TODO! Handle xmlns attribute, and validate against valid namespaces
          
		  if (key !== 'xmlns') {
		      res.attrs[key] = match.replace(/['"]/g, '');
		  } else {
			  // validate namespaces
		      if (validNamespaces[key]) {
		          res.attrs[key] = match.replace(/['"]/g, '');
		      }
		  }		  
		}
		tokenIndex++;
	});

	return res;
};
