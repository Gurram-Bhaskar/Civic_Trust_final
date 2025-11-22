import React, { createContext, useContext, useState, useEffect } from 'react';

const CivicContext = createContext();

export const CivicProvider = ({ children }) => {
    const [reports, setReports] = useState([]);
    const [civicScore, setCivicScore] = useState(0);
    const [loading, setLoading] = useState(true);

    const API_URL = '/api';

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = getAuthHeaders();
                // Only fetch user data if we have a token
                const token = localStorage.getItem('token');

                const promises = [fetch(`${API_URL}/reports`)];
                if (token) {
                    promises.push(fetch(`${API_URL}/user`, { headers }));
                }

                const results = await Promise.all(promises);
                const reportsRes = results[0];
                const userRes = token ? results[1] : null;

                if (reportsRes.ok) {
                    const reportsData = await reportsRes.json();
                    setReports(reportsData);
                }

                if (userRes && userRes.ok) {
                    const userData = await userRes.json();
                    setCivicScore(userData.score);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const addReport = async (newReport) => {
        try {
            const res = await fetch(`${API_URL}/reports`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newReport)
            });
            if (!res.ok) throw new Error('Failed to add report');
            const savedReport = await res.json();
            setReports(prev => [savedReport, ...prev]);
            return savedReport;
        } catch (error) {
            console.error('Error adding report:', error);
            throw error;
        }
    };

    const incrementScore = async (points) => {
        try {
            const res = await fetch(`${API_URL}/user/score`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ points })
            });
            if (!res.ok) throw new Error('Failed to update score');
            const data = await res.json();
            setCivicScore(data.score);
            return data.score;
        } catch (error) {
            console.error('Error updating score:', error);
            throw error;
        }
    };

    const voteReport = async (reportId, type) => {
        try {
            const res = await fetch(`${API_URL}/reports/${reportId}/vote`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ type })
            });
            if (!res.ok) throw new Error('Failed to vote');
            const updatedReport = await res.json();
            setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const verifyFix = async (reportId, isFixed) => {
        try {
            const res = await fetch(`${API_URL}/reports/${reportId}/verify`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ isFixed })
            });
            if (!res.ok) throw new Error('Failed to verify');
            const updatedReport = await res.json();
            setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
        } catch (error) {
            console.error('Error verifying:', error);
        }
    };

    return (
        <CivicContext.Provider value={{ civicScore, reports, addReport, incrementScore, voteReport, verifyFix, loading }}>
            {children}
        </CivicContext.Provider>
    );
};

export const useCivic = () => useContext(CivicContext);
