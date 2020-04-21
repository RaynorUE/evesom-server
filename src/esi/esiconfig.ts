export class ESIConfig  {
    private readonly baseUrl = "https://esi.evetech.net";
    private version = "/latest";
    private datasource = 'datasource=tranquility';

    setVersion (version:string):void {
        //strip trailing '/'
        version = version.replace(/\/$|^\//, '');

        this.version = '/' + version || '/latest';
    }

    setDataSource (datasource):void {
        this.datasource = datasource || 'tranquility';
    }

    /**
     * 
     * @param apiPath Path to the API we are using
     * @param excludeDataSource Do we exclude the ?dataSource={{datasource}} 
     * 
     * @return {{string}} A formatted URL based on current ESIConfig
     */
    buildUrl (apiPath:string, excludeDataSource?:boolean):string{
        /**
         * @todo Look at adding QueryParam handling in here, so an object of query params can be passed in.
         */
        apiPath = apiPath.replace(/\/$|^\//, '');
        
        let url = this.baseUrl + this.version + '/' + apiPath;
        if(!excludeDataSource){
            url+= '?' + this.datasource;
        }
        return url;
    }
}


