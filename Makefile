

deploy:
	npm run build
	aws --profile personal s3 sync ./dist s3://5040-hut.oram.ca --delete
	aws --profile personal cloudfront create-invalidation --distribution-id EIRREG8OAXA6P --paths "/*"