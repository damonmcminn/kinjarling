from argparse import ArgumentParser

parser = ArgumentParser(description='Service manager: add/update')
get_args = parser.parse_args

# parser.add_argument(
#     '--drop',
#     #dest='drop',
#     action='store_true',
#     default=None,
#     help='Drop the database'
# )

parser.add_argument(
    '--host',
    help='MongoDB host',
    default='localhost'
)

parser.add_argument(
    '--port',
    help='MongoDB port',
    default=27017
)

parser.add_argument(
    '--db',
    help='MongoDB database name',
    default='rt'
)

parser.add_argument(
    '--user',
    help='MongoDB username',
    default=None
)

parser.add_argument(
    '--password',
    help='MongoDB password',
    default=None
)

parser.add_argument(
    '--name',
    help='The Service name',
    required=True
)

parser.add_argument(
    '--save',
    help='Save a new Service',
    action='store_true'
)

parser.add_argument(
    '--new-key',
    help='Generate a new api key',
    action='store_true'
)
