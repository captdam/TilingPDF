'use strict';
const tile = async (file, tile, callback) => {
	const doc = await PDFLib.PDFDocument.create();
	const src = await PDFLib.PDFDocument.load(await file[0].arrayBuffer());

	try {
		for (let i = 0; i < src.getPageCount(); i++) {
			const pages = await doc.copyPages(src, Array(tile.x * tile.y).fill(i));
			const box = ((page) => {
				const box = page.getMediaBox();
				const size = page.getSize();
				return {
					x: box.x ?? 0,
					y: box.y ?? 0,
					w: box.w ?? size.width,
					h: box.h ?? size.height
				};
			})(pages[0]);
			const step = {x: box.w / tile.x, y: box.h / tile.y};
			
			for (let y = tile.y - 1; y >= 0; y--) {
				for (let x = 0; x < tile.x; x++) {
					const page = pages.shift();
					page.setMediaBox(box.x + x * step.x, box.y + y * step.y, step.x, step.y);
					doc.addPage(page);
				}
			}
		}
		
	} catch (e) {
		console.error(e);
	}
	
	callback(await doc.save());
};