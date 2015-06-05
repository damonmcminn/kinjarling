from argparse import ArgumentParser

parser = ArgumentParser(description='Service manager: add/update')
get_args = parser.parse_args

parser.add_argument(
    '--uri',
    help='MongoDB URI connection string',
    default='localhost:27017/kinjarling'
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
