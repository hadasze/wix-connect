import { updateTargetAudience } from './data-hooks-helpers/target-audience-hooks-helper.js'

export async function Communications_beforeInsert(item, context) {
    return await updateTargetAudience(item)
}

export async function Communications_beforeUpdate(item, context) {
    return await updateTargetAudience(item)
}