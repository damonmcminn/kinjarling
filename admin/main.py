from service import Service
from pymongo import MongoClient
from cli import get_args

def main():
    args = get_args()

    if not args.save and not args.new_key:
        print 'Either --save or --new-key required'
        return

    connection_string = 'mongodb://%s' % args.uri

    # instance of Collection
    db = MongoClient(connection_string).get_default_database().services
    service = Service(args.name, db)

    if args.save:
        print service.save()
    elif args.new_key:
        print service.new_api_key()

if __name__ == '__main__':
    main()
