this["JST"] = this["JST"] || {};

this["JST"]["assets/linker/templates/addUser.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<tr data-id="' +
__e( user.id ) +
'" data-model="user">\r\n\t\t\t';
 if (user.online) { ;
__p += '\r\n\t\t\t\t<td><img src="./images/icon-online.png"></td>\r\n\t\t\t';
 } else { ;
__p += '\r\n\t\t\t\t<td> <img src="./images/icon-offline.png"></td>\r\n\t\t\t';
 } ;
__p += '\r\n\t\t\t<td>' +
__e( user.id ) +
'</td>\r\n\t\t\t<td>' +
__e( user.name ) +
'</td>\r\n\t\t\t<td>' +
__e( user.title ) +
'</td>\r\n\t\t\t<td>' +
__e( user.email ) +
'</td>\r\n\t\t\t';
 if (user.admin) { ;
__p += '\r\n\t\t\t\t<td> <img src="/images/admin.png"></td>\r\n\t\t\t';
 } else { ;
__p += '\r\n\t\t\t\t<td> <img src="/images/pawn.png"></td>\r\n\t\t\t';
 } ;
__p += '\t\r\n\t\t\t<td><a href="/user/show/' +
__e( user.id ) +
'" class="btn btn-small btn-primary">Show</a></td>\r\n\t\t\t<td><a href="/user/edit/' +
__e( user.id ) +
'" class="btn btn-small btn-warning">Edit</a></td>\r\n\t\t\t<td><form action="/user/destroy/' +
__e( user.id ) +
'" method="POST">\r\n\t\t\t\t<input type="hidden" name="_method" value="delete"/>\r\n\t\t\t\t<input type="submit" class="btn btn-sm btn-danger" value="Delete"/>\r\n\t\t\t\t<input type="hidden" class="_csrf" name="_csrf" value="' +
__e( _csrf ) +
'" />\r\n\t\t\t</form></td>\r\n\t\t</tr> ';

}
return __p
};