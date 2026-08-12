const z = require("zod");

const createnoteschema = z.object({
    text: z.string().trim().min(1),
    content: z.string(),
    category: z.string().trim().min(1),
    priority: z.string().min(1),
    completed: z.boolean().default(false)
});

const updateschema = createnoteschema.partial();

module.exports = {
    createnoteschema,
    updateschema
};