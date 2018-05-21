export const notEmpty = (entity, value) => {
    if (!value || !value.trim())
        return entity + " must not empty."
    return ""
}

export const emailAddres = (entity, value) => {
    if (value && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
        return entity + " must be an email address."
    return ""
}

export const urlFormat = (entity, value) => {
    if (value && !/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(value))
        return entity + " must be a website address."
    return ""
}

export const isValid = (validationData) => {
    var fieldNames = Object.keys(validationData)
    let valid = true
    for (let i = 0; i < fieldNames.length; i++) {
        const fieldName = fieldNames[i]
        const validations = validationData[fieldName]
        let errors = ""
        if (validations) {
            var element = document.getElementById(fieldName)
            for (let i = 0; i < validations.length; i++) {
                const validate = validations[i]
                if (element) {
                    var error = validate(element.getAttribute("label"), element.value)
                    if (error) errors += "\n" + error
                }
            }
            if (errors) {
                var errorElement = document.getElementById("validator-for-" + fieldName)
                if (errorElement)
                    errorElement.innerHTML = errors
                valid = false
            }

        }
    }

    return valid
}