module.exports = function(sequelize, DataTypes){
	sequelize.define('todo', {
		description:{
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 128]
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});	
};
