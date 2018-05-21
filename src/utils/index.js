export const createSlug = (value) => {
    var slug = ""
    for (var i = 0; i < value.length; i++) {
        if (value[i] >= 'A' && value[i] <= 'z' || value[i] >= '0' && value[i] <= '9') {
            slug += value[i];
        }
        else {
            if (value[i] === ' ')
                if (slug[slug.length - 1] != '-')
                    slug += '-';
        }
    }
    return slug.toLowerCase();
}