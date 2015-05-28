from service import Service
from pymongo import MongoClient
from cli import get_args

def main():
    args = get_args()

    if not args.save and not args.new_key:
        print 'Either --save or --new-key required'
        return

    host = '%s:%d' % (args.host, args.port)
    if args.user:
        conn_string = 'mongodb://%s:%s@%s' % (args.user, args.password, host)
    else:
        conn_string = 'mongodb://%s' % host

    db = MongoClient(conn_string)[args.db].services
    service = Service(args.name, db)

    if args.save:
        print service.save()
    elif args.new_key:
        print service.new_api_key()

if __name__ == '__main__':
    main()
