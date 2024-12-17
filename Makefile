

deploy:
	npm run build
	aws --profile personal s3 sync ./dist s3://5040-hut.oram.ca --delete
	aws --profile personal cloudfront create-invalidation --distribution-id EIRREG8OAXA6P --paths "/*"

#create_new_cron:
#aws --profile personal lambda create-function \
#		--region ca-central-1 \
#		--function-name HourlyHutLambda \
#		--runtime python3.13 \
#		--role arn:aws:iam::431568096872:role/5040-hut-cron \
#		--handler lambda_handler.lambda_handler \
#		--zip-file fileb://hourly_lambda_cron/lambda.zip

#	aws --profile personal --region ca-central-1 events put-rule --schedule-expression "cron(0 * * * ? *)" --name "HourlyHutLambda"
#	aws --profile personal --region ca-central-1 lambda add-permission --function-name HourlyHutLambda \
#      --statement-id "HourlyHutLambda" \
#      --action "lambda:InvokeFunction" \
#      --principal events.amazonaws.com \
#      --source-arn "arn:aws:events:ca-central-1:431568096872:rule/HourlyHutLambda"

update_cron:
	cd hourly_lambda_cron; pip install -t . -r requirements.txt
	rm -f hourly_lambda_cron/lambda.zip
	cd hourly_lambda_cron; zip -r lambda.zip .

	aws --profile personal lambda update-function-code --region ca-central-1 \
		--function-name HourlyHutLambda --zip-file fileb://hourly_lambda_cron/lambda.zip

trigger_cron:
	aws --profile personal --region ca-central-1 events put-targets --rule HourlyHutLambda --targets "Id"="1","Arn"="arn:aws:lambda:ca-central-1:431568096872:function:HourlyHutLambda"