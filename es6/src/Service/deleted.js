export default function(id, ok) {

  let status;
  let response;

  if (ok > 0) {
    status = 200;
    response = {deleted: id};
  } else {
    status = 404;
    response = {id, message: 'Not found'};
  }

  return {status, response};

}
