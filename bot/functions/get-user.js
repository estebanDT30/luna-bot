module.exports = {
	getUser: function(id, client) {
		const result = client.fetchUser(id);
		return result;
	}
};