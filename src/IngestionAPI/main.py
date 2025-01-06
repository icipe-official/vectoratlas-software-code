# -*- coding: utf-8 -*-
import sys
from lib import align_data_old_to_new, load_occurrence, load_bionomics, load_resistance, excel_to_csv, load_data_from_csv
from database.connect import get_connection

def upload(datafile):
	print("uploading ...")
	load_occurrence(datafile)
	load_bionomics(datafile)
	load_resistance(datafile)
	print("uploading completed!")


def download(doi):
	print("downloading ...")
	print("downloading completed!")



if __name__ == '__main__':
	# excel_to_csv("./demo/latest_template.xlsx", target="./demo/template.csv")
	excel_to_csv("./demo/demo_data.xlsx", target="./demo/demo_old_data.csv")
	align_data_old_to_new("./demo/demo_old_data.csv", "./demo/data.csv")
	load_data_from_csv("./demo/data.csv")
	# get_connection()
	# load_data_from_csv("./demo/input/data.csv")
	# try:
	# 	operation = sys.argv[1] # either upload or download
	# 	param_value = sys.argv[2] # either the datafile path or the doi of the data to be downloaded
	# 	print(f"OPERATION: {operation} \n")
	# 	if operation == 'upload':
	# 		upload(datafile = param_value)
	# 	elif operation == 'download':
	# 		download(doi = param_value)
	# 	else:
	# 		print("CMD ERROR: your command should have one of the following forms:\n \
	# 			* python main.py upload <datafile_path>\n \
	# 			* python main.py download <doi>\n \
	# 			\n \
	# 			Please check and correct your command.")
	# except:
	# 	print("CMD ERROR: your command should have one of the following forms:\n \
	# 			* python main.py upload <datafile_path>\n \
	# 			* python main.py download <doi>\n \
	# 			\n \
	# 			Please check and correct your command.")
