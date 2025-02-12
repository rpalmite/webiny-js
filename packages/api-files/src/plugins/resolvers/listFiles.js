// @flow
import { ListResponse } from "@webiny/api";

export default async (root: any, args: Object, context: Object) => {
    const { File } = context.models;
    const {
        page = 1,
        perPage = 10,
        sort = null,
        search = "",
        types = [],
        tags = [],
        ids = []
    } = args;
    const findArgs = { page, perPage, sort };

    const $and = [];

    $and.push({ "meta.private": { $ne: true } }); // Files created by the system, eg. installation files.
    if (Array.isArray(types) && types.length) {
        $and.push({ type: { $in: types } });
    }

    if (search) {
        $and.push({
            $or: [
                { name: { $regex: `.*${search}.*`, $options: "i" } },
                { tags: { $in: search.split(" ") } }
            ]
        });
    }

    if (Array.isArray(tags) && tags.length > 0) {
        $and.push({
            tags: { $in: tags.map(tag => tag.toLowerCase()) }
        });
    }

    if (Array.isArray(ids) && ids.length > 0) {
        $and.push({
            id: { $in: tags }
        });
    }

    if ($and.length) {
        findArgs.query = { $and };
    }

    const data = await File.find(findArgs);
    return new ListResponse(data, data.getMeta());
};
