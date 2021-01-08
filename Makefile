build/gz_2010_us_050_00_20m.zip:
	mkdir -p $(dir $@)
	curl -L -o $@ http://www2.census.gov/geo/tiger/GENZ2010/$(notdir $@)

build/gz_2010_us_050_00_20m.shp: build/gz_2010_us_050_00_20m.zip
	unzip -od $(dir $@) $<
	touch $@
	
build/counties.json: build/gz_2010_us_050_00_20m.shp build/CSV_ACSDP5Y2019.csv
	../node_modules/.bin/topojson \
	-o $@ \
	--id-property='STATE+COUNTY,fips' \
	--external-properties=build/CSV_ACSDP5Y2019.csv \
	--properties='county=county' \
	--properties='state=state' \
	--properties='population=+d.properties.population' \
	--projection='width = 960, height = 600, d3.geo.albersUsa() \
		.scale(1280) \
		.translate([width / 2, height / 2])' \
	--simplify=.5 \
	-- counties=$<

build/states.json: build/counties.json
	../node_modules/.bin/topojson-merge \
		-o $@ \
		--in-object=counties \
		--out-object=states \
		--key='d.id.substring(0, 2)' \
		--properties='state=d.properties.state' \
		-- $<

build/us.json: build/states.json
	../node_modules/.bin/topojson-merge \
		-o $@ \
		--in-object=states \
		--out-object=nation \
		-- $<

