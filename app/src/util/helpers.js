export const formatSocial = (val) => {
    val = val.replace(/\D/g, '');
	val = val.replace(/^(\d{4})(\d).*/);
	// val = val.replace(/-(\d{2})/, '-$1-');
	// val = val.replace(/(\d)-(\d{4}).*/, '$1-$2');
	return val;
}

export const formatCC = (val) => {
    val = val.replace(/\D/g, '');
	val = val.replace(/^(\d{4})(\d).*/);
	return val;
}