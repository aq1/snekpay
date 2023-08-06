// import { Axiom } from '@axiomhq/js'
// import { AXIOM_ORG_ID, AXIOM_TOKEN } from '$env/static/private'
//
// const axiom = new Axiom({
// 	token: AXIOM_TOKEN,
// 	orgId: AXIOM_ORG_ID
// })
//
// export default axiom

const axiom = {
	ingest(dataset: string, args: {msg: string, lvl: string}) {
		console.dir(args)
	}
}

export default axiom
