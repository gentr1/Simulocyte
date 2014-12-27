this["JST"] = this["JST"] || {};

this["JST"]["assets/linker/templates/addUser.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<tr data-id="' +
__e( user.id ) +
'" data-model="user">\n\t\t\t';
 if (user.online) { ;
__p += '\n\t\t\t\t<td><img src="./images/icon-online.png"></td>\n\t\t\t';
 } else { ;
__p += '\n\t\t\t\t<td> <img src="./images/icon-offline.png"></td>\n\t\t\t';
 } ;
__p += '\n\t\t\t<td>' +
__e( user.id ) +
'</td>\n\t\t\t<td>' +
__e( user.name ) +
'</td>\n\t\t\t<td>' +
__e( user.title ) +
'</td>\n\t\t\t<td>' +
__e( user.email ) +
'</td>\n\t\t\t';
 if (user.admin) { ;
__p += '\n\t\t\t\t<td> <img src="/images/admin.png"></td>\n\t\t\t';
 } else { ;
__p += '\n\t\t\t\t<td> <img src="/images/pawn.png"></td>\n\t\t\t';
 } ;
__p += '\t\n\t\t\t<td><a href="/user/show/' +
__e( user.id ) +
'" class="btn btn-small btn-primary">Show</a></td>\n\t\t\t<td><a href="/user/edit/' +
__e( user.id ) +
'" class="btn btn-small btn-warning">Edit</a></td>\n\t\t\t<td><form action="/user/destroy/' +
__e( user.id ) +
'" method="POST">\n\t\t\t\t<input type="hidden" name="_method" value="delete"/>\n\t\t\t\t<input type="submit" class="btn btn-sm btn-danger" value="Delete"/>\n\t\t\t\t<input type="hidden" class="_csrf" name="_csrf" value="' +
__e( _csrf ) +
'" />\n\t\t\t</form></td>\n\t\t</tr> ';

}
return __p
};