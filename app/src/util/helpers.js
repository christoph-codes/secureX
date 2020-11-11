export const formatSocial = (val) => {
    val = val.replace(/\D/g, '');
	val = val.replace(/^(\d{3})-(\d{2})(\d)-(\d{4}).*/);
	// val = val.replace(/-(\d{2})/, '-$1-');
	// val = val.replace(/(\d)-(\d{4}).*/, '$1-$2');
	return val;
}

export const formatCC = (val) => {
    val = val.replace(/\D/g, '');
    val = val.substring(0,4) + '-' + val.substring(4,9) + '-' + val.substring(10,14) + '-' + val.substring(15,19);
    // val = val.match(/^(\d{1,4})/g).join('-');
    // val = val.split(val[5]);
    // val = val.split(val[9]);
    // val.join('-');
    console.log(val)
	return val;
}