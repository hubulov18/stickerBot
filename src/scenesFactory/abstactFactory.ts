import Convert from "src/scenes/convert";
import CreateStickerPack from "../scenes/createStickerPack";
import RenameStickerPack from "../scenes/renameStickerPack";
import DeleteStickerPack from "../scenes/deleteStickerPack";
import Compression from "../scenes/compression";

export function sceneProducer(name: string) {
    switch (name) {
        case 'convert': return convertFactory()
        case 'createStickerPack': return createStickerPackFactory()
        case 'renameStickerPack': return renameStickerPackFactory()
        case 'deleteStickerPack': return deleteStickerPackFactory()
        case 'compression': return compressionFactory()
        default: break
    }

}

function convertFactory() {
    return new Convert();
}

function createStickerPackFactory() {
    return new CreateStickerPack();
}

function renameStickerPackFactory() {
    return new RenameStickerPack()
}

function deleteStickerPackFactory() {
    return new DeleteStickerPack()
}

function compressionFactory() {
    return new Compression()
}