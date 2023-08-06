import axiomjs from '@axiomhq/js'
import { AXIOM_ORG_ID, AXIOM_TOKEN } from '$env/static/private'

const axiom = new axiomjs.Axiom({
	token: AXIOM_TOKEN,
	orgId: AXIOM_ORG_ID
})

export default axiom
